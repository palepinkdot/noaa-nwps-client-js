import { HttpClient, type NwpsClientOptions } from "./http.js";
import { GaugesResource } from "./resources/gauges.js";
import { HealthResource } from "./resources/health.js";
import { ProductsResource } from "./resources/products.js";
import { ReachesResource } from "./resources/reaches.js";

export type { NwpsClientOptions };

/**
 * Client for the NOAA National Water Prediction Service (NWPS) API.
 *
 * @example
 * ```ts
 * const nwps = new NwpsClient();
 * const gauge = await nwps.gauges.get("ANAW1");
 * ```
 */
export class NwpsClient {
  /** Gauge metadata, ratings, and stage/flow observations and forecasts. */
  readonly gauges: GaugesResource;
  /** Reach metadata and streamflow forecasts from the National Water Model. */
  readonly reaches: ReachesResource;
  /** Hydrologic products queried by parameter code. */
  readonly products: ProductsResource;
  /** NWPS internal monitoring and data status. */
  readonly health: HealthResource;

  constructor(options: NwpsClientOptions = {}) {
    const http = new HttpClient(options);
    this.gauges = new GaugesResource(http);
    this.reaches = new ReachesResource(http);
    this.products = new ProductsResource(http);
    this.health = new HealthResource(http);
  }
}
