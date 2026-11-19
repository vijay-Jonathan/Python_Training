/**
 * Prop types that accept what a generating model actually writes.
 *
 * Every build failure this design system has caused was the same shape: the
 * agent wrote a reasonable call, a prop type rejected it, and a repair cycle
 * was spent deleting the prop. The components answer most of that by listing
 * the props and forwarding their element's attributes. This file answers the
 * rest — the small closed vocabularies.
 *
 * A union like `"primary" | "ghost"` rejects two things beyond a typo. It
 * rejects a word that is reasonable but not in *this* component's list, and it
 * rejects a `string`, which is what a tone computed from state has:
 *
 *     const tone = order.paid ? "success" : "warning";   // string
 *     <Badge tone={tone}>                                 // TS2322
 *
 * Both have cost real builds. So the vocabularies are stated but not enforced:
 * {@link Loose} keeps the suggestions while accepting any string, and
 * {@link pick} resolves one to a class with a documented fallback. An unknown
 * word renders as the default instead of failing to compile — which for a
 * generated application is always the better trade.
 */

/**
 * A closed vocabulary that still accepts any string.
 *
 * `string & {}` is not a no-op: it is a type `string` is assignable to, which
 * keeps the union from collapsing to plain `string` and so keeps the listed
 * words as editor suggestions. Widening to `string` outright would lose them.
 */
export type Loose<T extends string> = T | (string & {});

/**
 * Narrow a loosely typed word back to the vocabulary, or to the fallback.
 *
 * `Object.hasOwn` rather than `in`, so `tone="toString"` resolves to the
 * fallback instead of to a function off the prototype.
 *
 * Returns the word rather than its class, because a component usually has
 * more than one map keyed by the same vocabulary — a size selects a CSS class
 * *and* an icon's pixel size, and both must agree on which word won.
 *
 * @param map Any total `Record` over the vocabulary; only its keys are read.
 *   Total, so adding a word without giving it a value is a compile error at
 *   the map rather than a silent fallback here.
 * @param word What the caller passed: a known word, an unknown string, or
 *   nothing.
 * @param fallback The word to use when `word` is absent or unknown.
 */
export function resolve<T extends string>(
  map: Record<T, unknown>,
  word: Loose<T> | undefined,
  fallback: T,
): T {
  return word !== undefined && Object.hasOwn(map, word) ? (word as T) : fallback;
}

/** {@link resolve}, for the common case of one map straight to one class. */
export function pick<T extends string>(
  map: Record<T, string>,
  word: Loose<T> | undefined,
  fallback: T,
): string {
  return map[resolve(map, word, fallback)];
}
