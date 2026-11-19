import type { HTMLAttributes, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";
import { pick, resolve, type Loose } from "./props";
import { ThumbContext } from "./Media";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Rendered in a bordered header strip above the body. */
  title?: ReactNode;
  /** A mark beside the title — a lucide component or an element. */
  icon?: IconLike;
  /** Right-aligned controls in the header. */
  actions?: ReactNode;
  footer?: ReactNode;
  /** Edge-to-edge media above the content; typically a RemoteImage. */
  media?: ReactNode;
  /** Surface treatment, chosen for the content rather than applied to every card. */
  variant?: Loose<"surface" | "minimal" | "elevated" | "overlay" | "glass">;
  /** Opt in to the hover lift — for a card that is itself a link or button. */
  interactive?: boolean;
  /** Less padding, tighter gaps: for a card used as a compact tile. */
  tight?: boolean;
  /** Optional: a card that is only a header and a footer is a legitimate tile. */
  children?: ReactNode;
}

export function Card({
  title,
  icon,
  actions,
  footer,
  media,
  variant = "surface",
  interactive = false,
  tight = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const classes = ["card", pick(cardVariants, variant, "surface"),
    interactive ? "card-interactive" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {media && <div className="card-visual"><ThumbContext.Provider value={true}>{media}</ThumbContext.Provider></div>}
      {(title || actions || icon) && (
        <div className="card-header">
          {icon ? renderIcon(icon) : null}
          {title && <div className="card-title">{title}</div>}
          {actions && <div className="list-item-actions">{actions}</div>}
        </div>
      )}
      <div className={tight ? "card-body tight" : "card-body"}>{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

const cardVariants = {
  surface: "card-surface", minimal: "card-minimal", elevated: "card-elevated",
  overlay: "card-overlay", glass: "card-glass",
};

/** The class is the word itself; the map exists to say which words there are. */
const deltaDirection: Record<"up" | "down" | "flat", string> = {
  up: "up",
  down: "down",
  flat: "flat",
};

/** The colour the tile leans toward — its icon chip and its corner wash. */
const statTone: Record<"accent" | "success" | "warning" | "danger", string> = {
  accent: "stat-accent",
  success: "stat-success",
  warning: "stat-warning",
  danger: "stat-danger",
};

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** A trend line under the value; `direction` colours it. */
  delta?: ReactNode;
  direction?: Loose<"up" | "down" | "flat">;
  /** A mark in a soft chip at the tile's corner — a component or an element. */
  icon?: IconLike;
  /** The tone the chip and the corner wash lean toward. */
  tone?: Loose<"accent" | "success" | "warning" | "danger">;
}

export function Stat({
  label,
  value,
  delta,
  direction = "flat",
  icon,
  tone,
  className = "",
  ...rest
}: StatProps) {
  // A tile given a click handler becomes a control, as RemoteImage does: a
  // metric that drills into a filtered view is an ordinary thing to build.
  const classes = [
    "stat",
    pick(statTone, tone, "accent"),
    rest.onClick ? "stat-interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {icon ? <span className="stat-icon">{renderIcon(icon, 16)}</span> : null}
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {delta && (
        <span className={`stat-delta ${resolve(deltaDirection, direction, "flat")}`}>{delta}</span>
      )}
    </div>
  );
}
