import { useEffect, useId, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./AppShell";
import { renderIcon, type IconLike } from "./icon";
import { useDesign, type DesignProps, type SiteLayout } from "./design";
import type { Loose } from "./props";
import { setDefaultPalette, type Palette as PaletteName } from "./useTheme";

export interface SiteLink {
  href: string;
  label: string;
}

export interface SiteShellProps extends HTMLAttributes<HTMLDivElement>, DesignProps {
  /** The site or product name in the header. */
  brand?: string;
  /** A mark beside the brand — a lucide component or element. */
  icon?: IconLike;
  /** Header navigation, e.g. [{ href: "#/about", label: "About" }]. */
  links?: SiteLink[];
  /** The header's primary action — usually "Open the app" -> #/app. */
  cta?: SiteLink;
  /** A slot left of the theme toggle — a search box, a cart button. */
  actions?: ReactNode;
  /** The site's accent — same default-not-a-lock rule as AppShell's. */
  palette?: PaletteName;
  /** `classic` (default) or `masthead`, a centred display-masthead header. */
  layout?: Loose<SiteLayout>;
  /** Extra footer link columns: [{ label, links: SiteLink[] }]. */
  footerColumns?: { label: string; links: SiteLink[] }[];
  /** Small print under the footer; the brand and year are filled in. */
  footerNote?: ReactNode;
  children?: ReactNode;
}

/**
 * The marketing-site frame: sticky header (brand, links, theme toggle, one
 * CTA) and a footer with link columns. Everything between them is the page —
 * a <Landing> and its bands, or any composed content. The product itself does
 * not use this shell; it has <AppShell>.
 */
export function SiteShell({
  brand = "Site",
  icon,
  links = [],
  cta,
  actions,
  palette,
  preset,
  density,
  radius,
  fonts,
  layout,
  footerColumns = [],
  footerNote,
  children,
  ...rest
}: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState(() => window.location.hash || window.location.pathname);
  const menuId = useId();
  const mainId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const navigate = () => {
      setLocation(window.location.hash || window.location.pathname);
      setMenuOpen(false);
    };
    window.addEventListener("hashchange", navigate);
    window.addEventListener("popstate", navigate);
    return () => {
      window.removeEventListener("hashchange", navigate);
      window.removeEventListener("popstate", navigate);
    };
  }, []);
  useEffect(() => {
    if (palette) setDefaultPalette(palette);
  }, [palette]);

  const design = useDesign({ preset, density, radius, fonts, layout }, "site");

  const year = new Date().getFullYear();
  return (
    <div className="site" data-layout={design.layout} {...rest}>
      <a className="site-skip" href={`#${mainId}`} onClick={(event) => {
        event.preventDefault();
        document.getElementById(mainId)?.focus();
      }}>Skip to content</a>
      <header className="site-header" onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}>
        <a className="site-brand" href="#/">
          {icon ? <span className="site-mark">{renderIcon(icon)}</span> : null}
          {brand}
        </a>
        {links.length > 0 && <button ref={menuButton} type="button"
          className="btn btn-ghost site-menu-toggle" aria-expanded={menuOpen}
          aria-controls={menuId} aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>}
        <nav id={menuId} className="site-nav" aria-label="Main navigation" data-open={menuOpen}>
          {links.map((link) => (
            <a key={link.href} href={link.href}
              aria-current={location === link.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="site-header-actions">
          {actions}
          <ThemeToggle />
          {cta ? (
            <a className="btn btn-primary" href={cta.href}>
              {cta.label}
            </a>
          ) : null}
        </div>
      </header>
      <main id={mainId} tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <div className="site-brand">{brand}</div>
            {footerNote ? <p className="muted">{footerNote}</p> : null}
          </div>
          {footerColumns.map((column) => (
            <div key={column.label}>
              <div className="label">{column.label}</div>
              {column.links.map((link) => (
                <a key={link.href} className="site-footer-link" href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <p className="site-footer-copy muted">
          © {year} {brand} · Product images are for illustrative purposes only. Actual products may vary.
        </p>
      </footer>
    </div>
  );
}
