import type { HttpClient } from "../http.js";
import type { StageFlow } from "../types.js";

/** Hydrologic products queried by parameter code. */
export class ProductsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get stage/flow data for a specific gauge and parameter code.
   * @param identifier The gauge's LID or USGS ID, e.g. `"ANAW1"` or `"13334300"`.
   * @param pedts The Standard Hydrometeorological Exchange Format parameter code, e.g. `"HGIRG"`.
   */
  getStageFlow(identifier: string, pedts: string): Promise<StageFlow> {
    return this.http.get(
      `/nwps/v1/products/stageflow/${encodeURIComponent(identifier)}/${encodeURIComponent(pedts)}`,
    );
  }
}
