import type { HTMLAttributes, ReactNode, SVGAttributes } from "react";
import { renderIcon, type IconLike } from "./icon";

/**
 * The numbers, drawn.
 *
 * Until this file the kit could only state a metric — `<Stat>` is a number and
 * a word — so every generated dashboard was a row of tiles above a table, and
 * every generated dashboard looked like the last one. A trend is the thing a
 * dashboard is actually for, and drawing one cost the agent either a dependency
 * it is not allowed to add or a pile of hand-written SVG it would get wrong.
 *
 * So the charts are here, pre-written, and they are deliberately the three
 * shapes that cover almost every generated application: a trend over time, a
 * comparison between categories, and a proportion of a whole. Anything beyond
 * those is a real charting library's job and not a generated application's.
 *
 * All three are plain SVG with no dependency, sized by their container rather
 * than by a prop, and coloured from `var(--accent)` through CSS — so they
 * follow the palette on `<AppShell>` and both themes for free, like everything
 * else here. None of them has an axis, a legend or a tooltip: at the size a
 * card gives them those are noise, and the label belongs to the `<Card>` or the
 * `<Stat>` beside it.
 *
 * Every series is normalised to its own range, so a caller never computes a
 * maximum. An empty series renders an empty frame rather than nothing, which
 * keeps a loading card the same height as a loaded one.
 */

/** The viewBox every line chart is drawn in. Scaled by CSS, so units are arbitrary. */
const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 32;

/**
 * Map a series onto the viewBox.
 *
 * A flat series — every value equal, which a seeded fixture produces more
 * often than real data does — would divide by a zero range, so it is drawn
 * along the middle instead of at the top or off the frame.
 */
function points(data: readonly number[]): Array<{ x: number; y: number }> {
  if (data.length === 0) return [];
  if (data.length === 1) return [{ x: VIEW_WIDTH / 2, y: VIEW_HEIGHT / 2 }];

  const low = Math.min(...data);
  const high = Math.max(...data);
  const range = high - low;

  return data.map((value, index) => ({
    x: (index / (data.length - 1)) * VIEW_WIDTH,
    y: range === 0 ? VIEW_HEIGHT / 2 : VIEW_HEIGHT - ((value - low) / range) * VIEW_HEIGHT,
  }));
}

/** Two decimal places: enough for a 100-unit viewBox, and it keeps the path short. */
const path = (of: Array<{ x: number; y: number }>): string =>
  of.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  /** The series, oldest first. Normalised to its own range. */
  data?: readonly number[];
  /** Fill the area under the line. Off for a line in a dense table row. */
  area?: boolean;
  /** Mark the latest value with a dot — the point a reader looks for. */
  marker?: boolean;
  /** Accepted for consistency; a sparkline has no text for a mark to sit beside. */
  icon?: IconLike;
  /** Describes the trend for a screen reader, since the shape is the content. */
  "aria-label"?: string;
}

/**
 * A trend, small enough to sit inside a `<Stat>`, a `<Card>` header or a table
 * cell. The commonest chart in a generated application by a wide margin.
 */
export function Sparkline({
  data = [],
  area = true,
  marker = true,
  icon: _icon,
  className = "",
  ...rest
}: SparklineProps) {
  const plotted = points(data);
  const last = plotted[plotted.length - 1];

  return (
    <svg
      className={`sparkline ${className}`.trim()}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      {...rest}
    >
      {plotted.length > 1 && area && (
        <polygon
          className="sparkline-area"
          points={`0,${VIEW_HEIGHT} ${path(plotted)} ${VIEW_WIDTH},${VIEW_HEIGHT}`}
        />
      )}
      {plotted.length > 0 && <polyline className="sparkline-line" points={path(plotted)} />}
      {/* `vectorEffect` keeps the dot round under the non-uniform scale that
          `preserveAspectRatio="none"` applies to everything else. */}
      {marker && last && <circle className="sparkline-dot" cx={last.x} cy={last.y} r={2} />}
    </svg>
  );
}

export interface BarDatum {
  /** The category. Shown under the bar when there is room for it. */
  label?: ReactNode;
  value: number;
  /** A bar to pick out of the row — this month, the selected filter. */
  highlight?: boolean;
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  /** The categories, in the order they should read. */
  data?: readonly BarDatum[];
  /** The top of the scale. Defaults to the largest value in the series. */
  max?: number;
  /** Hide the labels under the bars, for a chart in a tight space. */
  compact?: boolean;
  /** A mark beside the chart's own caption, when it has one. */
  icon?: IconLike;
  /** A caption under the chart. */
  children?: ReactNode;
}

/**
 * A comparison between a handful of categories — the second chart almost every
 * application wants, and the one a `.grid-metrics` row cannot express.
 *
 * Bars grow on entry and are staggered by position, so the chart arrives
 * rather than appearing. Six to twelve bars reads well; beyond that the labels
 * are the problem and `compact` is the answer.
 */
export function BarChart({
  data = [],
  max,
  compact = false,
  icon,
  className = "",
  children,
  ...rest
}: BarChartProps) {
  const ceiling = max ?? Math.max(...data.map((datum) => datum.value), 0);

  return (
    <div className={`bar-chart ${className}`.trim()} {...rest}>
      <div className="bar-chart-plot stagger">
        {data.map((datum, index) => (
          <div className="bar-chart-column" key={index}>
            <div
              className={datum.highlight ? "bar bar-highlight" : "bar"}
              // The one legitimate inline style in the kit: a bar's height is
              // its datum. It is set as a custom property rather than as
              // `height` so the CSS owns the transition and the entrance.
              style={{ "--bar": ceiling > 0 ? datum.value / ceiling : 0 } as React.CSSProperties}
              role="presentation"
            />
            {!compact && datum.label !== undefined && (
              <span className="bar-label truncate">{datum.label}</span>
            )}
          </div>
        ))}
      </div>
      {children && (
        <p className="bar-chart-caption muted">
          {icon ? renderIcon(icon, 14) : null}
          {children}
        </p>
      )}
    </div>
  );
}

/** Geometry for the ring. A 36-unit box makes the circumference a round 100. */
const RING_RADIUS = 15.915;
const RING_CIRCUMFERENCE = 100;

export interface DonutProps extends HTMLAttributes<HTMLDivElement> {
  /** How much of the whole has been reached. */
  value?: number;
  /** The whole. */
  max?: number;
  /** The figure in the middle. Defaults to the percentage. */
  label?: ReactNode;
  /** A word under the figure — "of target", "complete". */
  children?: ReactNode;
  /** A mark instead of the figure, for a ring that is a status rather than a number. */
  icon?: IconLike;
}

/**
 * A proportion of a whole: a target met, a quota used, a share of a total.
 *
 * `<Progress>` says the same thing in a bar and is the right answer inside a
 * list row. This is the right answer when the proportion is the point of the
 * card — it carries its own figure and holds a `.grid` track on its own.
 */
export function Donut({
  value = 0,
  max = 100,
  label,
  icon,
  className = "",
  children,
  ...rest
}: DonutProps) {
  // Clamped: a value over its maximum is a plausible thing for real data to
  // do, and a ring that wrapped past itself would read as a smaller number.
  const fraction = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const percent = Math.round(fraction * 100);

  return (
    <div
      className={`donut ${className}`.trim()}
      role="img"
      aria-label={rest["aria-label"] ?? `${percent}%`}
      {...rest}
    >
      <svg className="donut-ring" viewBox="0 0 36 36">
        <circle className="donut-track" cx="18" cy="18" r={RING_RADIUS} />
        <circle
          className="donut-value"
          cx="18"
          cy="18"
          r={RING_RADIUS}
          strokeDasharray={`${(fraction * RING_CIRCUMFERENCE).toFixed(2)} ${RING_CIRCUMFERENCE}`}
        />
      </svg>
      <span className="donut-centre">
        {icon ? renderIcon(icon, 18) : <strong>{label ?? `${percent}%`}</strong>}
        {children && <span className="subtle">{children}</span>}
      </span>
    </div>
  );
}
