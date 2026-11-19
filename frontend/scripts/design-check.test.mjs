/**
 * Fixture tests for the design check's whole-app and table rules.
 *
 * No framework: each case is a src/ tree written to a temp dir and checked by
 * running scripts/design-check.mjs against it — the same entry point the
 * build stage runs, so a rule that fires (or fails to) is proven end to end.
 *
 *   node scripts/design-check.test.mjs
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CHECK = fileURLToPath(new URL("./design-check.mjs", import.meta.url));

function check(files) {
  const root = mkdtempSync(join(tmpdir(), "design-check-"));
  for (const [name, text] of Object.entries(files)) {
    const path = join(root, "src", name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  try {
    const out = execFileSync(process.execPath, [CHECK, join(root, "src")], {
      encoding: "utf8",
    });
    return { code: 0, out };
  } catch (error) {
    return { code: error.status, out: `${error.stdout}${error.stderr}` };
  }
}

const SHELL = (nav) =>
  `import { AppShell } from "../ui";\n` +
  `export function P() { return <AppShell brand="x" palette="teal" nav={${nav}} />; }\n`;

const cases = [
  {
    name: "selected art direction cannot silently keep the empty default style",
    files: { "design/direction.json": '{"art_direction":{"hero":"Custom hero"}}',
      "design/custom.css": '/* no implementation */' },
    want: { code: 1, ids: ["missing-custom-composition"] },
  },
  {
    name: "custom semantic composition and scoped CSS pass",
    files: { "pages/Home.tsx": 'export const P = () => <main><nav>Home</nav><h1>Showroom</h1></main>;',
      "design/custom.css": '[data-design-mode="custom"] { --brand: #181818; } [data-design-mode="custom"] h1 { color: var(--brand); }' },
    want: { code: 0, ids: [] },
  },
  {
    name: "custom CSS rejects remote imports",
    files: { "design/custom.css": '@import "https://example.test/x.css"; [data-design-mode="custom"] { color: red; }' },
    want: { code: 1, ids: ["unsafe-css"] },
  },
  {
    name: "static useEffect without API fetch needs no loading state",
    files: { "pages/Static.tsx": 'import { useEffect } from "react"; export const P = () => { useEffect(() => { document.title = "Hello"; }, []); return <main>Static</main>; };' },
    want: { code: 0, ids: [], absent: ["DESIGN-no-loading-state"] },
  },
  {
    name: "data screen with loading and error states passes",
    files: { "pages/Records.tsx": 'import { listTasks } from "../api/tasks";\nimport { useEffect } from "react";\nexport const P = () => { useEffect(() => { listTasks(); }, []); return <main><Skeleton /><Alert tone="danger">Failed</Alert></main>; };' },
    want: { code: 0, ids: [], absent: ["DESIGN-no-loading-state", "DESIGN-no-error-state"] },
  },
  {
    name: "literal escaped Unicode in JSX is rejected",
    files: { "pages/Home.tsx": String.raw`export const P = () => <h1>Hello \u2014 world</h1>;` },
    want: { code: 1, ids: ["escaped-unicode"] },
  },
  {
    name: "a focused single-screen generated app passes",
    files: {
      "pages/HomePage.tsx": SHELL('[{ id: "tasks", label: "Tasks" }]'),
      "api/tasks.ts": 'export const list = () => fetch("/v1/tasks");',
    },
    want: { code: 0, ids: [] },
  },
  {
    name: "a compact landing needs no filler bands",
    files: {
      "pages/LandingPage.tsx":
        'export const P = () => <Landing brand="Studio" image="photography" title="Selected work" />;',
    },
    want: { code: 0, ids: [] },
  },
  {
    name: "a public portfolio needs no AppShell or dashboard",
    files: {
      "pages/Projects.tsx":
        'export const P = () => <SiteShell brand="Studio" links={[]}><div className="grid"><RemoteImage src={photo("coast", { topic: "photography" })} alt="Coastal study" /></div></SiteShell>;',
    },
    want: { code: 0, ids: [] },
  },
  {
    name: "a single-screen AppShell still needs a palette",
    files: {
      "pages/HomePage.tsx": 'export const P = () => <AppShell brand="Bookings" />;',
      "api/bookings.ts": "export {};",
    },
    want: { code: 1, ids: ["DESIGN-unthemed-app"] },
  },
  {
    name: "a custom theme supplies the application accent",
    files: {
      "pages/HomePage.tsx": 'export const P = () => <AppShell brand="Bookings" />;',
      "styles/theme.css": "/* laas-design: custom */\n:root { --accent: #123456; }",
    },
    want: { code: 0, ids: [] },
  },
  {
    name: "the default theme stub does not supply an accent",
    files: {
      "pages/HomePage.tsx": 'export const P = () => <AppShell brand="Bookings" />;',
      "styles/theme.css": "/* Customizable design layer, empty by default. */",
    },
    want: { code: 1, ids: ["DESIGN-unthemed-app"] },
  },
  {
    name: "a custom theme does not suppress other rules",
    files: {
      "pages/HomePage.tsx":
        'const colour = "#ffffff"; export const P = () => <AppShell brand="Bookings" />;',
      "styles/theme.css": "/* laas-design: custom */",
    },
    want: { code: 1, ids: ["DESIGN-raw-colour"], absent: ["DESIGN-unthemed-app"] },
  },
  {
    name: "a compact landing still rejects raw colours",
    files: {
      "pages/LandingPage.tsx":
        'const colour = "#ffffff"; export const P = () => <Landing image="photography" />;',
    },
    want: { code: 1, ids: ["DESIGN-raw-colour"] },
  },
  {
    name: "three page files pass",
    files: {
      "pages/HomePage.tsx": SHELL('[{ id: "a", label: "A" }]'),
      "pages/Records.tsx": SHELL("[]"),
      "pages/Settings.tsx": SHELL("[]"),
      "api/tasks.ts": "export {};",
    },
    want: { code: 0, ids: [] },
  },
  {
    name: "three nav-driven views in one file pass",
    files: {
      "pages/HomePage.tsx": SHELL(
        '[{ id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }]',
      ),
      "api/tasks.ts": "export {};",
    },
    want: { code: 0, ids: [] },
  },
  {
    // The design variants are props, not CSS: preset/layout on the shells
    // and palette on the first shell still satisfy the unthemed-app rule.
    name: "an app styled with design variants passes",
    files: {
      "pages/ShopPage.tsx":
        'export const P = () => <AppShell brand="Shop" preset="marketplace" layout="topnav" palette="teal">items</AppShell>;',
      "pages/LandingPage.tsx":
        'export const L = () => <Landing layout="split" preset="marketplace" title="Shop" />;',
      "api/items.ts": "export {};",
    },
    want: { code: 0, ids: [] },
  },
  {
    name: "a raw table fails",
    files: { "pages/HomePage.tsx": "export const T = () => <table><tr><td>x</td></tr></table>;" },
    want: { code: 1, ids: ["DESIGN-raw-table"] },
  },
  {
    name: "a kit table passes",
    files: {
      "pages/HomePage.tsx":
        'export const T = () => <div className="table-wrap"><table className="table"><tr><td>x</td></tr></table></div>;',
    },
    want: { code: 0, ids: [] },
  },
  {
    // The form modal the loading-state rule used to fail: it POSTs on submit
    // and its effect only resets its own fields, so it has no panel to skeleton.
    name: "a form modal whose effect does not fetch owes no loading state",
    files: {
      "components/TaskFormModal.tsx":
        'import { createTask } from "../api/tasks";\nimport { useEffect, useState } from "react";\n' +
        "export const M = ({ open }) => {\n" +
        '  const [title, setTitle] = useState("");\n' +
        '  useEffect(() => { if (open) setTitle(""); }, [open]);\n' +
        "  return <form onSubmit={() => createTask({ title })} />;\n" +
        "};\n",
      "api/tasks.ts": "export const createTask = (t) => Promise.resolve(t);",
    },
    want: { code: 0, ids: [] },
  },
  {
    name: "a screen whose effect does fetch still owes one",
    files: {
      "pages/Records.tsx":
        'import { listTasks } from "../api/tasks";\nimport { useEffect, useState } from "react";\n' +
        "export const P = () => {\n" +
        "  const [rows, setRows] = useState([]);\n" +
        "  useEffect(() => { listTasks().then(setRows); }, []);\n" +
        "  return <div>{rows.length}</div>;\n" +
        "};\n",
      "api/tasks.ts": "export const listTasks = () => Promise.resolve([]);",
    },
    want: { code: 1, ids: ["DESIGN-no-loading-state"] },
  },
  {
    name: "a renamed or namespaced api import is still seen fetching",
    files: {
      "pages/Other.tsx":
        'import * as api from "../api/tasks";\nimport { useEffect, useState } from "react";\n' +
        "export const P = () => {\n" +
        "  const [rows, setRows] = useState([]);\n" +
        "  useEffect(() => { api.listTasks().then(setRows); }, []);\n" +
        "  return <div>{rows.length}</div>;\n" +
        "};\n",
      "api/tasks.ts": "export const listTasks = () => Promise.resolve([]);",
    },
    want: { code: 1, ids: ["DESIGN-no-loading-state"] },
  },
];

let failed = 0;
for (const { name, files, want } of cases) {
  const result = check(files);
  const missing = want.ids.filter((id) => !result.out.includes(id));
  const unexpected = (want.absent ?? []).filter((id) => result.out.includes(id));
  const ok = result.code === want.code && missing.length === 0 && unexpected.length === 0;
  if (!ok) {
    failed += 1;
    console.error(`FAIL ${name}\n  code ${result.code} (want ${want.code})\n${result.out}`);
  } else {
    console.log(`pass ${name}`);
  }
}
process.exitCode = failed === 0 ? 0 : 1;

// DataTable props satisfy the list-state rules: a records screen with
// loading/empty on the table is complete without hand-written states.
{
  const ok = check({
    "pages/Records.tsx":
      'import { getX } from "../api/x"; import { useEffect, useState } from "react";\n' +
      'export const P = () => { const [r, s] = useState([]); useEffect(() => { getX().then(s); }, []);\n' +
      'return <DataTable columns={[]} rows={r} rowKey="id" loading={r === null} empty={<div>none</div>} />; };',
    "api/x.ts": "export const getX = () => Promise.resolve([]);",
  });
  if (ok.out.includes("no-loading-state") || ok.out.includes("no-empty-state")) {
    failed += 1;
    console.error("FAIL DataTable satisfies loading/empty\n" + ok.out);
  } else console.log("pass DataTable satisfies loading/empty");
}
