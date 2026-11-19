import { useEffect } from "react";
import type { HTMLAttributes, CSSProperties, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";
import { pick, type Loose } from "./props";
import { cover, type ImageTopic } from "./imagery";
import { PaletteMenu, ThemeToggle } from "./AppShell";
import { useDesign, type DesignProps, type LandingLayout } from "./design";
import { setDefaultPalette, type Palette as PaletteName } from "./useTheme";

/**
 * The page an application is judged by before anyone signs in.
 *
 * `AppShell` frames the product; this frames the pitch. They are different
 * layouts and conflating them is what made generated applications open on a
 * sidebar and a table — correct, and indistinguishable from the last one.
 *
 * A landing page is mostly one decision: a photograph of the subject, a
 * headline over it that stays readable, and one obvious action. All three are
 * props here, so a screen that looks designed costs a single call.
 */

/** Resolve a topic name or a URL to something an `url()` can take. */
function resolveImage(image: string | undefined, fallback: string): string {
  if (!image) return cover(fallback);
  return /^(https?:|\/|data:)/.test(image) ? image : cover(image);
}

const alignClass: Record<"left" | "center", string> = {
  left: "",
  center: "landing-center",
};

/** `title` is this component's own node, so the div's string title is dropped. */
export interface LandingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    DesignProps {
  /** Product name in the top bar. */
  brand?: string;
  /** The brand mark — a lucide component or an element. */
  icon?: IconLike;
  /**
   * The photograph behind the headline: a topic name from the curated library
   * (`"restaurant"`, `"realestate"`) or a URL the user gave you. Name the
   * topic that matches the application — this image is the single biggest
   * thing deciding whether the page looks considered or generic.
   */
  image?: Loose<ImageTopic>;
  /** A short line above the headline — a status, a category, a claim. */
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** The calls to action. One primary Button, at most one beside it. */
  actions?: ReactNode;
  /** Links or buttons for the top bar, left of the theme and palette controls. */
  nav?: ReactNode;
  align?: Loose<"left" | "center">;
  /** The site's accent — same default-not-a-lock rule as AppShell's. */
  palette?: PaletteName;
  /**
   * The hero's shape: `hero` (default) is the full-bleed photograph;
   * `split` puts the photograph beside the headline; `minimal` is
   * typographic, no photograph; `banner` is a compact image strip so a
   * catalogue starts above the fold.
   */
  layout?: Loose<LandingLayout>;
  /** Sections below the fold — `<Feature>` cards, a `<Card>`, a table. */
  children?: ReactNode;
}

export function Landing({
  brand = "",
  icon,
  image,
  eyebrow,
  title,
  subtitle,
  actions,
  nav,
  align = "left",
  palette,
  preset,
  density,
  radius,
  fonts,
  layout,
  className = "",
  style,
  children,
  ...rest
}: LandingProps) {
  useEffect(() => {
    if (palette) setDefaultPalette(palette);
  }, [palette]);

  const design = useDesign({ preset, density, radius, fonts, layout }, "landing");
  const src = resolveImage(image, "");

  return (
    <div className={`landing ${className}`.trim()} data-layout={design.layout} {...rest}>
      {src && design.layout !== "minimal" ? (
        <link rel="preload" as="image" href={src} {...{ fetchpriority: "high" }} />
      ) : null}
      <header className="landing-bar">
        <span className="landing-brand">
          {icon ? <span className="landing-mark">{renderIcon(icon, 16)}</span> : null}
          <span className="truncate">{brand}</span>
        </span>
        <span className="spacer" />
        {nav}
        <PaletteMenu />
        <ThemeToggle />
      </header>

      <section
        className={`landing-hero ${pick(alignClass, align, "left")}`.trim()}
        style={{ "--landing-image": `url("${src}")`, ...style } as CSSProperties}
      >
        <div className="landing-inner stagger">
          {eyebrow ? <p className="landing-eyebrow">{eyebrow}</p> : null}
          <h1 className="landing-title">{title}</h1>
          {subtitle && <p className="landing-sub">{subtitle}</p>}
          {actions && <div className="landing-actions row-wrap">{actions}</div>}
        </div>
        {/* The photograph as a panel beside the headline rather than the
            layer behind it — only the split layout renders this. */}
        {design.layout === "split" ? (
          <div className="landing-media" aria-hidden="true" />
        ) : null}
      </section>

      {/* No container here, deliberately. A `.band` is a full-bleed stripe
          with its own `.container` inside it, which a wrapper on this div
          would have made impossible — the stripe would have stopped at the
          measure and the page would have read as one column of cards however
          many bands were written. `.landing-body` gives every child that is
          *not* a band the padding and the measure this wrapper used to, so a
          page that passes a plain `.grid` is unaffected. */}
      {children && <div className="landing-body">{children}</div>}
    </div>
  );
}

/** `title` is this component's own node, so the div's string title is dropped. */
export interface FeatureProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The mark above the title — a lucide component or an element. */
  icon?: IconLike;
  title?: ReactNode;
  children?: ReactNode;
}

/**
 * One claim in a row of them. Put three or four inside `<Landing>`'s children,
 * wrapped in a `.grid`, for the band below the fold.
 */
export function Feature({ icon, title, className = "", children, ...rest }: FeatureProps) {
  return (
    <div className={`feature ${className}`.trim()} {...rest}>
      {icon ? <span className="feature-icon">{renderIcon(icon, 20)}</span> : null}
      {title ? <h3 className="feature-title">{title}</h3> : null}
      {children ? <p className="feature-body">{children}</p> : null}
    </div>
  );
}
