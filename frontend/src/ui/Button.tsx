import type { ButtonHTMLAttributes, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";
import { pick, resolve, type Loose } from "./props";

/**
 * The four button tones, plus the status words the other toned components use.
 *
 * A caller reaching for `tone="success"` on a confirm button is making a
 * reasonable request, and a tone computed from state (`paid ? "success" :
 * "warning"`) is a `string` whatever the words are. Both compile now; see
 * ./props.ts.
 */
type Tone = "primary" | "outline" | "ghost" | "danger" | "success" | "warning" | "info";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Loose<Tone>;
  size?: Loose<Size>;
  /**
   * A mark before the label — a lucide component or an element.
   *
   * Present because a labelled button with a leading icon is the commonest
   * thing anyone writes, and because every other component that can carry a
   * mark (Card, Stat, Alert, EmptyState, a nav item) already takes `icon`. A
   * button that was the one exception made `<Button icon={Plus}>` a type
   * error, which is a repair cycle spent on a reasonable call.
   */
  icon?: IconLike;
  /** A mark after the label — a chevron on a "next" or a disclosure. */
  iconRight?: IconLike;
  /** Work is in flight: the label keeps its place and the button stops accepting. */
  loading?: boolean;
  block?: boolean;
  shape?: Loose<"default" | "pill" | "square">;
  /**
   * Optional, because `icon` makes a label genuinely unnecessary.
   *
   * It was required, and adding `icon` turned that into a trap: an icon-only
   * `<Button icon={Pencil} aria-label="Edit" />` is the obvious way to write a
   * row action, and it failed with "Property 'children' is missing". Requiring
   * a label on a component that accepts an icon is a rule that only a reader
   * of this file could know.
   */
  children?: ReactNode;
}

const toneClass: Record<Tone, string> = {
  primary: "btn btn-primary",
  outline: "btn btn-outline",
  ghost: "btn btn-ghost",
  danger: "btn btn-danger",
  // The status words share the classes their meaning maps onto rather than
  // adding three more button styles: a success action is the primary one on
  // its screen, and a warning reads as a caution, which is what danger is.
  success: "btn btn-primary",
  warning: "btn btn-danger",
  info: "btn btn-outline",
};

const sizeClass: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

/** Icon sizes that match each button height, so a mark never dwarfs its label. */
const iconSize: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

export function Button({
  tone = "outline",
  size = "md",
  icon,
  iconRight,
  loading = false,
  block = false,
  shape = "default",
  className = "",
  type = "button",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  // No label means the padding should be even rather than leaving a wide
  // button with a mark adrift in it.
  const iconOnly = children === undefined || children === null || children === false;
  // Resolved once so the class and the icon's pixel size cannot disagree
  // about an unknown word.
  const sizeName = resolve(sizeClass, size, "md");
  const classes = [
    pick(toneClass, tone, "outline"),
    sizeClass[sizeName],
    block ? "btn-block" : "",
    iconOnly ? "btn-icon-only" : "",
    pick({ default: "", pill: "btn-pill", square: "btn-square" }, shape, "default"),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {/* The spinner takes the leading icon's place rather than sitting beside
          it, so the label does not shift when a click starts the request. */}
      {loading ? (
        <span className="btn-spin" aria-hidden="true" />
      ) : icon ? (
        renderIcon(icon, iconSize[sizeName])
      ) : null}
      {children}
      {iconRight ? renderIcon(iconRight, iconSize[sizeName]) : null}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The mark this button holds — a lucide component or an element.
   *
   * A component called IconButton that had no `icon` prop and took its mark as
   * children was a trap: passing `icon` is the obvious reading of the name.
   * Children still work, so existing call sites are unaffected.
   */
  icon?: IconLike;
  /** Shares Button's vocabulary, so the two are not different languages. */
  tone?: Loose<Tone>;
  size?: Loose<Size>;
}

/** A square button holding a single icon and no label. */
export function IconButton({
  icon,
  tone = "ghost",
  size = "md",
  className = "",
  type = "button",
  children,
  ...rest
}: IconButtonProps) {
  const sizeName = resolve(iconButtonSize, size, "md");
  const classes = [
    "icon-btn",
    pick(iconButtonTone, tone, "ghost"),
    iconButtonSize[sizeName],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {children ?? renderIcon(icon, iconSize[sizeName])}
    </button>
  );
}

const iconButtonTone: Record<Tone, string> = {
  primary: "icon-btn-primary",
  outline: "icon-btn-outline",
  ghost: "",
  danger: "icon-btn-danger",
  success: "icon-btn-primary",
  warning: "icon-btn-danger",
  info: "icon-btn-outline",
};

const iconButtonSize: Record<Size, string> = { sm: "icon-btn-sm", md: "", lg: "icon-btn-lg" };
