import { describe, expect, it } from "vitest";
import { NwpsClient } from "../src/index.js";
import { mockFetchJson } from "./helpers.js";

describe("ProductsResource", () => {
  it("getStageFlow() builds the identifier/pedts path", async () => {
    const fetchMock = mockFetchJson({ pedts: "HGIRG" });
    const client = new NwpsClient({ fetch: fetchMock });

    await client.products.getStageFlow("ANAW1", "HGIRG");

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/nwps/v1/products/stageflow/ANAW1/HGIRG");
  });
});
