import type { HTMLAttributes, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";
import { pick, resolve, type Loose } from "./props";

/**
 * The status vocabulary, plus the two words Button uses for the same ideas.
 *
 * One vocabulary across the system, loosely typed: `<Badge tone="primary">`
 * and a tone computed from state both compile, and a word a component has no
 * style for falls back to its neutral rather than failing the build. See
 * ./props.ts.
 */
type Tone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "outline"
  | "ghost";

/*
 * Every component here forwards its own element's attributes.
 *
 * The reason is uniformity rather than any one feature: a closed prop list
 * makes `className`, `onClick`, `style` and `aria-*` compile errors on some
 * components and not others, and that inconsistency is what a generated
 * application trips over. Spreading the rest is one line per component and
 * removes the whole class.
 */

const badgeTone: Record<Tone, string> = {
  neutral: "",
  accent: "badge-accent",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  info: "badge-info",
  // Button's words, mapped to the nearest badge that already exists.
  primary: "badge-accent",
  outline: "",
  ghost: "",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Loose<Tone>;
  /** Prefix a status disc, so the state reads before the word does. */
  dot?: boolean;
  /** A mark before the label — a lucide component or an element. */
  icon?: IconLike;
  /** Optional for the same reason as Button's: `icon` can stand alone. */
  children?: ReactNode;
}

export function Badge({
  tone = "neutral",
  dot = false,
  icon,
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={`badge ${pick(badgeTone, tone, "neutral")} ${className}`.trim()} {...rest}>
      {dot && <span className="dot" aria-hidden="true" />}
      {icon ? renderIcon(icon, 12) : null}
      {children}
    </span>
  );
}

// Total over the whole vocabulary, not a subset of it: `<Alert tone="neutral">`
// is a reasonable call, and a component accepting four of the system's nine
// tone words is the kind of per-component exception that costs builds.
const alertTone: Record<Tone, string> = {
  success: "alert-success",
  warning: "alert-warning",
  danger: "alert-error",
  info: "alert-info",
  neutral: "alert-info",
  accent: "alert-info",
  primary: "alert-info",
  outline: "alert-info",
  ghost: "alert-info",
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Loose<Tone>;
  /** A mark before the message — a lucide component or an element. */
  icon?: IconLike;
  /** Optional, like every other `children` here: `icon` can stand alone. */
  children?: ReactNode;
}

export function Alert({ tone = "info", icon, className = "", children, ...rest }: AlertProps) {
  const toneName = resolve(alertTone, tone, "info");
  return (
    <div
      className={`alert ${alertTone[toneName]} ${className}`.trim()}
      role={toneName === "danger" ? "alert" : "status"}
      {...rest}
    >
      {icon ? renderIcon(icon) : null}
      <span>{children}</span>
    </div>
  );
}

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Kept for callers that already use it; `size="lg"` says the same thing. */
  large?: boolean;
  size?: Loose<"sm" | "md" | "lg">;
  label?: string;
}

const spinnerSize: Record<"sm" | "md" | "lg", string> = {
  sm: "spinner-sm",
  md: "",
  lg: "spinner-lg",
};

export function Spinner({
  large = false,
  size = "md",
  label = "Loading",
  className = "",
  ...rest
}: SpinnerProps) {
  const sizeName = large ? "lg" : resolve(spinnerSize, size, "md");
  const classes = ["spinner", spinnerSize[sizeName], className].filter(Boolean).join(" ");
  return <span className={classes} role="status" aria-label={label} {...rest} />;
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
  width?: string;
}

/** A shimmer placeholder. `lines` > 1 renders a stacked paragraph. */
export function Skeleton({ lines = 1, width, className = "", style, ...rest }: SkeletonProps) {
  if (lines === 1)
    return <div className={`skeleton ${className}`.trim()} style={{ width, ...style }} {...rest} />;
  return (
    <div className={`stack-sm ${className}`.trim()} aria-hidden="true" {...rest}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

/**
 * The nothing-here state. Every collection view needs one: an empty panel
 * reads as a bug, an empty state reads as a product.
 */
/** `title` is this component's own node, so the div's string title is dropped. */
const emptyTone: Record<"neutral" | "success", string> = {
  neutral: "",
  success: "empty-state-success",
};

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** A lucide component (`Inbox`) or an element (`<Inbox size={20} />`). */
  icon?: IconLike;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  /** `success` colours the icon chip green — for "all caught up" states. */
  tone?: Loose<"neutral" | "success">;
}

export function EmptyState({
  icon,
  title,
  children,
  action,
  tone = "neutral",
  className = "",
  ...rest
}: EmptyStateProps) {
  return (
    <div className={`empty-state ${pick(emptyTone, tone, "neutral")} ${className}`.trim()} {...rest}>
      {icon ? <div className="empty-state-icon">{renderIcon(icon, 20)}</div> : null}
      <div className="empty-state-title">{title}</div>
      {children && <p className="empty-state-body">{children}</p>}
      {action}
    </div>
  );
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export function Progress({ value, max = 100, className = "", ...rest }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={`progress ${className}`.trim()}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      {...rest}
    >
      <div className="progress-bar" style={{ width: `${pct}%` }} />
    </div>
  );
}
