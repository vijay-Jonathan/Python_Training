import type { HTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Menu } from "./Menu";
import { renderIcon, type IconLike } from "./icon";
import { pick, type Loose } from "./props";

export interface BoardColumn {
  id: string;
  title: string;
  tone?: Loose<"neutral" | "accent" | "success" | "warning" | "danger" | "info">;
}

export interface BoardProps<T> extends HTMLAttributes<HTMLDivElement> {
  columns: BoardColumn[];
  cards: T[];
  columnOf: (card: T) => string;
  renderCard: (card: T) => ReactNode;
  /** Drag a card to another column — or pick "Move to" on the card's menu. */
  onMove?: (card: T, toColumnId: string) => void;
  icon?: IconLike;
}

/** A status pipeline — drag and drop, with a keyboard-accessible Move menu. */
export function Board<T>({
  columns,
  cards,
  columnOf,
  renderCard,
  onMove,
  icon,
  className = "",
  ...rest
}: BoardProps<T>) {
  return (
    <div className={`board ${className}`.trim()} {...rest}>
      {icon ? renderIcon(icon) : null}
      {columns.map((col) => {
        const inColumn = cards.filter((card) => columnOf(card) === col.id);
        return (
          <section
            key={col.id}
            className={`board-col ${pick({ neutral: "", accent: "board-col-accent", success: "board-col-success", warning: "board-col-warning", danger: "board-col-danger", info: "board-col-info" }, col.tone, "neutral")}`.trim()}
            onDragOver={onMove ? (e) => e.preventDefault() : undefined}
            onDrop={
              onMove
                ? (e) => {
                    e.preventDefault();
                    const at = Number(e.dataTransfer.getData("text/plain"));
                    if (!Number.isNaN(at)) onMove(cards[at], col.id);
                  }
                : undefined
            }
          >
            <header className="board-head">
              <span>{col.title}</span>
              <span className="muted">{inColumn.length}</span>
            </header>
            <div className="board-list">
              {inColumn.length === 0 ? <p className="board-empty muted">Nothing here</p> : null}
              {inColumn.map((card) => (
                <div
                  key={cards.indexOf(card)}
                  className="board-card"
                  draggable={onMove !== undefined}
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", String(cards.indexOf(card)))}
                >
                  <div className="board-card-body">{renderCard(card)}</div>
                  {onMove && columns.length > 1 ? (
                    <Menu
                      icon={ArrowRight}
                      trigger="Move"
                      items={columns
                        .filter((target) => target.id !== col.id)
                        .map((target) => ({
                          label: `To ${target.title}`,
                          onSelect: () => onMove(card, target.id),
                        }))}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
