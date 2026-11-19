import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";
import { pick, resolve, type Loose } from "./props";
import { cover, type ImageTopic } from "./imagery";

type BandTone =
  | "plain"
  | "tint"
  | "accent"
  | "dark"
  | "grid"
  | "dots"
  | "glow"
  | "image";

const bandTone: Record<BandTone, string> = {
  plain: "",
  tint: "band-tint",
  accent: "band-accent",
  dark: "band-dark",
  grid: "band-grid",
  dots: "band-dots",
  glow: "band-glow",
  image: "band-image",
};

export interface BandProps extends HTMLAttributes<HTMLElement> {
  /**
   * The stripe's treatment. `tint` and `accent` are the alternating stripes a
   * page divides into; `grid`, `dots` and `glow` lay a generated texture over
   * the ground; `dark` inverts the band; `image` backs it with a photograph
   * under a scrim — use it at most once per page.
   */
  tone?: Loose<BandTone>;
  /**
   * The photograph for `tone="image"`: a topic name from the curated library
   * (`"restaurant"`, `"realestate"`) or a URL the user gave you — the same
   * resolution Landing's `image` prop applies.
   */
  image?: Loose<ImageTopic>;
  /**
   * A decorative mark, faded into the band's corner — a lucide component or
   * an element. Accepted, like every other surface's `icon`; the band's own
   * content is its children.
   */
  icon?: IconLike;
  /** Usually a `.container` — the band itself stays full-bleed. */
  children?: ReactNode;
}

/**
 * A full-bleed section stripe — the element a long page is divided into.
 *
 * This is the same markup the `band` classes document, wrapped so a screen
 * needs no class names: `<Band tone="tint"><div className="container">…` is
 * the `<section className="band band-tint reveal"><div className="container">`
 * written out by hand. `reveal` is included, so the band still arrives as it
 * is scrolled to.
 */
export function Band({
  tone = "plain",
  image,
  icon,
  className = "",
  style,
  children,
  ...rest
}: BandProps) {
  const name = resolve(bandTone, tone, "plain");

  // A bare word is a topic; anything with a scheme or a slash is already a
  // URL — the same rule Landing and Hero apply to their `image` props.
  const src = image
    ? /^(https?:|\/|data:)/.test(image)
      ? image
      : cover(image)
    : name === "image"
      ? cover("workspace")
      : undefined;

  const classes = ["band", "reveal", bandTone[name], className].filter(Boolean).join(" ");

  return (
    <section
      className={classes}
      style={src ? ({ "--band-image": `url("${src}")`, ...style } as CSSProperties) : style}
      {...rest}
    >
      {icon ? (
        <span className="band-icon" aria-hidden="true">
          {renderIcon(icon, 40)}
        </span>
      ) : null}
      {children}
    </section>
  );
}
