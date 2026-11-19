import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";
import { pick, type Loose } from "./props";
import { cover, type ImageTopic } from "./imagery";

const variantClass: Record<"plain" | "banner", string> = {
  plain: "",
  banner: "page-header-banner",
};

/** `title` is this component's own node, so the div's string title is dropped. */
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** A small capitalised line above the title — a category, a stage. */
  eyebrow?: ReactNode;
  actions?: ReactNode;
  /** A mark beside the title — a lucide component or an element. */
  icon?: IconLike;
  /**
   * A photograph behind a `banner` header: a topic name from the curated
   * library or a URL the user gave you — resolved exactly like Landing's
   * `image`, with the theme's own scrim keeping the title readable.
   */
  image?: Loose<ImageTopic>;
  /**
   * `plain` (default) is the title row a screen opens with; `banner` gives
   * it a surface of its own — a gradient, an optional photograph, and room
   * around it, for a dashboard's top screen or a section's front page.
   */
  variant?: Loose<"plain" | "banner">;
  /** Leading content above the title row — breadcrumbs, usually. */
  children?: ReactNode;
}

/** The title block a screen opens with. */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  icon,
  image,
  variant = "plain",
  className = "",
  style,
  children,
  ...rest
}: PageHeaderProps) {
  // A bare word is a topic; anything with a scheme or a slash is already a URL.
  const src = image ? (/^(https?:|\/|data:)/.test(image) ? image : cover(image)) : undefined;

  const classes = [
    "page-header",
    "animate-in",
    pick(variantClass, variant, "plain"),
    src ? "page-header-photo" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={src ? ({ "--page-header-image": `url("${src}")`, ...style } as CSSProperties) : style}
      {...rest}
    >
      {children ? <div className="page-header-crumbs">{children}</div> : null}
      <div className="row">
        {icon ? renderIcon(icon, 20) : null}
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
