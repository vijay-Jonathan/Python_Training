import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/ui/imagery.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { photo, cover, IMAGE_TOPICS } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const id = url => new URL(url).pathname;
let before = 0, after = 0;
for (const topic of IMAGE_TOPICS) {
  const ids = [...source.match(new RegExp(`  ${topic}: \\[([\\s\\S]*?)\\]`))[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  const urls = ids.map((_, index) => photo(index + 1, { topic }));
  assert.equal(new Set(urls.map(id)).size, ids.length, `${topic}: no repeats before pool exhaustion`);
  assert.equal(photo(1, {topic}), photo(String(1), {topic}));
  assert.equal(photo(1, {topic}), photo(1 + ids.length, {topic}));
  assert.deepEqual(ids.map((_, index) => photo("named-item", {topic, index})).map(id).sort(), ids.map(value => `/photo-${value}`).sort());
  assert.equal(id(photo(3, {topic, width: 400})), id(photo(3, {topic, width: 1200})));
  assert.equal(photo("record-slug", {topic}), photo("record-slug", 800, 600, topic));
  assert.equal(cover(topic), photo("cover", 1600, 900, topic));
  const hash = key => { let h = 0x811c9dc5; for (const char of key) h = Math.imul(h ^ char.charCodeAt(0), 0x01000193); return h >>> 0; };
  assert.equal(id(photo("record-slug", {topic})), `/photo-${ids[hash("record-slug") % ids.length]}`, "existing string mapping stays stable");
  before += new Set(ids.map((_, index) => hash(String(index + 1)) % ids.length)).size;
  after += new Set(urls).size;
}
for (const topic of [undefined, "unknown", "constructor", "__proto__"]) {
  const url = photo(null, {topic, width: NaN, height: -10});
  assert(url.startsWith("data:image/svg+xml,"));
  const svg = decodeURIComponent(url.split(",")[1]);
  assert(!svg.includes("<image") && !svg.includes("href="), "fallback must not load remote imagery");
  assert(svg.includes('width="800" height="600"'));
  assert(!svg.includes("NaN"));
}
assert.notEqual(photo("one"), photo("two"));
assert.equal(photo("one"), photo("one"));
console.log(`${IMAGE_TOPICS.length} topic pools passed; distinct images for consecutive IDs: ${before} before -> ${after} after`);
