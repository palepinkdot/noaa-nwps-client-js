import type { HttpClient } from "../http.js";
import type { MonitorResponse } from "../types.js";

/** NWPS internal monitoring and data status. */
export class HealthResource {
  constructor(private readonly http: HttpClient) {}

  /** Get NWPS internal monitoring and data status. */
  monitor(): Promise<MonitorResponse> {
    return this.http.get("/nwps/v1/monitor");
  }
}
