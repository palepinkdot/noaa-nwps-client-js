import { NwpsApiError } from "./errors.js";
import type { ApiErrorBody } from "./types.js";

export type FetchLike = typeof globalThis.fetch;

export interface NwpsClientOptions {
  /**
   * Base URL of the NWPS API.
   * @default "https://api.water.noaa.gov"
   */
  baseUrl?: string;
  /**
   * Custom `fetch` implementation. Defaults to the global `fetch`.
   * Provide one for runtimes without a native `fetch` (older Node) or to
   * inject a mock in tests.
   */
  fetch?: FetchLike;
  /** Extra headers sent with every request. */
  headers?: Record<string, string>;
  /** Abort requests that take longer than this, in milliseconds. */
  timeoutMs?: number;
}

const DEFAULT_BASE_URL = "https://api.water.noaa.gov";

/** Internal helper used by resource classes to talk to the NWPS API. */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;
  private readonly headers: Record<string, string>;
  private readonly timeoutMs?: number;

  constructor(options: NwpsClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");

    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (!fetchImpl) {
      throw new Error(
        "No `fetch` implementation is available in this environment. " +
          "Pass one explicitly via `new NwpsClient({ fetch })`.",
      );
    }
    this.fetchImpl = fetchImpl;
    this.headers = options.headers ?? {};
    this.timeoutMs = options.timeoutMs;
  }

  async get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    const url = new URL(this.baseUrl + path);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }

    const controller = this.timeoutMs !== undefined ? new AbortController() : undefined;
    const timeout =
      controller && this.timeoutMs !== undefined
        ? setTimeout(() => controller.abort(), this.timeoutMs)
        : undefined;

    try {
      const response = await this.fetchImpl(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json", ...this.headers },
        signal: controller?.signal,
      });

      const text = await response.text();
      const body = text.length > 0 ? safeJsonParse(text) : undefined;

      if (!response.ok) {
        throw new NwpsApiError(
          `NWPS API request failed: ${response.status} ${response.statusText}`,
          {
            status: response.status,
            statusText: response.statusText,
            url: url.toString(),
            body: body as ApiErrorBody | undefined,
          },
        );
      }

      return body as T;
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);
    }
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
