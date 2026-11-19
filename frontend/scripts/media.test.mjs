import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(name, react = React, dependencies = {}) {
  const path = new URL(`../src/ui/${name}`, import.meta.url);
  const source = readFileSync(path, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (id) => {
    if (id in dependencies) return dependencies[id];
    if (id === "react") return react;
    if (id === "./icon") return load("icon.tsx");
    if (id === "./props") return load("props.ts");
    if (id === "./imagery") return load("imagery.ts");
    return require(id);
  };
  new Function("require", "module", "exports", compiled)(localRequire, module, module.exports);
  return module.exports;
}

const { RemoteImage } = load("Media.tsx");
const render = (props) => renderToStaticMarkup(React.createElement(RemoteImage, props));
assert.doesNotMatch(render({ src: "https://example.com/car.jpg", alt: "car", representative: true }), /media-representative/);
assert.match(render({ src: "https://example.com/car.jpg", alt: "car", representative: true, representativeNote: "Vehicle" }), /Vehicle/);
assert.doesNotMatch(render({ src: "https://example.com/car.jpg", alt: "car" }), /media-representative/);
const missing = render({ src: null, alt: "car", representative: true, icon: "car" });
assert.match(missing, /Image unavailable/);
assert.match(missing, /media-mark/);
assert.doesNotMatch(missing, /media-representative|<img/);
console.log("RemoteImage representative and placeholder states passed");

// Exercise the existing load/error handlers without adding a DOM dependency.
const slots = [null, null];
let calls = 0;
let inCard = false;
const { RemoteImage: StatefulImage } = load("Media.tsx", {
  ...React,
  useContext: () => inCard,
  useState: () => {
    const slot = calls++ % 2;
    return [slots[slot], (next) => { slots[slot] = next; }];
  },
});
const props = { src: "/images/selected/photo.jpg", alt: "Photo" };
const frame = (extra = {}) => StatefulImage({ ...props, ...extra });
const img = (tree) => tree.props.children.find((child) => child?.type === "img");
assert.equal(frame().props["data-image-state"], "loading");
assert.match(frame().props.className, /media-16x9/);
assert.equal(img(frame()).props.loading, "lazy");
assert.equal(img(frame()).props.fetchpriority, undefined);
assert.equal(img(frame({ priority: true })).props.loading, "eager");
assert.equal(img(frame({ priority: true })).props.fetchpriority, "high");
img(frame()).props.onLoad();
assert.equal(frame().props["data-image-state"], "ready");
assert.equal(img(frame()).props["data-loading"], undefined);
assert.equal(frame({ src: "/replacement.jpg" }).props["data-image-state"], "loading");
img(frame()).props.onError();
assert.equal(frame().props["data-image-state"], "failed");
assert.equal(img(frame()), undefined);
assert.ok(frame().props.children.some((child) => child?.props?.className === "media-fallback"));
assert.equal(frame({ src: null }).props["data-image-state"], "missing");
console.log("RemoteImage priority, reserved frame, load and error transitions passed");

slots[0] = slots[1] = null;
const full = `/images/selected/${"a".repeat(64)}.jpg`;
const thumbUrl = `/images/selected/${"a".repeat(64)}-w640v1.jpg`;
assert.equal(img(frame({ src: full })).props.src, full);
inCard = true;
assert.equal(img(frame({ src: full })).props.src, thumbUrl);
assert.equal(img(frame({ src: full, priority: true })).props.src, full);
assert.equal(img(frame({ src: full, thumb: false })).props.src, full);
assert.equal(img(frame({ src: "https://example.com/x.jpg" })).props.src, "https://example.com/x.jpg");
img(frame({ src: full })).props.onError();
assert.equal(img(frame({ src: full })).props.src, full);
assert.equal(frame({ src: full }).props["data-image-state"], "loading");
inCard = false;
console.log("RemoteImage card thumbnail selection and full-size fallback passed");

// Custom cards outside Card let the browser choose the thumbnail by rendered width.
slots[0] = slots[1] = null;
assert.equal(img(frame({ src: full })).props.srcSet, `${thumbUrl} 640w, ${full} 1280w`);
assert.equal(img(frame({ src: full })).props.sizes, "auto, 100vw");
for (const extra of [{ priority: true }, { thumb: false }, { thumb: true }, { src: "https://example.com/x.jpg" }]) {
  assert.equal(img(frame({ src: full, ...extra })).props.srcSet, undefined);
}
img(frame({ src: full })).props.onError();
assert.equal(img(frame({ src: full })).props.srcSet, undefined);
assert.equal(frame({ src: full }).props["data-image-state"], "loading");
img(frame({ src: full })).props.onError();
assert.equal(frame({ src: full }).props["data-image-state"], "failed");
// A cached image is ready before paint; an uncached one keeps its skeleton.
slots[0] = slots[1] = null;
img(frame()).ref({ complete: false, naturalWidth: 0 });
assert.equal(frame().props["data-image-state"], "loading");
img(frame()).ref({ complete: true, naturalWidth: 640 });
assert.equal(frame().props["data-image-state"], "ready");
img(frame()).ref(null);
console.log("RemoteImage responsive thumbnails, single retry and cached display passed");

const { Landing } = load("Landing.tsx", { ...React, useEffect: () => {} }, {
  "./AppShell": { PaletteMenu: () => null, ThemeToggle: () => null },
  "./design": { useDesign: ({ layout }) => ({ layout }) },
  "./useTheme": { setDefaultPalette: () => {} },
});
for (const layout of ["hero", "split", "banner", "minimal"]) {
  const tree = Landing({ title: "Welcome", image: props.src, layout });
  const links = tree.props.children.filter((child) => child?.type === "link");
  assert.equal(links.length, layout === "minimal" ? 0 : 1);
  if (links.length) {
    assert.equal(links[0].props.rel, "preload");
    assert.equal(links[0].props.as, "image");
    assert.equal(links[0].props.fetchpriority, "high");
    const hero = tree.props.children.find((child) => child?.type === "section");
    assert.equal(hero.props.style["--landing-image"], `url("${links[0].props.href}")`);
  }
}
console.log("Landing preloads its exact background URL only for image layouts");
