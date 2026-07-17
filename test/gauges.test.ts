import { describe, expect, it } from "vitest";
import { NwpsClient } from "../src/index.js";
import { mockFetchJson } from "./helpers.js";

describe("GaugesResource", () => {
  it("list() sends bbox, srid, and catfim as flattened query params", async () => {
    const fetchMock = mockFetchJson({ gauges: [] });
    const client = new NwpsClient({ fetch: fetchMock });

    await client.gauges.list({
      bbox: { xmin: -100, ymin: 30, xmax: -90, ymax: 40 },
      srid: "EPSG_4326",
      catfim: true,
    });

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.searchParams.get("bbox.xmin")).toBe("-100");
    expect(url.searchParams.get("bbox.ymin")).toBe("30");
    expect(url.searchParams.get("bbox.xmax")).toBe("-90");
    expect(url.searchParams.get("bbox.ymax")).toBe("40");
    expect(url.searchParams.get("srid")).toBe("EPSG_4326");
    expect(url.searchParams.get("catfim")).toBe("true");
  });

  it("list() omits unset params", async () => {
    const fetchMock = mockFetchJson({ gauges: [] });
    const client = new NwpsClient({ fetch: fetchMock });

    await client.gauges.list();

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.search).toBe("");
  });

  it("get() encodes the identifier into the path", async () => {
    const fetchMock = mockFetchJson({ lid: "ANAW1", name: "Anatone" });
    const client = new NwpsClient({ fetch: fetchMock });

    const gauge = await client.gauges.get("ANAW1");

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/nwps/v1/gauges/ANAW1");
    expect(gauge).toEqual({ lid: "ANAW1", name: "Anatone" });
  });

  it("getRatings() sends limit, sort, and onlyTenths", async () => {
    const fetchMock = mockFetchJson({ data: [] });
    const client = new NwpsClient({ fetch: fetchMock });

    await client.gauges.getRatings("ANAW1", { limit: 50, sort: "DESC", onlyTenths: true });

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/nwps/v1/gauges/ANAW1/ratings");
    expect(url.searchParams.get("limit")).toBe("50");
    expect(url.searchParams.get("sort")).toBe("DESC");
    expect(url.searchParams.get("onlyTenths")).toBe("true");
  });

  it("getStageFlow() hits the combined observed+forecast endpoint", async () => {
    const fetchMock = mockFetchJson({ observed: {}, forecast: {} });
    const client = new NwpsClient({ fetch: fetchMock });

    await client.gauges.getStageFlow("ANAW1");

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/nwps/v1/gauges/ANAW1/stageflow");
  });

  it("getStageFlowByProduct() appends the product segment", async () => {
    const fetchMock = mockFetchJson({ pedts: "HGIRG" });
    const client = new NwpsClient({ fetch: fetchMock });

    await client.gauges.getStageFlowByProduct("ANAW1", "forecast");

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/nwps/v1/gauges/ANAW1/stageflow/forecast");
  });
});
