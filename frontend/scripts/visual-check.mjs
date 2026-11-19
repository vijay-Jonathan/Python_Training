// Dependency-free browser checks against real kit components. Requires Chrome/Chromium.
// CHROME_PATH overrides the executable; VISUAL_OUTPUT optionally saves review screenshots.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inspectPage } from "./visual-inspect.mjs";

const chrome = process.env.CHROME_PATH || [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/chromium", "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);
assert(chrome, "Set CHROME_PATH to a Chrome/Chromium executable");
const root = fileURLToPath(new URL("../", import.meta.url));
const target = process.env.VISUAL_BASE_URL;
const server = target ? null : await (await import("vite")).createServer({ root, server: { host: "127.0.0.1", port: 0 }, logLevel: "error" });
await server?.listen();
const origin = target || server.resolvedUrls.local[0];
const profile = await mkdtemp(join(tmpdir(), "laas-visual-"));
const browser = spawn(chrome, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "about:blank"], { windowsHide: true, stdio: "ignore" });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let port;
  for (let i = 0; i < 50 && !port; i++) {
    try { port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]); }
    catch { await delay(100); }
  }
  assert(port, "Chrome did not start");
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = new WebSocket(targets.find(target => target.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  const renderingErrors = [];
  socket.onmessage = ({ data }) => {
    const result = JSON.parse(data), request = pending.get(result.id);
    if (result.method === "Runtime.exceptionThrown") renderingErrors.push(result.params.exceptionDetails.text);
    if (request) { pending.delete(result.id); result.error ? request.reject(result.error) : request.resolve(result.result); }
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
    setTimeout(() => { if (pending.delete(id)) reject(new Error(`Timeout: ${method}`)); }, 15000).unref();
  });
  const evaluate = async expression => {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await call("Runtime.enable");
  const customFixtures = process.argv.includes("--custom-fixtures");
  if (target || customFixtures) {
    const routes = JSON.parse(process.env.VISUAL_ROUTES || (customFixtures
      ? '["/scripts/fixtures/custom.html?view=store","/scripts/fixtures/custom.html?view=dashboard"]'
      : '["/"]'));
    assert(Array.isArray(routes) && routes.length > 0 && routes.length <= 6, "Choose 1–6 representative routes");
    for (const route of routes) {
      for (const width of [390, 1440]) {
        renderingErrors.length = 0;
        await call("Emulation.setDeviceMetricsOverride", {width, height: 1000, deviceScaleFactor: 1, mobile: false});
        await call("Page.navigate", {url: new URL(route, target || origin).href});
        // Cold dev-server compilation can outlast a fixed sleep. Wait for
        // content, then allow a short bounded grace for route data to settle.
        for (let i = 0; i < 80; i++) {
          if (await evaluate("document.readyState === 'complete' && document.body.innerText.trim().length > 0")) break;
          await delay(100);
        }
        await delay(500);
        const report = await evaluate(`(${inspectPage.toString()})()`);
        console.log(JSON.stringify({route, width, ...report, renderingErrors}));
        if (process.env.VISUAL_OUTPUT) {
          const output = resolve(process.env.VISUAL_OUTPUT);
          await mkdir(output, {recursive: true});
          const shot = await call("Page.captureScreenshot", {format: "png", captureBeyondViewport: true});
          await writeFile(join(output, `route-${routes.indexOf(route)}-${width}.png`), Buffer.from(shot.data, "base64"));
          await writeFile(join(output, `route-${routes.indexOf(route)}-${width}.json`), JSON.stringify({route, width, ...report, renderingErrors}, null, 2));
        }
        // Capture failures too: repair and review need evidence of the broken page.
        if (!report.rendered || report.overflow || report.escapedUnicode || report.brokenImages.length || report.brokenBackgrounds.length || report.failedFrames || report.missingImagery.length || renderingErrors.length) process.exitCode = 1;
      }
    }
  } else {
  await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const captureOnly = process.argv.includes("--capture-only");
  const cases = captureOnly ? [["editorial", "light", 390, "site", "classic"], ["default", "light", 1440, "workspace", "topnav"]] :
    ["default", "marketplace", "editorial", "dashboard", "booking", "saas"].flatMap(preset =>
      ["light", "dark"].flatMap(theme => [320, 390, 768, 1440].map(width => [preset, theme, width, "workspace", "topnav"])))
      .concat(["site", "landing", "workspace"].flatMap(view =>
        (view === "site" ? ["classic", "masthead"] : view === "landing" ? ["hero", "split", "minimal", "banner"] : ["sidebar", "rail"]).flatMap(layout =>
          [390, 768, 1440].map(width => ["editorial", "light", width, view, layout]))));
  let completed = 0;
  for (const [preset, theme, width, view, layout] of cases) {
    const label = `${preset}-${theme}-${width}-${view}-${layout}`;
    await call("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await call("Page.navigate", { url: `${origin}scripts/fixtures/design.html?${new URLSearchParams({preset, theme, view, layout})}` });
    let ready = false;
    for (let i = 0; i < 80; i++) {
      ready = await evaluate("document.querySelectorAll('.card').length === 4");
      if (ready) break;
      await delay(100);
    }
    assert(ready, `${label}: fixture did not render`);
    await delay(50);
    const result = await evaluate(`(() => {
      const rect = s => document.querySelector(s).getBoundingClientRect();
      const css = s => getComputedStyle(document.querySelector(s));
      const cards = [...document.querySelectorAll('[data-test=featured] .card')];
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        theme: document.documentElement.dataset.theme,
        navVisible: !document.querySelector('.site-nav') || css('.site-nav').display !== 'none',
        formFits: rect('[data-test=form-grid]').width <= rect('.form-card').width,
        footerBottoms: cards.map(c => c.querySelector('.card-footer').getBoundingClientRect().bottom),
        cardWidths: cards.map(c => c.getBoundingClientRect().width),
        splitColumns: css('[data-test=split]').gridTemplateColumns.split(' ').length,
        motion: parseFloat(css('.card').transitionDuration),
      };
    })()`);
    if (!captureOnly) {
      assert.equal(result.theme, theme, `${label}: wrong theme`);
      assert(!result.overflow, `${label}: page overflow`);
      assert(result.navVisible, `${label}: missing navigation`);
      assert(result.formFits, `${label}: form overflow`);
      assert(result.motion < 0.001, `${label}: reduced motion ignored`);
      if (width === 1440) {
        assert.equal(result.splitColumns, 2, `${label}: even split missing`);
        assert(result.cardWidths[0] > result.cardWidths[1] * 1.5, `${label}: featured composition missing`);
        assert(Math.max(...result.footerBottoms) - Math.min(...result.footerBottoms) < 2, `${label}: footer alignment`);
      }
    }
    if (process.env.VISUAL_OUTPUT && (captureOnly || (preset === "editorial" && theme === "light" && width !== 768))) {
      const output = resolve(process.env.VISUAL_OUTPUT);
      await mkdir(output, { recursive: true });
      const shot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
      await writeFile(join(output, `${label}.png`), Buffer.from(shot.data, "base64"));
    }
    if (++completed % 12 === 0) console.log(`Checked ${completed}/${cases.length} layouts`);
  }
  // Keyboard focus is visible without introducing hover movement.
  await call("Page.bringToFront");
  await call("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  await evaluate("document.querySelector('.card-interactive').focus()");
  assert(await evaluate("document.querySelector('.card-interactive').matches(':focus-visible')"));
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.card-interactive')).boxShadow"), "none");
  await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await evaluate("document.querySelector('.card-interactive').scrollIntoView({block: 'center', behavior: 'instant'})");
  const point = await evaluate("(() => { const r = document.querySelector('.card-interactive').getBoundingClientRect(); return {x:r.x + 10, y:r.y + 10}; })()");
  await call("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
  await delay(250);
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.card-interactive')).transform"), "none", "hover should lift interactive cards");
  await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await delay(50);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.card-interactive')).transform"), "none", "reduced motion should remove hover lift");
  console.log(`${cases.length} responsive/theme/layout cases passed${captureOnly ? ' (capture only)' : ''}`);
  for (const width of [390, 1440]) {
    await call("Emulation.setDeviceMetricsOverride", {width, height: 1000, deviceScaleFactor: 1, mobile: false});
    await call("Page.navigate", {url: `${origin}scripts/fixtures/images.html`});
    let failed;
    for (let i = 0; i < 80; i++) {
      failed = await evaluate("document.querySelector('#recovery')?.dataset.imageState === 'failed'");
      if (failed) break;
      await delay(100);
    }
    assert(failed, "failed image must expose a labelled fallback");
    assert(await evaluate("getComputedStyle(document.querySelector('.landing-hero')).getPropertyValue('--landing-image').includes('data:image/svg+xml')"), "omitted hero image must not fetch an unrelated workspace photo");
    assert(await evaluate("document.querySelector('#recovery [role=img]').getAttribute('aria-label').includes('Replaced image')"));
    const before = await evaluate(`(${inspectPage.toString()})()`);
    assert.equal(before.failedFrames, 1, "verifier must catch hidden failed images");
    assert(before.missingImagery.some(item => item.kind === "card_without_image" && item.text.includes("Image absent")), "verifier must catch a card without an image");
    assert(before.missingImagery.some(item => item.kind === "clipped_representative_note" && item.selector === "#clipped-note"), "verifier must catch clipped representative labels");
    assert(!before.missingImagery.some(item => item.selector === "#visible-note"), "visible labels must not be flagged");
    await evaluate("document.querySelector('#clipped-note-container').style.overflow = 'visible'");
    await evaluate("document.querySelector('#recover').click()");
    const after = await evaluate(`(${inspectPage.toString()})()`);
    assert(!after.missingImagery.some(item => item.kind === "clipped_representative_note"), "unclipped labels must not be flagged");
    assert.equal(await evaluate("document.querySelector('#recovery').dataset.imageState"), "ready");
    assert(!after.overflow && !after.failedFrames && !after.brokenImages.length);
    assert.equal(after.missingFrames, 1, "intentional missing photo stays labelled");
    // Also prove the checker catches native broken images and CSS backgrounds.
    await evaluate("const bad = document.createElement('img'); bad.src = 'data:image/png;base64,broken'; document.body.append(bad); document.body.style.backgroundImage = 'url(data:image/png;base64,broken)'");
    const broken = await evaluate(`(${inspectPage.toString()})()`);
    assert.equal(broken.brokenImages.length, 1);
    assert.equal(broken.brokenBackgrounds.length, 1);
  }
  assert.equal(renderingErrors.length, 0, "fixture rendering exceptions");
  console.log("Image fallback, recovery and visual-verifier checks passed at desktop/mobile widths");
  }
  await call("Browser.close");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  socket?.close();
  browser.kill();
  await server?.close();
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
