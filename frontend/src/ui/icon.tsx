import { createElement, isValidElement, type ComponentType, type ReactNode } from "react";

/**
 * Anything that can stand in for an icon: a rendered element
 * (`<Car size={16} />`), or the component itself (`Car`).
 *
 * Both, deliberately. A prop typed `ReactNode` accepts only the element, and
 * passing the component is the mistake everyone makes first — a lucide icon is
 * a `forwardRef` object, so `icon={Car}` fails with an unreadable
 * `ForwardRefExoticComponent is not assignable to ReactNode`. Accepting either
 * costs one call to `renderIcon` and removes the whole class of error.
 */
export type IconLike =
  | ReactNode
  | ComponentType<{ size?: number | string; className?: string }>;

/** Whether this is a component to instantiate rather than a node to render. */
function isComponent(icon: unknown): icon is ComponentType<{ size?: number | string }> {
  if (typeof icon === "function") return true;
  // forwardRef and memo components are objects carrying `$$typeof`, which is
  // also true of elements — but those are already handled by the caller.
  return typeof icon === "object" && icon !== null && "$$typeof" in icon;
}

/** Render an {@link IconLike} at a given size. */
export function renderIcon(icon: IconLike, size: number = 16): ReactNode {
  if (icon === null || icon === undefined || icon === false) return null;
  if (isValidElement(icon)) return icon;
  if (isComponent(icon)) return createElement(icon, { size });
  return icon as ReactNode;
}
