import { useMemo, useState, type HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton, Button } from "./Button";
import { renderIcon, type IconLike } from "./icon";
import { pick, type Loose } from "./props";

export interface CalendarEvent {
  id: string | number;
  date: Date | string;
  title: string;
  tone?: Loose<"neutral" | "accent" | "success" | "warning" | "danger" | "info">;
}

export interface CalendarProps extends HTMLAttributes<HTMLDivElement> {
  /** Any date inside the month to show; defaults to today. */
  month?: Date;
  events?: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  icon?: IconLike;
}

const dayMs = 86_400_000;
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** A month grid with events — bookings, deadlines, anything dated. */
export function Calendar({
  month,
  events = [],
  onSelectDate,
  onEventClick,
  icon,
  className = "",
  ...rest
}: CalendarProps) {
  const [view, setView] = useState(() => month ?? new Date());
  const year = view.getFullYear();
  const m = view.getMonth();

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = dayKey(new Date(event.date));
      map.set(key, [...(map.get(key) ?? []), event]);
    }
    return map;
  }, [events]);

  const first = new Date(year, m, 1);
  const offset = (first.getDay() + 6) % 7; // week starts Monday
  const days = Array.from(
    { length: offset + new Date(year, m + 1, 0).getDate() },
    (_, i) => new Date(year, m, 1 + i - offset),
  );
  const today = dayKey(new Date());
  const shift = (n: number) => setView(new Date(year, m + n, 1));

  return (
    <div className={`calendar ${className}`.trim()} {...rest}>
      <div className="cal-head">
        {icon ? renderIcon(icon) : null}
        <span className="cal-title">
          {view.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </span>
        <IconButton icon={ChevronLeft} aria-label="Previous month" onClick={() => shift(-1)} />
        <IconButton icon={ChevronRight} aria-label="Next month" onClick={() => shift(1)} />
        <Button size="sm" onClick={() => setView(new Date())}>Today</Button>
      </div>
      <div className="cal-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="cal-dow muted">{d}</div>
        ))}
        {days.map((day) => {
          const out = day.getMonth() !== m;
          const items = byDay.get(dayKey(day)) ?? [];
          return (
            <div
              key={day.getTime() + (out ? dayMs : 0)}
              className={`cal-day${out ? " cal-out" : ""}${dayKey(day) === today ? " cal-today" : ""}${onSelectDate ? " cal-pick" : ""}`}
              onClick={onSelectDate ? () => onSelectDate(day) : undefined}
            >
              <span className="cal-num">{day.getDate()}</span>
              {items.slice(0, 3).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className={`cal-chip ${pick({ neutral: "", accent: "cal-accent", success: "cal-success", warning: "cal-warning", danger: "cal-danger", info: "cal-info" }, event.tone, "accent")}`.trim()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick?.(event);
                  }}
                >
                  {event.title}
                </button>
              ))}
              {items.length > 3 ? <span className="cal-more muted">+{items.length - 3} more</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
