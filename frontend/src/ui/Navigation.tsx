import type { HTMLAttributes, ReactNode } from "react";
import { renderIcon, type IconLike } from "./icon";

/**
 * Moving between views inside one screen, and showing what happened in order.
 *
 * Both shapes existed in `components.css` as bare classes — `.tabs > .tab`,
 * and nothing at all for a history — which meant every generated application
 * re-derived the same markup, re-wired the same `aria-selected`, and got the
 * keyboard handling wrong in the same way. A class is the right unit for a
 * layout; it is the wrong unit for anything with state or a role, because the
 * part that is easy to get wrong is exactly the part a class cannot carry.
 */

export interface TabItem {
  /** Matched against `active`. */
  id: string;
  label: ReactNode;
  /** A mark before the label — a lucide component or an element. */
  icon?: IconLike;
  /** A count beside the label: unread, failing, pending. */
  badge?: ReactNode;
}

/**
 * The div's native `onSelect` is dropped: it fires on text selection, which is
 * not what anybody writing `<Tabs onSelect>` means, and leaving both in place
 * makes the handler's argument a `SyntheticEvent` instead of the tab's id.
 */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items?: readonly TabItem[];
  /** The id of the current tab. */
  active?: string;
  /** Called with the id of the tab the reader chose. */
  onSelect?: (id: string) => void;
  /** A mark before the whole strip — a section's own symbol. */
  icon?: IconLike;
  /** Rendered after the tabs, right-aligned: a filter, a count, an action. */
  children?: ReactNode;
}

/**
 * A row of views over the same subject.
 *
 * Controlled, like every other stateful thing here: the caller owns which tab
 * is current, because it owns what the tab is showing. The roles, the arrow
 * keys and the focus ring come with it.
 */
export function Tabs({
  items = [],
  active,
  onSelect,
  icon,
  className = "",
  children,
  ...rest
}: TabsProps) {
  const current = items.findIndex((item) => item.id === active);

  /** Left and right move between tabs, which is what the role promises. */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0 || items.length === 0 || onSelect === undefined) return;

    event.preventDefault();
    const from = current < 0 ? 0 : current;
    onSelect(items[(from + step + items.length) % items.length].id);
  };

  return (
    <div className={`tabs ${className}`.trim()} role="tablist" onKeyDown={onKeyDown} {...rest}>
      {icon ? <span className="tabs-mark">{renderIcon(icon, 16)}</span> : null}
      {items.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            className="tab"
            aria-selected={selected}
            // Only the current tab is in the tab order; the arrow keys reach
            // the others. Without this a reader tabs through every view's
            // name before reaching the view itself.
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect?.(item.id)}
          >
            {item.icon ? renderIcon(item.icon, 15) : null}
            {item.label}
            {item.badge !== undefined && <span className="tab-badge">{item.badge}</span>}
          </button>
        );
      })}
      {children && <span className="tabs-extra">{children}</span>}
    </div>
  );
}

export interface TimelineEvent {
  /**
   * Only ever a React key, so it takes whatever the row's id is.
   *
   * `string` alone rejected every timeline fed from the database — an
   * activity row's id is a number — and cost a repair cycle to learn, which
   * is a lot for a key. `CalendarEvent.id` reads the same way.
   */
  id?: string | number;
  /** When it happened. Already formatted — this component does not parse dates. */
  at?: ReactNode;
  title: ReactNode;
  /** What happened, under the title. */
  detail?: ReactNode;
  /** A mark on the rail — a lucide component or an element. */
  icon?: IconLike;
  /** Colours the mark: success, warning, danger, info, accent. */
  tone?: string;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  events?: readonly TimelineEvent[];
  /** A mark for the whole list, when it is used without a `<Card>` title. */
  icon?: IconLike;
  /** Rendered after the last event — a "load more", or a closing note. */
  children?: ReactNode;
}

/**
 * What happened, in order: an audit trail, an order's progress, a changelog.
 *
 * The third thing a real application shows that this kit could not, after a
 * trend and a comparison. Entries stagger down the rail on entry, so a history
 * reads as a sequence rather than arriving as a block.
 */
export function Timeline({
  events = [],
  icon,
  className = "",
  children,
  ...rest
}: TimelineProps) {
  return (
    <ol className={`timeline stagger ${className}`.trim()} {...rest}>
      {events.map((event, index) => (
        <li className="timeline-event" key={event.id ?? index}>
          <span className={`timeline-mark ${event.tone ?? ""}`.trim()}>
            {renderIcon(event.icon ?? icon, 13)}
          </span>
          <div className="timeline-body">
            {event.at !== undefined && <span className="timeline-at subtle">{event.at}</span>}
            <span className="timeline-title">{event.title}</span>
            {event.detail !== undefined && <p className="muted">{event.detail}</p>}
          </div>
        </li>
      ))}
      {children && <li className="timeline-extra">{children}</li>}
    </ol>
  );
}
