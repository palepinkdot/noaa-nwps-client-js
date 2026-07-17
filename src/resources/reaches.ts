import type { HttpClient } from "../http.js";
import type { GetStreamflowParams, GetStreamflowResponse, Reach } from "../types.js";

/** Reach metadata and streamflow forecasts from the National Water Model. */
export class ReachesResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get metadata for a specific reach.
   * @param reachId The reach's unique Reach ID, e.g. `"23021904"`.
   */
  get(reachId: string): Promise<Reach> {
    return this.http.get(`/nwps/v1/reaches/${encodeURIComponent(reachId)}`);
  }

  /**
   * Get streamflow forecast values for a specific reach.
   * @param reachId The reach's unique Reach ID, e.g. `"23021904"`.
   */
  getStreamflow(
    reachId: string,
    params: GetStreamflowParams = {},
  ): Promise<GetStreamflowResponse> {
    return this.http.get(`/nwps/v1/reaches/${encodeURIComponent(reachId)}/streamflow`, {
      series: params.series,
    });
  }
}
