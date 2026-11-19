import { useCallback, useSyncExternalStore } from "react";

/** Light or dark ground. */
export type Theme = "light" | "dark";

/**
 * The accent a whole application is coloured by.
 *
 * One application picks one of these and keeps it — the choice belongs to the
 * subject, not to the screen. A finance dashboard is not the same colour as a
 * garden centre, and that difference is most of what stops two generated
 * applications from looking like the same application twice.
 *
 * Both grounds are declared for every palette in tokens.css, so a palette is
 * orthogonal to light/dark: picking one does not cost the theme toggle.
 */
export type Palette =
  | "indigo"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "teal"
  | "cyan"
  | "slate";

/** Every palette name, in the order a picker should offer them. */
export const PALETTES: Palette[] = [
  "indigo",
  "emerald",
  "violet",
  "amber",
  "rose",
  "teal",
  "cyan",
  "slate",
];

// A redesign starts with its authored theme; old preferences belong to the old design.
const designId = document.documentElement.getAttribute("data-design-id");
const THEME_KEY = designId ? `app-theme:${designId}` : "app-theme";
const PALETTE_KEY = designId ? `app-palette:${designId}` : "app-palette";

/**
 * One store, not one `useState` per hook call.
 *
 * `useTheme` used to hold its own state, which meant every component calling
 * it had a private copy: two theme toggles on one screen — the shell's and a
 * settings page's — would disagree about which theme was showing, and the one
 * that was not clicked would go on rendering the wrong icon. The attribute on
 * `<html>` is a single global thing, so the state behind it has to be single
 * too.
 */
interface State {
  theme: Theme;
  palette: Palette;
}

const listeners = new Set<() => void>();

function stored<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const value = localStorage.getItem(key);
    return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
  } catch {
    // Storage can be unavailable (private mode, a sandboxed frame). A theme is
    // not worth taking the application down for.
    return null;
  }
}

/**
 * The palette the application was built with, read off the document.
 *
 * Set once in index.html or main.tsx, so the application opens in its own
 * colour before React mounts — no flash of the default accent — and so the
 * choice lives with the application rather than in a user's localStorage.
 */
function authored(): Palette {
  const attr = document.documentElement.getAttribute("data-palette");
  return PALETTES.includes(attr as Palette) ? (attr as Palette) : "indigo";
}

function authoredTheme(): Theme | null {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" || attr === "dark" ? attr : null;
}

/** Whether the palette currently showing is the person's choice or the author's. */
let paletteChosen = stored<Palette>(PALETTE_KEY, PALETTES) !== null;

let state: State = {
  theme:
    stored<Theme>(THEME_KEY, ["light", "dark"]) ??
    authoredTheme() ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  palette: stored<Palette>(PALETTE_KEY, PALETTES) ?? authored(),
};

/** Both themes and all palettes are in tokens.css, so this is the whole paint. */
function commit() {
  document.documentElement.setAttribute("data-theme", state.theme);
  document.documentElement.setAttribute("data-palette", state.palette);
  listeners.forEach((notify) => notify());
}

/**
 * Writing is separate from painting, and only a deliberate choice writes.
 *
 * Persisting inside `commit` meant the very first paint saved whatever the
 * defaults happened to be — after which there was a stored palette, so
 * `setDefaultPalette` saw a "preference" nobody had expressed and an
 * application could never adopt the accent its author gave it.
 */
function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // See `stored`: persistence is a convenience, not a requirement.
  }
}

commit();

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

function snapshot(): State {
  return state;
}

export function setTheme(theme: Theme) {
  persist(THEME_KEY, theme);
  if (theme === state.theme) return;
  state = { ...state, theme };
  commit();
}

export function setPalette(palette: Palette) {
  if (!PALETTES.includes(palette)) return;
  paletteChosen = true;
  persist(PALETTE_KEY, palette);
  if (palette === state.palette) return;
  state = { ...state, palette };
  commit();
}

/**
 * The palette the application ships with, applied only if nobody has picked
 * one.
 *
 * `AppShell palette="emerald"` is an author's default, and a default that
 * overrides a preference is not a default — without this distinction, choosing
 * `rose` in the picker and reloading put you straight back on emerald.
 */
export function setDefaultPalette(palette: Palette) {
  if (paletteChosen || !PALETTES.includes(palette) || palette === state.palette) return;
  state = { ...state, palette };
  commit();
}

/**
 * The current ground and a way to flip it.
 *
 * Every caller sees the same value, so any number of toggles stay in step.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, snapshot).theme;
  const toggle = useCallback(() => setTheme(state.theme === "dark" ? "light" : "dark"), []);
  return { theme, toggle, setTheme };
}

/** The current accent and a way to change it. */
export function usePalette() {
  const palette = useSyncExternalStore(subscribe, snapshot).palette;
  return { palette, setPalette, palettes: PALETTES };
}
