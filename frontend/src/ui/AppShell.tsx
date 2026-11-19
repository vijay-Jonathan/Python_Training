import { useEffect } from "react";
import { Moon, Palette, Sun } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { IconButton } from "./Button";
import { renderIcon, type IconLike } from "./icon";
// PageHeader has its own file now; re-exported here so an import from
// "./AppShell" keeps working exactly as it did.
export { PageHeader, type PageHeaderProps } from "./PageHeader";
import { useDesign, type AppLayout, type DesignProps } from "./design";
import type { Loose } from "./props";
import {
  setDefaultPalette,
  setPalette,
  usePalette,
  useTheme,
  type Palette as PaletteName,
} from "./useTheme";

export interface NavItem {
  id: string;
  label: string;
  /** A lucide component (`Car`) or an element (`<Car size={16} />`). */
  icon?: IconLike;
}

/** `title` is this component's own node, so the div's string title is dropped. */
export interface AppShellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    DesignProps {
  /** Product name in the sidebar brand block. */
  brand?: string;
  /** A mark beside the brand — a lucide component or element. */
  brandIcon?: IconLike;
  /**
   * Accepted as a synonym for `brandIcon`.
   *
   * Every other surface in the system marks itself with `icon`, so that is
   * what a caller reaches for here too. Having the one frame call it something
   * else is a rule only a reader of this file would know.
   */
  icon?: IconLike;
  /** Omit or pass an empty list for a single-screen application. */
  nav?: NavItem[];
  active?: string;
  onNavigate?: (id: string) => void;
  /** Shown in the top bar, usually the active screen's name. Not rendered
     in the `topnav` layout. */
  title?: ReactNode;
  /** Top-bar controls, placed left of the theme toggle. */
  actions?: ReactNode;
  /**
   * The accent this application wears — `"emerald"`, `"rose"`, `"amber"`, …
   *
   * Set it once, here, to whatever suits the subject. It is only a default:
   * the palette control in the top bar lets the person using the application
   * change it, and their choice is remembered.
   */
  palette?: PaletteName;
  /**
   * The frame's shape: `sidebar` (default), `topnav`, or `rail`.
   *
   * `topnav` moves the nav into the top bar — `title` is not rendered in
   * this layout. `rail` is an icon-only strip that regains its labels below
   * 60rem, where every layout falls back to the stacked row.
   */
  layout?: Loose<AppLayout>;
  /** Optional, like every other `children` here. */
  children?: ReactNode;
}

/** Takes the native button props, so it can be placed in a row like any control. */
export function ThemeToggle(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, toggle } = useTheme();
  return (
    <IconButton
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      {...props}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </IconButton>
  );
}

/**
 * The accent picker. Already mounted in `AppShell`'s top bar and in
 * `Landing`'s, so a screen rarely places one itself.
 *
 * A native `<select>` rather than a popover of swatches: it is one element,
 * it is keyboard- and screen-reader-correct for free, and the palette names
 * read perfectly well as words.
 */
export interface PaletteMenuProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** A mark before the control — defaults to the palette glyph. */
  icon?: IconLike;
}

export function PaletteMenu({ icon, className = "", ...rest }: PaletteMenuProps) {
  const { palette, palettes } = usePalette();
  return (
    <span className="palette-menu">
      <span className="palette-mark" aria-hidden="true">
        {renderIcon(icon ?? Palette, 14)}
      </span>
      <select
        className={`palette-select ${className}`.trim()}
        value={palette}
        aria-label="Accent colour"
        onChange={(e) => setPalette(e.target.value as PaletteName)}
        {...rest}
      >
        {palettes.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </span>
  );
}

/**
 * The frame every screen sits in: a sidebar, a sticky top bar and a centred
 * content column. Using it is what makes a generated application look like an
 * application rather than a page.
 */
export function AppShell({
  brand = "",
  brandIcon,
  icon,
  nav = [],
  active,
  onNavigate,
  title,
  actions,
  palette,
  preset,
  density,
  radius,
  fonts,
  layout,
  className = "",
  children,
  ...rest
}: AppShellProps) {
  // A default, not a lock — `setDefaultPalette` stands down once the person
  // using the application has picked an accent for themselves.
  useEffect(() => {
    if (palette) setDefaultPalette(palette);
  }, [palette]);

  const design = useDesign({ preset, density, radius, fonts, layout }, "app");

  const mark = brandIcon ?? icon;
  const hasNav = nav.length > 0;
  const classes = ["app-shell", hasNav ? "" : "no-sidebar", className].filter(Boolean).join(" ");

  // The same item in all three layouts; `iconOnly` is what rail does with
  // it — the label stays in the DOM, visually hidden rather than removed,
  // so it comes back when the rail becomes a row below 60rem.
  const navItem = (item: NavItem, iconOnly = false) => (
    <button
      key={item.id}
      type="button"
      className="nav-item"
      aria-current={item.id === active ? "page" : undefined}
      aria-label={iconOnly ? item.label : undefined}
      title={iconOnly ? item.label : undefined}
      onClick={() => onNavigate?.(item.id)}
    >
      {renderIcon(item.icon)}
      <span className={iconOnly ? "truncate visually-hidden" : "truncate"}>{item.label}</span>
    </button>
  );

  if (design.layout === "topnav") {
    return (
      <div className={classes} data-layout={design.layout} {...rest}>
        <header className="topbar topbar-nav">
          <span className="topnav-brand">
            {mark ? <span className="sidebar-mark">{renderIcon(mark)}</span> : null}
            <span className="truncate">{brand}</span>
          </span>
          {hasNav && (
            <nav className="topnav-nav" aria-label="Primary">
              {nav.map((item) => navItem(item))}
            </nav>
          )}
          <div className="topbar-actions">
            {actions}
            <PaletteMenu />
            <ThemeToggle />
          </div>
        </header>
        <main className="content">
          <div className="container">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={classes} data-layout={design.layout} {...rest}>
      {hasNav &&
        (design.layout === "rail" ? (
          <aside className="sidebar rail">
            <div className="sidebar-brand">
              {mark ? <span className="sidebar-mark">{renderIcon(mark)}</span> : null}
              <span className="truncate visually-hidden">{brand}</span>
            </div>
            <nav className="sidebar-nav">{nav.map((item) => navItem(item, true))}</nav>
          </aside>
        ) : (
          <aside className="sidebar">
            <div className="sidebar-brand">
              {mark ? <span className="sidebar-mark">{renderIcon(mark)}</span> : null}
              <span className="truncate">{brand}</span>
            </div>
            <nav className="sidebar-nav">{nav.map((item) => navItem(item))}</nav>
          </aside>
        ))}

      <div>
        <header className="topbar">
          <span className="topbar-title">{title ?? brand}</span>
          <div className="topbar-actions">
            {actions}
            <PaletteMenu />
            <ThemeToggle />
          </div>
        </header>
        <main className="content">
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
}
