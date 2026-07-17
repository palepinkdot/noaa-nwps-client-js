import { describe, expect, it } from "vitest";
import { NwpsClient } from "../src/index.js";
import { mockFetchJson } from "./helpers.js";

describe("ReachesResource", () => {
  it("get() encodes the reachId into the path", async () => {
    const fetchMock = mockFetchJson({ reachId: "23021904" });
    const client = new NwpsClient({ fetch: fetchMock });

    await client.reaches.get("23021904");

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/nwps/v1/reaches/23021904");
  });

  it("getStreamflow() sends the series query param", async () => {
    const fetchMock = mockFetchJson({});
    const client = new NwpsClient({ fetch: fetchMock });

    await client.reaches.getStreamflow("23021904", { series: "short_range" });

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/nwps/v1/reaches/23021904/streamflow");
    expect(url.searchParams.get("series")).toBe("short_range");
  });

  it("getStreamflow() omits series when not provided", async () => {
    const fetchMock = mockFetchJson({});
    const client = new NwpsClient({ fetch: fetchMock });

    await client.reaches.getStreamflow("23021904");

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.searchParams.has("series")).toBe(false);
  });
});
