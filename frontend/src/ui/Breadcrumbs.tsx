import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";

export interface Crumb {
  label: string;
  /** Last item is current and never a link; the rest need one. */
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: Crumb[];
  icon?: IconLike;
}

/** Where this screen sits — "Orders / #1042" over a nested detail page. */
export function Breadcrumbs({ items, icon, className = "", ...rest }: BreadcrumbsProps) {
  return (
    <nav className={`breadcrumbs ${className}`.trim()} aria-label="Breadcrumb" {...rest}>
      {icon ? renderIcon(icon) : null}
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="crumb">
            {i > 0 ? <span className="crumb-sep" aria-hidden="true">/</span> : null}
            {item.href && !last ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current={last ? "page" : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
