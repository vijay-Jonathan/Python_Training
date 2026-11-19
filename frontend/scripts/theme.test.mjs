import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/ui/useTheme.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function initialize({ authored, stored, designId, designStored, dark = false, unavailable = false }) {
  const attrs = new Map([["data-palette", "teal"]]);
  if (authored !== undefined) attrs.set("data-theme", authored);
  if (designId) attrs.set("data-design-id", designId);
  const values = new Map();
  if (stored !== undefined) values.set("app-theme", stored);
  if (designStored) values.set(`app-theme:${designId}`, designStored);
  const document = {
    documentElement: {
      getAttribute: (name) => attrs.get(name) ?? null,
      setAttribute: (name, value) => attrs.set(name, value),
    },
  };
  const localStorage = {
    getItem: (key) => {
      if (unavailable) throw new Error("storage unavailable");
      return values.get(key) ?? null;
    },
    setItem: (key, value) => {
      if (unavailable) throw new Error("storage unavailable");
      values.set(key, value);
    },
  };
  const window = { matchMedia: () => ({ matches: dark }) };
  const module = { exports: {} };
  const require = (name) => {
    assert.equal(name, "react");
    return {};
  };
  new Function("require", "exports", "module", "document", "window", "localStorage", compiled)(
    require, module.exports, module, document, window, localStorage,
  );
  return { attrs, values, api: module.exports };
}

for (const [name, input, expected] of [
  ["stored overrides authored and system", { stored: "light", authored: "dark", dark: true }, "light"],
  ["stored dark overrides authored light", { stored: "dark", authored: "light" }, "dark"],
  ["authored dark overrides light system", { authored: "dark" }, "dark"],
  ["authored light overrides dark system", { authored: "light", dark: true }, "light"],
  ["invalid stored value falls back to authored", { stored: "invalid", authored: "dark" }, "dark"],
  ["invalid authored value falls back to system", { authored: "Light", dark: true }, "dark"],
  ["missing attribute uses dark system", { dark: true }, "dark"],
  ["missing attribute uses light system", {}, "light"],
  ["unavailable storage uses authored", { authored: "dark", unavailable: true }, "dark"],
]) {
  const { attrs, values, api } = initialize(input);
  assert.equal(attrs.get("data-theme"), expected, name);
  assert.equal(attrs.get("data-palette"), "teal", name);
  assert.equal(values.get("app-theme"), input.stored, `${name}: no initial persistence`);
  api.setTheme(expected === "dark" ? "light" : "dark");
  assert.equal(attrs.get("data-theme"), expected === "dark" ? "light" : "dark", name);
  console.log(`pass ${name}`);
}

const redesign = initialize({ authored: "dark", stored: "light", designId: "new-design" });
assert.equal(redesign.attrs.get("data-theme"), "dark", "old theme must not override redesign");
redesign.api.setTheme("light");
assert.equal(redesign.values.get("app-theme:new-design"), "light");
const restored = initialize({ authored: "dark", designId: "new-design", designStored: "light" });
assert.equal(restored.attrs.get("data-theme"), "light", "current-design preference persists");
console.log("pass redesign theme isolation and current-design preferences");
