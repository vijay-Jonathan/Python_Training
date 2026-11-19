import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const chrome = process.env.CHROME_PATH || [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/chromium", "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);

let report = { ok: false, error: "Chrome/Chromium not found" };
let profile, browser, socket, closeBrowser;
try {
  if (chrome && existsSync(chrome)) {
    profile = await mkdtemp(join(tmpdir(), "laas-page-probe-"));
    browser = spawn(chrome, [
      "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
      "--no-first-run", "--no-default-browser-check", "about:blank",
    ], { windowsHide: true, stdio: "ignore" });
    browser.on("error", () => {});
    let port;
    for (let i = 0; i < 50 && !port; i++) {
      try { port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]); }
      catch { await delay(100); }
    }
    if (!port) throw new Error("Chrome did not start");
    const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    socket = new WebSocket(targets.find(target => target.type === "page").webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    let nextId = 0, apiFailed = false;
    const pending = new Map(), requests = new Map(), inFlight = new Set();
    const apiRequests = [], failedRequests = [], consoleErrors = [], exceptions = [];
    const pathOf = url => { try { return new URL(url).pathname; } catch { return ""; } };
    socket.onmessage = ({ data }) => {
      const event = JSON.parse(data), params = event.params || {}, pendingCall = pending.get(event.id);
      if (pendingCall) {
        pending.delete(event.id);
        event.error ? pendingCall.reject(new Error(event.error.message)) : pendingCall.resolve(event.result);
      }
      if (event.method === "Network.requestWillBeSent") {
        requests.set(params.requestId, { method: params.request.method, path: pathOf(params.request.url) });
        if (["Fetch", "XHR"].includes(params.type)) inFlight.add(params.requestId);
      } else if (event.method === "Network.responseReceived") {
        const request = requests.get(params.requestId);
        if (request?.path.startsWith("/api/")) {
          if (params.response.status >= 400) apiFailed = true;
          if (apiRequests.length < 30) apiRequests.push({ ...request, status: params.response.status });
        }
      } else if (event.method === "Network.loadingFailed") {
        inFlight.delete(params.requestId);
        const request = requests.get(params.requestId);
        if (request && failedRequests.length < 30) failedRequests.push({ path: request.path, error: String(params.errorText).slice(0, 300) });
      } else if (event.method === "Network.loadingFinished") {
        inFlight.delete(params.requestId);
      } else if (event.method === "Runtime.exceptionThrown" && exceptions.length < 10) {
        exceptions.push(String(params.exceptionDetails.exception?.description || params.exceptionDetails.text).slice(0, 300));
      } else if (event.method === "Runtime.consoleAPICalled" && params.type === "error" && consoleErrors.length < 10) {
        consoleErrors.push(params.args.map(arg => arg.value ?? arg.description ?? "").join(" ").slice(0, 300));
      } else if (event.method === "Log.entryAdded" && params.entry.level === "error" && consoleErrors.length < 10) {
        consoleErrors.push(String(params.entry.text).slice(0, 300));
      }
    };
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (pending.delete(id)) reject(new Error(`Timeout: ${method}`)); }, 5000).unref();
    });
    const evaluate = async expression => {
      const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    const settle = async () => {
      await delay(300);
      const deadline = Date.now() + 3000;
      while (Date.now() < deadline) {
        const busy = await evaluate(`!!document.querySelector('[aria-busy="true"],[role="progressbar"],.skeleton,.spinner,.loading')`);
        if (!inFlight.size && !busy) break;
        await delay(150);
      }
      await delay(200);
    };
    const inspect = async ({ expect, scan }) => {
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      const label = el => `${el.tagName.toLowerCase()}${[...el.classList].map(c => `.${c}`).join("")}`;
      const hiddenReason = (el, opacityOnly) => {
        let opacity = 1;
        if (!opacityOnly && getComputedStyle(el).visibility !== "visible") return "visibility hidden";
        for (let node = el; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          opacity *= Number(style.opacity);
          if (!opacityOnly && style.display === "none") return `display:none on ${label(node)}`;
        }
        return opacity < 0.05 ? `opacity ${opacity.toFixed(2)}` : null;
      };
      const nodes = () => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const result = [];
        while (walker.nextNode()) result.push(walker.currentNode);
        return result;
      };
      const needle = expect?.toLowerCase();
      const candidates = () => [...document.body.querySelectorAll("*")].filter(el => {
        if (![...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim())) return false;
        if (el.closest('[aria-hidden="true"],[role="tooltip"]') || !el.getClientRects().length) return false;
        const rect = el.getBoundingClientRect(), style = getComputedStyle(el);
        if (rect.width <= 1 || rect.height <= 1 || rect.left + scrollX < -1000 || rect.top + scrollY < -1000) return false;
        for (let node = el; node; node = node.parentElement) {
          const s = getComputedStyle(node);
          if (s.clipPath !== "none" || (s.clip !== "auto" && s.clip !== "")) return false;
        }
        return style.visibility === "visible" && style.pointerEvents !== "none" && hiddenReason(el, true);
      });
      let hidden = [];
      if (scan && document.body) {
        hidden = candidates();
        if (hidden.length) {
          await sleep(300);
          hidden = candidates();
          for (const el of hidden.slice(0, 8)) {
            el.scrollIntoView({ block: "center", behavior: "instant" });
            await sleep(120);
          }
          hidden = candidates();
          window.scrollTo(0, 0);
        }
      }
      const textNodes = document.body ? nodes() : [];
      const matches = needle ? textNodes.filter(node => node.nodeValue.toLowerCase().includes(needle)) : [];
      const visibleText = textNodes.filter(node => !hiddenReason(node.parentElement, false))
        .map(node => node.nodeValue).join("").replace(/\s+/g, " ").toLowerCase();
      const bodyText = (document.body?.innerText || "").replace(/\s+/g, " ").toLowerCase();
      const visible = matches.some(node => !hiddenReason(node.parentElement, false))
        || !!needle && bodyText.includes(needle.replace(/\s+/g, " ")) && visibleText.includes(needle.replace(/\s+/g, " "));
      const expected = needle ? {
        text: expect, in_dom: (document.body?.textContent || "").toLowerCase().includes(needle),
        visible, reason: visible ? null : matches.length ? hiddenReason(matches[0].parentElement, false) : "text not visible",
      } : undefined;
      return {
        expect: expected,
        hidden_content: hidden.slice(0, 5).map(el => ({
          selector: label(el), text: el.innerText.trim().slice(0, 80), reason: hiddenReason(el, true),
        })),
      };
    };
    const inspectPage = args => evaluate(`(${inspect.toString()})(${JSON.stringify(args)})`);
    closeBrowser = () => call("Browser.close");
    await Promise.all([call("Network.enable"), call("Runtime.enable"), call("Log.enable"), call("Page.enable")]);
    await call("Page.navigate", { url: new URL(process.env.PROBE_ROUTE || "/", process.env.PROBE_BASE_URL).href });
    const deadline = Date.now() + 5000;
    let loaded = false;
    while (Date.now() < deadline && !loaded) {
      const state = await call("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
      loaded = state.result.value === "complete";
      if (!loaded) await delay(100);
    }
    await settle();
    const click = process.env.PROBE_CLICK, expect = process.env.PROBE_EXPECT;
    let navigation;
    if (click) {
      navigation = await evaluate(`(${((needle) => {
        const from = location.pathname + location.search;
        const el = [...document.querySelectorAll('a,button,[role="link"],[role="button"]')].find(node => {
          if (!((node.innerText || "") + " " + (node.getAttribute("aria-label") || "")).toLowerCase().includes(needle.toLowerCase())) return false;
          let opacity = 1;
          for (let parent = node; parent; parent = parent.parentElement) {
            const style = getComputedStyle(parent);
            opacity *= Number(style.opacity);
            if (style.display === "none" || style.visibility !== "visible") return false;
          }
          return opacity >= 0.05 && node.getClientRects().length > 0;
        });
        if (!el) return { clicked: false };
        el.click();
        return { clicked: true, from };
      }).toString()})(${JSON.stringify(click)})`);
      if (navigation.clicked) {
        await settle();
        navigation.to = await evaluate("location.pathname + location.search");
      }
    }
    if (expect) {
      const deadline = Date.now() + 3000;
      while (Date.now() < deadline) {
        if ((await inspectPage({ expect, scan: false })).expect.visible) break;
        await delay(250);
      }
    }
    const inspection = await inspectPage({ expect, scan: true });
    const page = await call("Runtime.evaluate", {
      expression: "JSON.stringify({title:document.title,text:document.body?.innerText || ''})",
      returnByValue: true,
    });
    const { title, text } = JSON.parse(page.result.value);
    const visibleErrorText = text.split(/\r?\n/).map(line => line.trim())
      .filter(line => /could not|couldn't|failed|error|unable|something went wrong|connection issue/i.test(line))
      .slice(0, 5).map(line => line.slice(0, 300));
    report = {
      ok: loaded && !apiFailed && !failedRequests.length && !exceptions.length && !visibleErrorText.length
        && !inspection.hidden_content.length && (!expect || inspection.expect.visible) && (!click || navigation.clicked),
      loaded, title, text_excerpt: text.slice(0, 500), api_requests: apiRequests,
      failed_requests: failedRequests, console_errors: consoleErrors, exceptions, visible_error_text: visibleErrorText,
      hidden_content: inspection.hidden_content, ...(expect ? { expect: inspection.expect } : {}),
      ...(click ? { navigation } : {}),
    };
  }
} catch (error) {
  report = { ok: false, error: String(error.message || error).slice(0, 300) };
} finally {
  if (closeBrowser && socket?.readyState === WebSocket.OPEN) {
    await Promise.race([closeBrowser().catch(() => {}), delay(1000)]);
  }
  socket?.close();
  if (browser && browser.exitCode === null) {
    const exited = new Promise(resolve => browser.once("exit", resolve));
    await Promise.race([exited, delay(1000)]);
    if (browser.exitCode === null) {
      browser.kill();
      await Promise.race([exited, delay(1500)]);
    }
  }
  if (profile) await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
}
console.log(JSON.stringify(report));
