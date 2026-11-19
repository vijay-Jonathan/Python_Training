# Generated Application Template

The known-good starting point for every application the Labs agent generates: React +
TypeScript + Vite talking to FastAPI, with nothing else in it.

This directory is **source-controlled template data, not a running application**. At runtime
it is copied into an isolated project workspace outside this repository, and the agent
modifies the copy. Neither the agent nor the runtime ever writes back here.

## Contract

- The frontend calls `/api/...`; Vite forwards to FastAPI in development, so requests are
  same-origin and CORS stays out of the dev loop.
- The backend serves everything under `/api/v1`. `GET /api/v1/health` returns
  `{"status": "ok"}` and is the endpoint the platform's validation checks.
- Self-contained: copied to any directory, it installs, builds, tests and runs without
  referencing a single file from the Labs repository.

## Running it

```bash
cd backend
uv sync --frozen
uv run uvicorn app.main:app --port 8100 --reload    # http://localhost:8100
```

```bash
cd frontend
npm ci
npm run dev                                         # http://localhost:5100
```

The home page reads the backend's health through the proxy and shows it.

Ports are 5100 and 8100, not the 5173 and 8000 the Labs platform uses, so a generated
application can run beside Labs without fighting it for a port. These are local defaults
only: the platform assigns ports per workspace when it runs a preview.
`VITE_PROXY_TARGET` overrides where the dev proxy forwards (default
`http://127.0.0.1:8100`).

## Design layers

The functional foundation is the UI components and their behavior. The default
visual design is `frontend/src/styles/tokens.css` and `components.css`; it is
unchanged when the optional `theme.css` layer is empty. For custom designs LaaS
generates that layer with the first-line marker `/* laas-design: custom */`.
Its light and common tokens use `html:root[data-palette]`, and dark-ground
tokens use `html:root[data-theme="dark"][data-palette]`, so they override
the palette rules regardless of stylesheet order. Stored theme preferences
still take precedence over an authored `data-theme` on `<html>`.

## Checks

These are the gates the platform runs against generated code. They are the whole quality
story for a generated application — there is deliberately no linter, formatter, strict type
checker or API codegen here. Every extra gate is another way for generated code to fail on
something that does not affect whether the application works.

```bash
cd frontend && npm run build    # tsc -b && vite build, so this typechecks too
cd frontend && npm run design   # the design rules, over frontend/src
cd backend  && uv run pytest
```

`npm run design` is the exception to "no extra gates", and it earns it by
checking the one thing the other two cannot: whether the application looks like
anything. `tsc` proves a screen compiles and `vite` proves it bundles; neither
objects to a hard-coded `#4f46e5`, a raw `<button>`, or a table that renders a
blank panel while it loads. Those are already rules the agent is given, and
before this they were the only part of the brief with no consequence for
ignoring it. The rules it enforces are in `frontend/scripts/design-check.mjs`,
which is also where the reasoning for keeping the set small lives: a false
positive costs a repair attempt, so every rule is mechanical and every
judgement call stays in the prompt. It exempts `src/ui` and `src/styles` from
source rules — the kit is where colours and raw controls belong — and reads
`src/styles/theme.css` only to detect the custom theme marker.

Rules are `error` or `warn`, and which is which was decided by measurement
rather than by taste: run over the 59 applications generated before the check
existed, an all-errors version failed every one of them, a median of 31
findings against a repair budget of two attempts. `inline-style` and
`raw-control` were 71% of that volume, so they warn. What fails the build is
the set that is both rare and a one-line fix — a median of 7 per application
over the same corpus. The counts and the reasoning are in the file's header,
and a rule should be promoted to `error` when new builds stop producing it in
bulk.

For the same reason, `noUnusedLocals` and `noUnusedParameters` are off in
`frontend/tsconfig.app.json`. An import left in a header, or a destructured
`route` that went unread, has no effect on the running application — but as a
compile error it fails the whole build and costs one of only two repair
attempts, spent re-writing a file to delete a dead line. `strict` stays on: a
real type error is still a real error.

## The design system's rules

Every build failure this starter has caused was one shape: the agent wrote a
reasonable call, a prop type rejected it, the build failed, and a repair
attempt was spent deleting the prop. `<Button icon={Plus}>`, then
`<RemoteImage onClick={...}>`, then `<Button icon={Pencil} />` with no label,
then `<Input icon={Search} />` — a different component each time, each found in
a user's build.

So `src/ui` keeps four rules, and every component is held to them:

1. **Every component accepts `icon`**, as a lucide component or an element.
   Exempt: `Spinner`, `Skeleton`, `Progress`, `Avatar`, `AvatarStack` — nothing
   to put a mark beside.
2. **No component requires `children`.** A component that takes an `icon`
   cannot demand a label.
3. **Every component forwards its element's native attributes** — `className`,
   `onClick`, `style`, `aria-*`.
4. **`tone`, `size`, `ratio` and `direction` accept any string.** A word
   another component uses, or one computed from state, compiles; an
   unrecognised word falls back to the default style. See `src/ui/props.ts`.

Two files enforce this, and neither is in the bundle or in a generated app:

- `src/ui/__conformance.ts` checks rules 1–3 against **every** component
  `src/ui/index.ts` exports, discovered by type rather than by a list. Export a
  new component and it is checked immediately; there is nothing to remember.
  A violation fails the build naming the component and the rule. If a component
  genuinely cannot keep a rule, add it to the matching exemption list there with
  the reason.
- `src/ui/__apiTolerance.tsx` is the regression suite beneath the rules: the
  actual calls that have failed in generated applications, kept compiling.

None of this is checked unless something builds this starter, so CI does —
the `Generated app starter builds` step in `bitbucket-pipelines.yml`. Before
that step existed these files were first compiled inside a user's generated
application, which is exactly the failure they were written to prevent.

The agent is told these four rules in `backend/app/agent/context.py`; if you
change one here, change it there too.

## Structure

```
frontend/
  src/api/          the only place the app talks to the API
  src/pages/        screens
  src/components/   presentational pieces
backend/
  app/main.py       app setup, mounts /api/v1
  app/config.py     the only reader of the environment
  app/api/          routers — register new ones in router.py
  app/schemas/      Pydantic request/response models
  app/services/     business logic
  tests/
```

Dependencies are locked (`package-lock.json`, `uv.lock`) so a workspace copy installs
exactly what was verified here. `package.json`, `pyproject.toml` and both lock files are
template-controlled: the agent edits `frontend/src/**` and `backend/app/**`.

## Visual composition and review

The generator chooses a shared preset, font pairing, palette and density for each
application, then selects card treatments and section layouts to suit its content.
Existing component calls remain supported; no new dependency is required.

- `Card media={<RemoteImage ... />} variant="surface|minimal|elevated|overlay|glass"`
  separates imagery from the padded body. Use minimal cards for editorial content,
  elevated cards for emphasis, and overlay cards for short copy over photography.
  Keep forms and detailed information on opaque surfaces. `interactive` is a
  visual treatment: use real links/buttons for keyboard-accessible actions.
- `Button shape="default|pill|square"` complements the existing tone, size and
  loading props. Keep shape and primary/secondary hierarchy consistent per site.
- `SiteShell` includes mobile navigation, Escape-to-close with focus restoration,
  current hash-route indicators, a skip link, and normal anchor CTAs.
- Wikimedia search results take priority over illustrative fallback images. Store
  suitable URLs and attribution in the records rather than leaving them empty.
  Do not depict a different product as an exact match.

For a local component review, run `npm run dev` from `frontend` and open
`/scripts/fixtures/ui-quality.html?preset=editorial`. The same fixture accepts
`marketplace`, `booking`, `dashboard`, `saas`, or `default`. It uses a local SVG
illustration so checks do not depend on external image servers; its example
buttons are presentation fixtures, not a generated business application.
Review at desktop and phone widths, in both themes, and with keyboard navigation.
The fixture is excluded from the production entry point.
