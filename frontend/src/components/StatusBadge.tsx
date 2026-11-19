import { Badge } from "../ui";

/** The API's reachability, as a status pill. Thin over the design system's Badge. */
export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "success" | "danger" }) {
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}
