import { vi } from "vitest";

/** Builds a mock `fetch` that returns the given JSON body for every call. */
export function mockFetchJson(body: unknown, init: { status?: number; statusText?: string } = {}) {
  const status = init.status ?? 200;
  const statusText = init.statusText ?? "OK";

  const fetchMock = vi.fn(async (_input: string | URL, _init?: RequestInit) => {
    return new Response(JSON.stringify(body), {
      status,
      statusText,
      headers: { "Content-Type": "application/json" },
    });
  });

  return fetchMock as unknown as typeof globalThis.fetch & typeof fetchMock;
}
