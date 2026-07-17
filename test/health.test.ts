import { describe, expect, it } from "vitest";
import { NwpsClient } from "../src/index.js";
import { mockFetchJson } from "./helpers.js";

describe("HealthResource", () => {
  it("monitor() hits the monitor endpoint", async () => {
    const fetchMock = mockFetchJson({ gauge: {}, hml: {}, lro: {} });
    const client = new NwpsClient({ fetch: fetchMock });

    const result = await client.health.monitor();

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/nwps/v1/monitor");
    expect(result).toEqual({ gauge: {}, hml: {}, lro: {} });
  });
});
