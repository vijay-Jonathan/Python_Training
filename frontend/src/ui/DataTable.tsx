import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { EmptyState, Skeleton } from "./Feedback";
import { IconButton } from "./Button";
import { Input } from "./Field";
import { renderIcon, type IconLike } from "./icon";

export interface DataColumn<T> {
  /** A field name on T, or any string when `render` supplies the cell. */
  key: string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  /** Click-to-sort on the cell's text value. */
  sortable?: boolean;
  /** 'right' puts the cell in the .num class. */
  align?: "left" | "right";
  width?: string | number;
}

export interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: keyof T | ((row: T) => string | number);
  /** Client-side text filter; a string is the search placeholder. */
  searchable?: boolean | string;
  pageSize?: number;
  loading?: boolean;
  /** What renders when there is nothing to show (defaults to EmptyState). */
  empty?: ReactNode;
  toolbar?: ReactNode;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => ReactNode;
  /** A mark on the toolbar row — every component takes `icon`. */
  icon?: IconLike;
}

const keyOf = <T,>(rowKey: DataTableProps<T>["rowKey"], row: T) =>
  typeof rowKey === "function" ? rowKey(row) : String(row[rowKey]);

const cellText = <T,>(col: DataColumn<T>, row: T) => {
  const value = row[col.key as keyof T];
  return value === null || value === undefined ? "" : String(value);
};

/** Sort, filter and paginate a record list — the one table an app writes. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  searchable = false,
  pageSize = 10,
  loading = false,
  empty,
  toolbar,
  onRowClick,
  rowActions,
  icon,
  className = "",
  ...rest
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let out = rows;
    const q = query.trim().toLowerCase();
    if (q) out = out.filter((row) => columns.some((col) => cellText(col, row).toLowerCase().includes(q)));
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col) {
        out = [...out].sort((a, b) => {
          const x = cellText(col, a), y = cellText(col, b);
          const n = Number(x), m = Number(y);
          const cmp = Number.isNaN(n) || Number.isNaN(m) ? x.localeCompare(y) : n - m;
          return cmp * sort.dir;
        });
      }
    }
    return out;
  }, [rows, query, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const slice = filtered.slice(current * pageSize, current * pageSize + pageSize);

  return (
    <div className={`data-table ${className}`.trim()} {...rest}>
      {searchable || toolbar || icon ? (
        <div className="data-table-toolbar">
          {icon ? renderIcon(icon) : null}
          {searchable ? (
            <Input
              icon={Search}
              placeholder={typeof searchable === "string" ? searchable : "Search"}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            />
          ) : null}
          {toolbar}
        </div>
      ) : null}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => {
                const sorted = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={col.align === "right" ? "num" : undefined}
                    aria-sort={sorted ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
                    onClick={col.sortable ? () => setSort(sorted && sort.dir === 1 ? { key: col.key, dir: -1 } : { key: col.key, dir: 1 }) : undefined}
                  >
                    {col.header}
                    {col.sortable ? <span className="sort-mark">{sorted ? (sort.dir === 1 ? " ▲" : " ▼") : " ⇅"}</span> : null}
                  </th>
                );
              })}
              {rowActions ? <th className="num" /> : null}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i}>
                    <td colSpan={columns.length + (rowActions ? 1 : 0)}>
                      <Skeleton lines={1} />
                    </td>
                  </tr>
                ))
              : slice.map((row) => (
                  <tr
                    key={keyOf(rowKey, row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? "row-link" : undefined}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={col.align === "right" ? "num" : undefined}>
                        {col.render ? col.render(row) : cellText(col, row)}
                      </td>
                    ))}
                    {rowActions ? <td className="num">{rowActions(row)}</td> : null}
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 ? (empty ?? <EmptyState title="Nothing here yet" />) : null}
      </div>
      {pageCount > 1 || filtered.length > 0 ? (
        <Pagination
          page={current}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  page: number;
  pageCount: number;
  /** Shown as "1-10 of N"; omit for compact controls. */
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  icon?: IconLike;
}

/** "1-10 of 42" with prev/next — the footer DataTable carries. */
export function Pagination({
  page,
  pageCount,
  total,
  pageSize = 10,
  onPageChange,
  icon,
  className = "",
  ...rest
}: PaginationProps) {
  const from = total ? Math.min(total, page * pageSize + 1) : 0;
  const to = total ? Math.min(total, (page + 1) * pageSize) : 0;
  return (
    <div className={`pagination ${className}`.trim()} {...rest}>
      {icon ? renderIcon(icon) : null}
      <span className="muted">
        {total !== undefined ? `${from}–${to} of ${total}` : `${page + 1} / ${pageCount}`}
      </span>
      <IconButton icon={ChevronLeft} aria-label="Previous page" disabled={page <= 0} onClick={() => onPageChange(page - 1)} />
      <IconButton icon={ChevronRight} aria-label="Next page" disabled={page >= pageCount - 1} onClick={() => onPageChange(page + 1)} />
    </div>
  );
}
