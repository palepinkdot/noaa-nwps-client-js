import { describe, expect, it } from "vitest";
import { NwpsApiError, NwpsClient } from "../src/index.js";
import { mockFetchJson } from "./helpers.js";

describe("NwpsClient", () => {
  it("uses the default base URL", async () => {
    const fetchMock = mockFetchJson({ gauges: [] });
    const client = new NwpsClient({ fetch: fetchMock });

    await client.gauges.list();

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.origin).toBe("https://api.water.noaa.gov");
    expect(url.pathname).toBe("/nwps/v1/gauges");
  });

  it("allows overriding the base URL", async () => {
    const fetchMock = mockFetchJson({ gauges: [] });
    const client = new NwpsClient({ fetch: fetchMock, baseUrl: "https://example.test/" });

    await client.gauges.list();

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.origin).toBe("https://example.test");
  });

  it("sends custom headers with every request", async () => {
    const fetchMock = mockFetchJson({ gauges: [] });
    const client = new NwpsClient({ fetch: fetchMock, headers: { "X-Api-Key": "secret" } });

    await client.gauges.list();

    const requestInit = fetchMock.mock.calls[0]![1] as RequestInit;
    const headers = requestInit.headers as Record<string, string>;
    expect(headers["X-Api-Key"]).toBe("secret");
    expect(headers.Accept).toBe("application/json");
  });

  it("throws NwpsApiError with the parsed body on a non-2xx response", async () => {
    const fetchMock = mockFetchJson(
      { code: 5, message: "gauge not found" },
      { status: 404, statusText: "Not Found" },
    );
    const client = new NwpsClient({ fetch: fetchMock });

    await expect(client.gauges.get("does-not-exist")).rejects.toMatchObject({
      name: "NwpsApiError",
      status: 404,
      statusText: "Not Found",
      body: { code: 5, message: "gauge not found" },
    });
    await expect(client.gauges.get("does-not-exist")).rejects.toBeInstanceOf(NwpsApiError);
  });

  it("throws when no fetch implementation is available", () => {
    const originalFetch = globalThis.fetch;
    // @ts-expect-error simulating an environment without global fetch
    delete globalThis.fetch;

    try {
      expect(() => new NwpsClient()).toThrow(/No `fetch` implementation/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
