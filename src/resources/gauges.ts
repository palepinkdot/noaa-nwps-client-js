import type { HttpClient } from "../http.js";
import type {
  Gauge,
  GetRatingsParams,
  GetStageFlowAllResponse,
  ListGaugesParams,
  ListGaugesResponse,
  Ratings,
  StageFlow,
  StageFlowProductType,
} from "../types.js";

/** Gauge metadata, ratings, and stage/flow observations and forecasts. */
export class GaugesResource {
  constructor(private readonly http: HttpClient) {}

  /** Get a list of gauges, optionally filtered by bounding box or CatFIM configuration. */
  list(params: ListGaugesParams = {}): Promise<ListGaugesResponse> {
    return this.http.get("/nwps/v1/gauges", {
      "bbox.xmin": params.bbox?.xmin,
      "bbox.ymin": params.bbox?.ymin,
      "bbox.xmax": params.bbox?.xmax,
      "bbox.ymax": params.bbox?.ymax,
      srid: params.srid,
      catfim: params.catfim,
    });
  }

  /**
   * Get a gauge and its metadata.
   * @param identifier The gauge's LID or USGS ID, e.g. `"ANAW1"` or `"13334300"`.
   */
  get(identifier: string): Promise<Gauge> {
    return this.http.get(`/nwps/v1/gauges/${encodeURIComponent(identifier)}`);
  }

  /**
   * Get the rating curve (stage-to-flow relationship) for a gauge.
   * @param identifier The gauge's LID or USGS ID, e.g. `"ANAW1"` or `"13334300"`.
   */
  getRatings(identifier: string, params: GetRatingsParams = {}): Promise<Ratings> {
    return this.http.get(`/nwps/v1/gauges/${encodeURIComponent(identifier)}/ratings`, {
      limit: params.limit,
      sort: params.sort,
      onlyTenths: params.onlyTenths,
    });
  }

  /**
   * Get both observed and forecast stage/flow product data for a gauge.
   * @param identifier The gauge's LID or USGS ID, e.g. `"ANAW1"` or `"13334300"`.
   */
  getStageFlow(identifier: string): Promise<GetStageFlowAllResponse> {
    return this.http.get(`/nwps/v1/gauges/${encodeURIComponent(identifier)}/stageflow`);
  }

  /**
   * Get either observed or forecast stage/flow product data for a gauge.
   * @param identifier The gauge's LID or USGS ID, e.g. `"ANAW1"` or `"13334300"`.
   * @param product `"observed"` or `"forecast"`.
   */
  getStageFlowByProduct(
    identifier: string,
    product: StageFlowProductType,
  ): Promise<StageFlow> {
    return this.http.get(
      `/nwps/v1/gauges/${encodeURIComponent(identifier)}/stageflow/${encodeURIComponent(product)}`,
    );
  }
}
