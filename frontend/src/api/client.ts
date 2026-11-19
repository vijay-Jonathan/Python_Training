/**
 * The only place the app talks to the network.
 *
 * Everything goes through `api()` so the base URL, the JSON handling and the error shape
 * are decided once. The base is a relative path rather than an origin, so requests are
 * same-origin through the Vite proxy and no `localhost` is ever shipped in a bundle.
 */
const BASE = import.meta.env.VITE_API_BASE ?? "/api";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? "GET";
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `${method} ${path} -> ${response.status}`);
  }

  return (await response.json()) as T;
}
