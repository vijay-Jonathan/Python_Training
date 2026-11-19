import { useLayoutEffect, useSyncExternalStore } from "react";
import { resolve, type Loose } from "./props";

/** The named looks an application can take with one `preset` prop. */
export type Preset =
  | "default"
  | "marketplace"
  | "editorial"
  | "dashboard"
  | "booking"
  | "saas";

/** How much air the layout leaves between things. */
export type Density = "compact" | "comfortable" | "spacious";

/** The corner vocabulary. */
export type Rounding = "sharp" | "soft" | "round";

/** The type voice a preset gives the application's headings. */
export type Fonts = "modern" | "editorial" | "geometric" | "technical";

export type AppLayout = "sidebar" | "topnav" | "rail";
export type SiteLayout = "classic" | "masthead";
export type LandingLayout = "hero" | "split" | "minimal" | "banner";

/**
 * The design props every shell shares. `preset` is the one decision —
 * the rest are overrides, and only for when the plan calls for them.
 */
export interface DesignProps {
  preset?: Loose<Preset>;
  density?: Loose<Density>;
  radius?: Loose<Rounding>;
  fonts?: Loose<Fonts>;
}

/** What a preset chooses when nothing overrides it. */
interface PresetDef {
  app: AppLayout;
  site: SiteLayout;
  landing: LandingLayout;
  density: Density;
  radius: Rounding;
  fonts: Fonts;
}

export const PRESETS: Preset[] = [
  "default",
  "marketplace",
  "editorial",
  "dashboard",
  "booking",
  "saas",
];

const PRESET_DEFS: Record<Preset, PresetDef> = {
  default: {
    app: "sidebar",
    site: "classic",
    landing: "hero",
    density: "comfortable",
    radius: "soft",
    fonts: "modern",
  },
  marketplace: {
    app: "topnav",
    site: "classic",
    landing: "banner",
    density: "comfortable",
    radius: "soft",
    fonts: "modern",
  },
  editorial: {
    app: "topnav",
    site: "masthead",
    landing: "split",
    density: "spacious",
    radius: "sharp",
    fonts: "editorial",
  },
  dashboard: {
    app: "sidebar",
    site: "classic",
    landing: "minimal",
    density: "compact",
    radius: "soft",
    fonts: "technical",
  },
  booking: {
    app: "topnav",
    site: "classic",
    landing: "split",
    density: "spacious",
    radius: "round",
    fonts: "geometric",
  },
  saas: {
    app: "sidebar",
    site: "classic",
    landing: "hero",
    density: "comfortable",
    radius: "round",
    fonts: "modern",
  },
};

const DENSITIES: Record<Density, true> = {
  compact: true,
  comfortable: true,
  spacious: true,
};
const RADII: Record<Rounding, true> = { sharp: true, soft: true, round: true };
const FONT_SETS: Record<Fonts, true> = {
  modern: true,
  editorial: true,
  geometric: true,
  technical: true,
};
const LAYOUTS: Record<"app" | "site" | "landing", Record<string, true>> = {
  app: { sidebar: true, topnav: true, rail: true },
  site: { classic: true, masthead: true },
  landing: { hero: true, split: true, minimal: true, banner: true },
};

/** Explicit choices only — what a caller (or index.html) actually asked for. */
interface State {
  preset?: Preset;
  density?: Density;
  radius?: Rounding;
  fonts?: Fonts;
}

const listeners = new Set<() => void>();

function attr<T extends string>(map: Record<T, unknown>, name: string): T | undefined {
  const value = document.documentElement.getAttribute(name);
  return value !== null && Object.hasOwn(map, value) ? (value as T) : undefined;
}

/**
 * The design index.html authored, read once so the first paint already
 * carries it — the same trick `authored()` in useTheme plays for the
 * palette.
 */
function authored(): State {
  return {
    preset: attr(PRESET_DEFS, "data-preset"),
    density: attr(DENSITIES, "data-density"),
    radius: attr(RADII, "data-radius"),
    fonts: attr(FONT_SETS, "data-fonts"),
  };
}

let state: State = authored();

/** The one display face each `fonts` choice needs; "modern" is Inter, which
   index.html already loads, so it costs no request. */
const FONT_URLS: Record<Exclude<Fonts, "modern">, string> = {
  editorial:
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&display=swap",
  geometric:
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&display=swap",
  technical:
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400..700&display=swap",
};

/** Inject the face once. With no network the link fails quietly and the
   fallback stacks in tokens.css render instead. */
function loadFonts(fonts: Fonts) {
  if (fonts === "modern") return;
  if (document.head.querySelector(`link[data-design-font="${fonts}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONT_URLS[fonts];
  link.setAttribute("data-design-font", fonts);
  document.head.appendChild(link);
}

/** Resolve the explicit half-state against its preset's defaults. */
function resolved(s: State) {
  const preset = s.preset ?? "default";
  const def = PRESET_DEFS[preset];
  return {
    preset,
    density: s.density ?? def.density,
    radius: s.radius ?? def.radius,
    fonts: s.fonts ?? def.fonts,
  };
}

/** The whole paint: four attributes on <html>, plus the face they ask for.
   The values written are always the resolved ones, so a "default" preset
   still writes comfortable/soft/modern — the CSS just has no rules for
   those names. */
function commit() {
  const design = resolved(state);
  const el = document.documentElement;
  el.setAttribute("data-preset", design.preset);
  el.setAttribute("data-density", design.density);
  el.setAttribute("data-radius", design.radius);
  el.setAttribute("data-fonts", design.fonts);
  loadFonts(design.fonts);
  listeners.forEach((notify) => notify());
}

commit();

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

function snapshot(): State {
  return state;
}

/** Merge explicit choices into the store — the public escape hatch, and
   what `useDesign` calls on behalf of a shell given design props. */
export function setDesign(partial: DesignProps) {
  const next: State = {
    preset:
      partial.preset === undefined
        ? state.preset
        : resolve(PRESET_DEFS, partial.preset, "default"),
    density:
      partial.density === undefined
        ? state.density
        : resolve(DENSITIES, partial.density, "comfortable"),
    radius:
      partial.radius === undefined
        ? state.radius
        : resolve(RADII, partial.radius, "soft"),
    fonts:
      partial.fonts === undefined
        ? state.fonts
        : resolve(FONT_SETS, partial.fonts, "modern"),
  };
  if (
    next.preset === state.preset &&
    next.density === state.density &&
    next.radius === state.radius &&
    next.fonts === state.fonts
  ) {
    return;
  }
  state = next;
  commit();
}

/** What a shell's props resolve to once the store and the preset's own
   defaults have had their say. */
export interface ResolvedDesign {
  preset: Preset;
  density: Density;
  radius: Rounding;
  fonts: Fonts;
  layout: string;
}

function resolveFrom(
  s: State,
  local: DesignProps & { layout?: string },
  kind: "app" | "site" | "landing",
): ResolvedDesign {
  const preset = resolve(PRESET_DEFS, local.preset, s.preset ?? "default");
  const def = PRESET_DEFS[preset];
  return {
    preset,
    density: resolve(DENSITIES, local.density, s.density ?? def.density),
    radius: resolve(RADII, local.radius, s.radius ?? def.radius),
    fonts: resolve(FONT_SETS, local.fonts, s.fonts ?? def.fonts),
    layout: resolve(LAYOUTS[kind], local.layout, def[kind]),
  };
}

/**
 * Resolve a shell's design props: local props win over the store's explicit
 * values, which win over the preset's defaults. An unknown word — a preset
 * this kit does not know, a layout meant for a different shell — falls back
 * silently rather than failing, the convention props.ts states.
 */
export function resolveDesign(
  local: DesignProps & { layout?: string },
  kind: "app" | "site" | "landing",
): ResolvedDesign {
  return resolveFrom(state, local, kind);
}

/**
 * The resolved design for one shell.
 *
 * The resolved value is computed synchronously, so the first render is
 * already right; then a layout effect commits whatever the caller
 * explicitly passed, so one `preset=` on any shell dresses the whole
 * application. Passing nothing commits nothing.
 */
export function useDesign(
  local: DesignProps & { layout?: string },
  kind: "app" | "site" | "landing",
): ResolvedDesign {
  const stored = useSyncExternalStore(subscribe, snapshot);
  const { preset, density, radius, fonts } = local;
  useLayoutEffect(() => {
    setDesign({ preset, density, radius, fonts });
  }, [preset, density, radius, fonts]);
  return resolveFrom(stored, local, kind);
}
