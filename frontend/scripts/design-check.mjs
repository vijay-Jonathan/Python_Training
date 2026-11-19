/**
 * The design rules, enforced rather than described.
 *
 * `tsc` proves the application compiles and `vite build` proves it bundles.
 * Neither has an opinion about whether it looks like anything, so the UI rules
 * the agent is given — compose the kit, never write a colour, handle all three
 * async states — were the only part of the brief with no consequence for
 * ignoring it. This script is that consequence: it exits non-zero, the build
 * stage reports it like a type error, and the repair loop sends the agent back
 * to fix it.
 *
 * Deliberately small and deliberately literal. Every rule here is a *stated*
 * rule with a mechanical signature, because a false positive costs the user a
 * whole repair cycle: a rule that needs taste to judge belongs in the prompt,
 * not in this file. Nothing here parses TypeScript — a regex over source is
 * enough for "is there a hex colour in it", and a parser would be a dependency
 * the generated application is not allowed to have.
 *
 * Why some rules only warn
 * ------------------------
 *
 * Run over the 59 applications this platform had generated before the rules
 * were enforced, the first version of this file failed every single one of
 * them — a median of 31 findings each, against a repair budget of two
 * attempts. A gate nothing can pass is not a quality bar, it is a build
 * failure with extra steps, and it would have been strictly worse than not
 * checking at all.
 *
 * Two rules were 71% of that volume: `inline-style` (462 findings) and
 * `raw-control` (248). Both are real, both are worth fixing, and neither is
 * fixable at eight-per-application inside one repair. So they report and do
 * not fail. What fails the build is the set that is both cheap to fix and rare
 * — roughly five findings per application across the whole corpus, each of
 * them a one-line change.
 *
 * Warnings are not decoration: they are printed on every run and they travel
 * in the output a repair prompt carries, so an agent sent back for a hard
 * finding sees the soft ones beside it and usually fixes both. Moving a rule
 * from `warn` to `error` is a one-word change here, and the honest time to
 * make it is when generated applications stop producing it in bulk.
 *
 * Scope is the agent's own code: `src/ui` and `src/styles` are the pre-written
 * kit and are exempt, since they are where the colours and the raw <button>
 * elements legitimately live.
 *
 *   node scripts/design-check.mjs
 *
 * Output is one line per finding, in the shape `tsc` uses, so a file and a
 * line are in the same vocabulary everything downstream already reads:
 *
 *   src/pages/Home.tsx(42,10): error DESIGN-raw-colour: ...
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const FRONTEND = fileURLToPath(new URL("..", import.meta.url));
// Optionally a src tree to check instead of this app's own (the rule tests
// point it at fixtures); file ids are still reported as src/... paths.
const SOURCE = process.argv[2] ?? join(FRONTEND, "src");

// The pre-written design system. Exempt because it is the one place a colour,
// a raw control and a style object are the right answer — and because the agent
// is told not to touch it, so a finding here would be unactionable anyway.
const EXEMPT = ["src/ui", "src/styles"];

// Enough to diagnose, few enough to read. A run with fifty findings has one
// cause, and listing all fifty buries it.
const MAX_FINDINGS = 20;

const CODE_FILE = /\.tsx?$/;

/**
 * Rules that fire on a single line, checked against every line of every file.
 *
 * `test` gets the line; a rule reports the column it matched at, so the
 * finding points at the offending construct rather than at the file.
 */
const LINE_RULES = [
  {
    id: "escaped-unicode",
    pattern: />[^<{]*\\u[0-9a-fA-F]{4}/,
    message: "literal escaped Unicode in JSX text. Use the actual character or a JS expression.",
  },
  {
    id: "raw-colour",
    // Hex, rgb() and hsl(). The design system carries every colour the
    // application is allowed to wear, in both themes and on eight accents, so
    // a literal here is a value that will be wrong in dark mode.
    pattern: /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\s*\(/,
    message:
      "a literal colour. Use the design system: a palette on <AppShell>, or a " +
      "token like var(--accent) / var(--text) / var(--surface).",
  },
  {
    id: "inline-style",
    // 462 findings across the corpus — see the note at the top of this file.
    severity: "warn",
    // `style={stagger(i)}` is the supported escape hatch and does not match
    // this, because it is a call rather than an object literal.
    pattern: /style=\{\{/,
    message:
      "an inline style object. Compose the classes in styles/components.css " +
      "instead; for a stagger index use style={stagger(i)} from \"../ui\".",
  },
  {
    id: "raw-control",
    // 248 findings across the corpus. The most visually damaging thing on the
    // soft list by some way — a raw control has no focus ring, no hover and no
    // dark mode — but a checkout page with ten of them is ten edits, which is
    // more than a repair attempt can carry.
    severity: "warn",
    pattern: /<(?:button|input|select|textarea)[\s/>]/,
    message:
      "a raw form control. Use Button / IconButton / Input / Select / " +
      "Textarea / Checkbox from \"../ui\".",
  },
];

/**
 * A JSX element by name. The trailing class is what keeps `<Landing` from
 * matching `<LandingPage`, which is a different component in the same tree and
 * was the first thing this script got wrong about itself.
 */
const tag = (name) => new RegExp(`<${name}[\\s/>]`);

/**
 * Rules about a file as a whole — a prop that must be present somewhere in it,
 * a state a data screen must handle. Each one states the condition that makes
 * it apply, so a rule about loading states says nothing about a file that
 * loads nothing.
 *
 * `anchor` is where a finding points. Matched against the code with comments
 * stripped, so a rule never reports the line of the docstring that describes
 * the component rather than the line that uses it.
 */
const FILE_RULES = [
  {
    id: "untopiced-photo",
    applies: (text) => /\bphoto\(/.test(text),
    holds: (text) => photoCallsAreTopiced(text),
    anchor: /\bphoto\(/,
    message:
      "photo() without a topic, which returns an abstract placeholder instead " +
      "of a picture of the subject. Pass one of the curated topics, e.g. " +
      'photo(record.id, { topic: "realestate" }).',
  },
  {
    id: "no-loading-state",
    applies: isDataScreen,
    // <DataTable loading=...> carries the skeleton inside itself.
    holds: (text) => /\b(?:Skeleton|Spinner)\b/.test(text) || /<DataTable[^>]*\bloading=/.test(text),
    anchor: /\buseEffect\(/,
    message:
      "a screen that loads data with no loading state. Render a <Skeleton> " +
      "while the request is in flight — a blank panel reads as a broken app.",
  },
  {
    id: "no-error-state",
    applies: isDataScreen,
    holds: (text) => tag("Alert").test(text),
    anchor: /\buseEffect\(/,
    message:
      "a screen that loads data with no failure state. Render an " +
      '<Alert tone="danger"> when the request fails.',
  },
  {
    id: "raw-table",
    // `table-wrap > table.table` is the styled form — styled header, row
    // hover, cell padding, scroll on overflow. A bare <table> renders as a
    // wall of unstyled text.
    applies: (text) => /<table[\s>]/.test(text),
    holds: (text) =>
      [...text.matchAll(/<table\b[^>]*/g)].every((tag) =>
        /className\s*=\s*(?:"[^"]*\btable\b|`[^`]*\btable\b|\{[^}]*\btable\b)/.test(
          tag[0],
        ),
      ),
    anchor: /<table[\s>]/,
    message:
      "a raw <table>. Use <DataTable> for tabular records — search, sort, " +
      "pagination, loading and empty states come with it; .table-wrap > " +
      "table.table with th/td and .num only for a static table.",
  },
  {
    id: "no-empty-state",
    // Only when the screen holds a *collection* it renders — the case where
    // "nothing yet" is a state the user can actually reach. A file mapping a
    // literal array is not one, which is why this reads the useState type.
    applies: (text) =>
      isDataScreen(text) && /useState<[^>]*\[\]|useState\(\s*\[\s*\]/.test(text) && /\.map\(/.test(text),
    // <DataTable empty=...> renders one when the filtered list is empty.
    holds: (text) => tag("EmptyState").test(text) || /<DataTable[^>]*empty=/.test(text),
    anchor: /\.map\(/,
    message:
      "a list with no empty state. Render an <EmptyState> when there is " +
      "nothing yet, so the first screen is never a blank panel.",
  },
];

/**
 * Rules about the application as a whole, checked once over every file.
 *
 * A third kind, and it exists because of a mistake worth recording. "Every
 * `<AppShell>` has a palette" looks like a file rule and was written as one —
 * but `palette` calls `setDefaultPalette`, so it is a property of the
 * application and not of the screen, and the agent is told in the same breath
 * to set it ONCE and never per screen. Asked for it on all five shells of a
 * five-page application, the check was demanding exactly what the prompt
 * forbids, and every one of those findings was a repair attempt spent making
 * the code worse.
 *
 * So the question a rule asks has to match the scope the thing belongs to. A
 * rule about the application asks it once.
 */
// Screen and landing-band counts depend on the requested workflow, not a
// universal layout quota. Keep mechanical styling and data-state checks.
const PROJECT_RULES = [
  {
    id: "unthemed-app",
    applies: (files, customTheme) =>
      !customTheme && files.some((file) => tag("AppShell").test(file.text)),
    holds: (files) => files.some((file) => /\bpalette=/.test(file.text)),
    // Reported against the first shell in the application, which is the one
    // the accent belongs on.
    locate: (files) => files.find((file) => tag("AppShell").test(file.text)),
    anchor: tag("AppShell"),
    message:
      "the application never chooses an accent. Set it ONCE, on the first " +
      "<AppShell>, from indigo / emerald / violet / amber / rose / teal / " +
      "cyan / slate — it is a default for the whole application, so do not " +
      "repeat it on other screens. A generated custom theme also supplies an " +
      "accent. Without either, every generated application is the same colour.",
  },
];

/**
 * Whether a file both fetches from the API and renders the result.
 *
 * "Imports the api module and mentions useEffect" was too wide, and the files
 * it caught were always the same kind: a form or a modal that POSTs on submit
 * and whose effect only resets its fields when it opens. There is no loading
 * panel to render in one of those — the control's own `loading` state is the
 * answer — so the finding was noise, and noise in this check is expensive: it
 * comes back to the agent as a repair exactly like a type error. The effect
 * now has to actually call the api for a screen to owe a <Skeleton>.
 */
function isDataScreen(text) {
  const names = apiImports(text);
  return names.length > 0 && effectBodies(text).some((body) => calls(body, names));
}

/** The local names this file imports from an `../api/...` module. */
function apiImports(text) {
  const names = [];

  for (const [, star, braced] of text.matchAll(
    /import\s+(?:\*\s+as\s+(\w+)|\{([^}]*)\})\s+from\s+"\.\.?\/api\/[^"]*"/g,
  )) {
    if (star) names.push(star);
    for (const part of (braced ?? "").split(",")) {
      // `list as listTasks` is bound locally as the name after `as`.
      const local = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (local) names.push(local);
    }
  }

  return names;
}

/** The argument text of every `useEffect(...)` call in the file. */
function effectBodies(text) {
  const bodies = [];

  for (let at = text.indexOf("useEffect("); at >= 0; at = text.indexOf("useEffect(", at + 1)) {
    const body = balanced(text, at + "useEffect".length);
    if (body !== null) bodies.push(body);
  }

  return bodies;
}

/** Whether `text` calls or reaches into any of `names`. */
function calls(text, names) {
  return names.some((name) => new RegExp(`\\b${name}\\s*[(.]`).test(text));
}

/**
 * Whether every `photo(` call names a topic.
 *
 * Both supported shapes count: the options object `{ topic: "..." }` and the
 * positional `photo(seed, w, h, "topic")`. Scanned by walking the call's
 * parentheses rather than with one regex, so a call spanning several lines —
 * which prettier produces routinely — is read whole.
 */
function photoCallsAreTopiced(text) {
  for (let at = text.indexOf("photo("); at >= 0; at = text.indexOf("photo(", at + 1)) {
    // `cover(` and a user-defined `coverPhoto(` are not this function.
    if (at > 0 && /[\w.]/.test(text[at - 1])) continue;

    const call = balanced(text, at + "photo".length);
    if (call === null) continue;
    if (!/\btopic\b/.test(call) && !/,\s*"[a-z]+"\s*\)?\s*$/.test(call)) return false;
  }

  return true;
}

/** The text between `(` at `open` and its matching `)`, or null if unbalanced. */
function balanced(text, open) {
  let depth = 0;

  for (let at = open; at < text.length; at += 1) {
    if (text[at] === "(") depth += 1;
    else if (text[at] === ")") {
      depth -= 1;
      if (depth === 0) return text.slice(open + 1, at);
    }
  }

  return null;
}

/** Every .ts/.tsx file under src/, minus the pre-written kit. */
async function sources(directory = SOURCE) {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    const id = relative(join(SOURCE, ".."), path).split(sep).join("/");

    if (EXEMPT.some((exempt) => id === exempt || id.startsWith(`${exempt}/`))) continue;

    if (entry.isDirectory()) found.push(...(await sources(path)));
    else if (CODE_FILE.test(entry.name)) found.push({ path, id });
  }

  return found;
}

/** Where to point a whole-file finding, so it lands on the relevant line. */
function locate(text, anchor) {
  const match = anchor.exec(text);
  if (match === null) return { line: 1, column: 1 };

  const before = text.slice(0, match.index);
  const line = before.split("\n").length;
  return { line, column: match.index - before.lastIndexOf("\n") };
}

/**
 * Lines that are not code.
 *
 * Comments are removed before any rule runs — whole-file rules included —
 * because the starter pages document the rules in their own docstrings, naming
 * `#fff`, `style={{` and `<Landing>` precisely to say what not to write. A
 * checker that read its own instructions as violations would fail the one tree
 * it is shipped alongside.
 */
function isComment(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*");
}

/** The file with its comment lines blanked, keeping every line number intact. */
function code(text) {
  return text
    .split("\n")
    .map((line) => (isComment(line) ? "" : line))
    .join("\n");
}

async function main() {
  const findings = [];
  let requiresCustomComposition = false;
  try {
    const direction = JSON.parse(await readFile(join(SOURCE, "design", "direction.json"), "utf8"));
    requiresCustomComposition = Boolean(direction.art_direction);
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  // CSS is compiled by Vite. Keep custom authoring in a single scoped file,
  // with no remote stylesheet imports or executable legacy CSS constructs.
  try {
    const css = await readFile(join(SOURCE, "design", "custom.css"), "utf8");
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
    if (requiresCustomComposition && !clean.includes("{")) {
      findings.push({file: "src/design/custom.css", line: 1, column: 1,
        id: "missing-custom-composition", severity: "error", message: "Implement the selected ArtDirection in custom.css before completing the build."});
    }
    if (/@import\b|expression\s*\(|javascript\s*:|-moz-binding\s*:/i.test(clean)) {
      findings.push({file: "src/design/custom.css", line: 1, column: 1,
        id: "unsafe-css", severity: "error", message: "Custom CSS cannot import remote styles or execute code."});
    }
    if (clean.trim() && !clean.includes("data-design-mode")) {
      findings.push({file: "src/design/custom.css", line: 1, column: 1,
        id: "unscoped-custom-css", severity: "error", message: "Scope custom styles under [data-design-mode=custom]."});
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    if (requiresCustomComposition) findings.push({file: "src/design/custom.css", line: 1, column: 1,
      id: "missing-custom-composition", severity: "error", message: "The selected ArtDirection requires custom.css."});
  }
  let customTheme = false;
  try {
    customTheme = (await readFile(join(SOURCE, "styles", "theme.css"), "utf8"))
      .includes("laas-design: custom");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  // Read once, comments already stripped: the project rules need every file,
  // and reading each of them twice to ask two questions would be silly.
  const files = await Promise.all(
    (await sources()).map(async (file) => ({
      ...file,
      text: code(await readFile(file.path, "utf8")),
    })),
  );

  for (const file of files) {
    const text = file.text;

    text.split("\n").forEach((line, index) => {
      for (const rule of LINE_RULES) {
        const match = rule.pattern.exec(line);
        if (match === null) continue;

        findings.push({
          file: file.id,
          line: index + 1,
          column: match.index + 1,
          id: rule.id,
          severity: rule.severity ?? "error",
          message: rule.message,
        });
      }
    });

    for (const rule of FILE_RULES) {
      if (!rule.applies(text) || rule.holds(text)) continue;

      const { line, column } = locate(text, rule.anchor);
      findings.push({
        file: file.id,
        line,
        column,
        id: rule.id,
        severity: rule.severity ?? "error",
        message: rule.message,
      });
    }
  }

  for (const rule of PROJECT_RULES) {
    if (!rule.applies(files, customTheme) || rule.holds(files)) continue;

    const where = rule.locate(files);
    const { line, column } = where ? locate(where.text, rule.anchor) : { line: 1, column: 1 };
    findings.push({
      file: where?.id ?? "src",
      line,
      column,
      id: rule.id,
      severity: rule.severity ?? "error",
      message: rule.message,
    });
  }

  if (findings.length === 0) {
    console.log("design check: the UI rules hold.");
    return 0;
  }

  // Sorted by file and line, so the report reads in the order the code does
  // and is stable between runs.
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column);

  const errors = findings.filter((finding) => finding.severity === "error");
  const warnings = findings.filter((finding) => finding.severity !== "error");

  // Errors first and in full, because they are what has to be fixed. The word
  // `error` is also what the platform's diagnostics parser keys on, so a
  // warning can never be reported as the reason a build failed.
  report(errors, "error");
  report(warnings.slice(0, MAX_FINDINGS), "warning");

  if (warnings.length > MAX_FINDINGS) {
    console.log(`... ${warnings.length - MAX_FINDINGS} more warnings omitted ...`);
  }

  if (errors.length === 0) {
    console.log(
      `design check: ${count(warnings, "warning")}, nothing that fails the build. ` +
        "Worth fixing by composing the design system; never by adding CSS."
    );
    return 0;
  }

  console.log(
    `design check: ${count(errors, "error")}` +
      (warnings.length > 0 ? ` and ${count(warnings, "warning")}` : "") +
      ". Fix these by composing the design system; do not add CSS."
  );
  return 1;
}

function report(findings, severity) {
  for (const finding of findings) {
    console.log(
      `${finding.file}(${finding.line},${finding.column}): ` +
        `${severity} DESIGN-${finding.id}: ${finding.message}`
    );
  }
}

const count = (findings, noun) =>
  `${findings.length} ${noun}${findings.length === 1 ? "" : "s"}`;

process.exitCode = await main();
