import type { HTMLAttributes, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";
import { pick, type Loose } from "./props";

type CtaTone = "accent" | "dark";

const ctaTone: Record<CtaTone, string> = {
  accent: "",
  dark: "cta-panel-dark",
};

/** `title` is this component's own node, so the div's string title is dropped. */
export interface CtaPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The closing claim — one short line. */
  title?: ReactNode;
  /** The sentence under the title. */
  children?: ReactNode;
  /** The one action the page has been building to; a second outline at most. */
  actions?: ReactNode;
  /** A mark above the title — a lucide component or an element. */
  icon?: IconLike;
  /** `accent` (default) is a lit gradient panel; `dark` inverts it. */
  tone?: Loose<CtaTone>;
}

/**
 * The closing call to action — the card a landing page ends on.
 *
 * One job: repeat the primary action for the reader who scrolled past the
 * first one. It carries its own gradient and glow, so it reads as the
 * destination rather than as one more card in a grid.
 */
export function CtaPanel({
  title,
  children,
  actions,
  icon,
  tone = "accent",
  className = "",
  ...rest
}: CtaPanelProps) {
  const classes = ["cta-panel", pick(ctaTone, tone, "accent"), "animate-in", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {icon ? <span className="cta-icon">{renderIcon(icon, 22)}</span> : null}
      {title ? <h2 className="cta-title">{title}</h2> : null}
      {children ? <p className="cta-body">{children}</p> : null}
      {actions ? <div className="cta-actions row-wrap">{actions}</div> : null}
    </div>
  );
}
