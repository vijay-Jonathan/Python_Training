import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./Button";
import { renderIcon, type IconLike } from "./icon";
import { pick, type Loose } from "./props";

export interface MenuItem {
  label: string;
  icon?: IconLike;
  onSelect: () => void;
  tone?: Loose<"danger" | "neutral">;
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  items: MenuItem[];
  /** A mark inside the trigger, after its content (defaults to a chevron). */
  icon?: IconLike;
  /** Button tone for the default trigger rendering. */
  tone?: Loose<"outline" | "ghost" | "primary">;
}

/** Row and toolbar actions as a dropdown: click-outside, Esc, arrow keys. */
export function Menu({ trigger, items, icon, tone = "ghost", className = "", ...rest }: MenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const move = (dir: 1 | -1) => {
    const buttons = list.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]");
    if (!buttons?.length) return;
    const at = Array.from(buttons).indexOf(document.activeElement as HTMLButtonElement);
    buttons[(at + dir + buttons.length) % buttons.length].focus();
  };

  return (
    <div className={`menu ${className}`.trim()} ref={root} {...rest}>
      <Button
        tone={tone}
        iconRight={icon ?? ChevronDown}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { setOpen(true); e.preventDefault(); }
        }}
      >
        {trigger}
      </Button>
      {open ? (
        <div
          className="menu-pop"
          role="menu"
          ref={list}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); e.stopPropagation(); }
            if (e.key === "ArrowDown") { move(1); e.preventDefault(); }
            if (e.key === "ArrowUp") { move(-1); e.preventDefault(); }
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`menu-item ${pick({ danger: "menu-item-danger", neutral: "" }, item.tone, "neutral")}`.trim()}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {renderIcon(item.icon)}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
