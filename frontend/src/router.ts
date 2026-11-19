/**
 * A hash router in a dozen lines — enough for a marketing site wrapped around
 * the application, without a routing dependency.
 *
 * Routes are `#/path` URLs: `#/` the landing page, `#/about` `#/contact`
 * marketing pages, `#/app` and below the product. Hash URLs need no server
 * routing, so the same static bundle works anywhere it is deployed.
 */
import { useSyncExternalStore } from "react";

function current(): string {
  const hash = window.location.hash.replace(/^#/, "");
  return hash === "" ? "/" : hash;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** The current route path — "/", "/about", "/app/orders", … */
export function useRoute(): string {
  return useSyncExternalStore(subscribe, current);
}

/** Go to a route path; pass the same paths nav items and links carry. */
export function navigate(path: string) {
  window.location.hash = path;
}

/** The href for a route path — links are plain anchors. */
export const href = (path: string) => `#${path}`;
