import type { CSSProperties } from "react";

/**
 * The entrance delay for item `index` in a list.
 *
 * A typed helper rather than a documented cast. Custom properties are not
 * assignable to `CSSProperties`, so writing `style={{ "--i": i }}` by hand is a
 * compile error and `as CSSProperties` / `as any` is the usual way out — which
 * means the common case of animating a list only compiles if the author
 * remembers a cast. The cast lives here once instead:
 *
 *     {items.map((item, i) => (
 *       <Card key={item.id} className="animate-in" style={stagger(i)} />
 *     ))}
 *
 * For a plain list of siblings, the `stagger` class in components.css does the
 * same thing with no props at all.
 */
export function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
