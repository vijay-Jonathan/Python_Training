import { useEffect, type HTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./Button";
import { renderIcon, type IconLike } from "./icon";
import { pick, type Loose } from "./props";

/** `title` is this component's own node, so the div's string title is dropped. */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** A mark beside the title — a lucide component or an element. */
  icon?: IconLike;
  /** Buttons for the footer strip; omitted means no footer. */
  footer?: ReactNode;
  /** How wide the dialog is — `lg` for a form or a table. */
  size?: Loose<"sm" | "md" | "lg">;
  /** Optional, like every other `children` here. */
  children?: ReactNode;
}

const modalSize: Record<"sm" | "md" | "lg", string> = {
  sm: "modal-sm",
  md: "",
  lg: "modal-lg",
};

/**
 * A dialog that closes on Escape and on a backdrop click, and locks the page
 * behind it. Mounting is conditional, so the entrance animation replays.
 */
export function Modal({
  open,
  onClose,
  title,
  icon,
  footer,
  size = "md",
  className = "",
  children,
  ...rest
}: ModalProps) {
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
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      {/* `rest` is spread first so the dialog's own role and its
          stop-propagation handler cannot be overwritten by a caller and leave
          a modal that closes when you click inside it. */}
      <div
        {...rest}
        className={`modal ${pick(modalSize, size, "md")} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            {icon ? renderIcon(icon) : null}
            {title}
          </div>
          <div className="list-item-actions">
            <IconButton onClick={onClose} aria-label="Close">
              <X size={16} />
            </IconButton>
          </div>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
