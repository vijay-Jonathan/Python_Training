// Executed inside the browser by visual-check.mjs; no production imports.
export async function inspectPage() {
  const images = [...document.images];
  images.forEach(image => { image.loading = "eager"; });
  const wait = image => new Promise(resolve => {
    if (image.complete) return resolve(image.naturalWidth > 0);
    const done = () => { clearTimeout(timer); resolve(image.naturalWidth > 0); };
    const timer = setTimeout(() => resolve(false), 4000);
    image.addEventListener("load", done, {once: true});
    image.addEventListener("error", done, {once: true});
  });
  const loaded = await Promise.all(images.map(wait));
  const backgrounds = new Set();
  for (const element of document.querySelectorAll("*")) {
    for (const pseudo of [null, "::before", "::after"]) {
      const css = getComputedStyle(element, pseudo);
      if (css.display === "none" || (pseudo && ["none", "normal"].includes(css.content))) continue;
      for (const match of css.backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)) backgrounds.add(match[1]);
    }
  }
  const backgroundResults = await Promise.all([...backgrounds].map(async src => {
    const image = new Image(); image.src = src;
    return {src, ok: await wait(image)};
  }));
  const visible = element => {
    const rect = element.getBoundingClientRect(), css = getComputedStyle(element);
    return rect.width >= 80 && rect.height >= 80 && css.display !== "none" &&
      css.visibility !== "hidden" && Number(css.opacity) !== 0;
  };
  const selector = element => {
    if (element.id) return `#${CSS.escape(element.id)}`;
    const parts = [];
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      const siblings = node.parentElement ? [...node.parentElement.children].filter(e => e.tagName === node.tagName) : [];
      parts.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(node) + 1})`);
    }
    return parts.join(" > ");
  };
  const describe = (kind, element) => ({
    kind, text: (element.innerText || element.getAttribute("aria-label") || "").trim().slice(0, 160),
    selector: selector(element),
  });
  const all = [...document.querySelectorAll("*")];
  const placeholders = all.filter(element => visible(element) &&
    /placeholder|no-?image|image-?missing|img-?missing|media-fallback|unavailable/i.test(
      `${element.id} ${typeof element.className === "string" ? element.className : ""}`));
  const missingImagery = placeholders.map(element => describe("placeholder", element));
  const clippedNote = element => {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const css = getComputedStyle(parent), box = parent.getBoundingClientRect();
      if (css.display === "none" || css.visibility === "hidden" || Number(css.opacity) === 0) return false;
      if (["hidden", "clip"].includes(css.overflowY) && (rect.top >= box.bottom || rect.bottom <= box.top)) return true;
      if (["hidden", "clip"].includes(css.overflowX) && (rect.left >= box.right || rect.right <= box.left)) return true;
    }
    return false;
  };
  for (const element of all) {
    if (!element.children.length && /\brepresentative(?:\s+\w+){0,3}\s+image\b/i.test(element.innerText || "") && clippedNote(element)) {
      missingImagery.push(describe("clipped_representative_note", element));
    }
  }
  const imagePresent = card => [...card.querySelectorAll("img")].some(image => image.complete && image.naturalWidth > 0) ||
    [card, ...card.querySelectorAll("*")].some(element => {
      const matches = [...getComputedStyle(element).backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)];
      return matches.some(match => backgroundResults.some(result => result.src === match[1] && result.ok));
    });
  for (const parent of all) {
    const cards = [...parent.children].filter(element =>
      /card|tile|product|item|listing|destination/i.test(typeof element.className === "string" ? element.className : "") &&
      element.querySelector("h1,h2,h3,h4,h5,h6") &&
      (element.querySelector("a[href]") || /[$€£]\s*\d|\d\s*(?:USD|EUR|GBP)/i.test(element.innerText)));
    if (cards.length < 2) continue;
    const present = cards.map(imagePresent);
    if (present.some(Boolean)) cards.forEach((card, index) => {
      if (!present[index] && visible(card)) missingImagery.push(describe("card_without_image", card));
    });
  }
  // Bounded evidence from the existing capture, not another rendering/review pass.
  // Record computed roles on actual elements rather than treating CSS declarations as use.
  const designEvidence = document.documentElement.dataset.designMode === "custom"
    ? [...new Set([
        ...[...document.querySelectorAll('h1,h2')].slice(0, 2),
        ...[...document.querySelectorAll('nav,header')].slice(0, 1),
        ...[...document.querySelectorAll('section')].slice(0, 4),
        ...[...document.querySelectorAll('button,[role="button"]')].slice(0, 2),
        ...[...document.querySelectorAll('[class*="card"]')].slice(0, 1),
        ...[...document.querySelectorAll('.media')].slice(0, 2),
      ])]
      .filter(element => {
        const rect = element.getBoundingClientRect();
        for (let node = element; node; node = node.parentElement) {
          const css = getComputedStyle(node);
          if (css.display === "none" || css.visibility === "hidden" || Number(css.opacity) === 0) return false;
        }
        return rect.width > 0 && rect.height > 0;
      }).map(element => {
        const css = getComputedStyle(element), rect = element.getBoundingClientRect();
        const family = css.fontFamily.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
        const faces = [...document.fonts].filter(face => face.family.replace(/^['"]|['"]$/g, "") === family);
        return {
          selector: selector(element), tag: element.tagName.toLowerCase(),
          text: (element.innerText || "").trim().slice(0, 80),
          color: css.color, background: css.backgroundColor, border: css.borderColor,
          radius: css.borderRadius, shadow: css.boxShadow,
          fontFamily: css.fontFamily, fontSize: css.fontSize, fontWeight: css.fontWeight,
          lineHeight: css.lineHeight, letterSpacing: css.letterSpacing,
          declaredFontStatus: faces.some(face => face.status === "loaded") ? "loaded"
            : faces.length ? faces.map(face => face.status).join(",") : "absent_or_system",
          padding: css.padding, gap: css.gap, width: Math.round(rect.width), height: Math.round(rect.height),
        };
      }) : [];
  return {
    designEvidence,
    designEvidenceLimit: "Sampled rendered elements; absent roles and actual glyph fonts remain unverified.",
    escapedUnicode: /\\u[0-9a-fA-F]{4}/.test(document.body.innerText),
    designMode: document.documentElement.dataset.designMode,
    theme: document.documentElement.dataset.theme,
    headings: [...document.querySelectorAll("h1,h2")].map(e => e.textContent),
    typography: document.querySelector("h1") ? getComputedStyle(document.querySelector("h1")).fontFamily : null,
    navigation: [...document.querySelectorAll("nav a")].map(e => e.textContent),
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    brokenImages: images.filter((_, index) => !loaded[index]).map(image => image.getAttribute("src")),
    failedFrames: document.querySelectorAll('[data-image-state="failed"]').length,
    missingFrames: document.querySelectorAll('[data-image-state="missing"]').length,
    missingImagery,
    placeholderFrames: placeholders.length,
    brokenBackgrounds: backgroundResults.filter(result => !result.ok).map(result => result.src),
    rendered: document.body.innerText.trim().length > 0 && !document.querySelector("vite-error-overlay"),
  };
}
