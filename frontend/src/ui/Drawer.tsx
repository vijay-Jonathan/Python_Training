import { useEffect, type HTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./Button";
import { renderIcon, type IconLike } from "./icon";

/** `title` is this component's own node, so the div's string title is dropped. */
export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  icon?: IconLike;
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * A record's detail panel sliding in from the right — Modal's API and
 * behaviour (Esc, backdrop, scroll lock) on the edge a detail view belongs.
 */
export function Drawer({ open, onClose, title, icon, footer, className = "", children, ...rest }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className={`drawer ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        <header className="drawer-head">
          {icon ? renderIcon(icon) : null}
          <h2 className="drawer-title">{title}</h2>
          <IconButton icon={X} aria-label="Close" onClick={onClose} />
        </header>
        <div className="drawer-body">{children}</div>
        {footer ? <footer className="drawer-foot">{footer}</footer> : null}
      </aside>
    </div>
  );
}
