/**
 * Types mirroring the NOAA National Water Prediction Service (NWPS) API.
 *
 * Field names match the API's JSON wire format exactly (including a handful
 * of inconsistently-cased fields on `Gauge`), so responses can be used
 * as-is without any translation layer.
 *
 * @see https://api.water.noaa.gov/nwps/v1/docs/
 */

// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------

/** Spatial reference system ID for a bounding box query. */
export type Srid = "SRID_UNSPECIFIED" | "EPSG_3857" | "EPSG_4326";

/** National Water Model forecast series. */
export type ForecastSeries =
  | "analysis_assimilation"
  | "short_range"
  | "medium_range"
  | "long_range"
  | "medium_range_blend";

/** Whether stage/flow data is observed or forecast. */
export type StageFlowProductType = "observed" | "forecast";

/** Sort direction for gauge ratings. */
export type RatingsSort = "ASC" | "DESC";

// ---------------------------------------------------------------------------
// Shared shapes
// ---------------------------------------------------------------------------

/** A named entity with an abbreviation, used for RFC/WFO/state references. */
export interface NamedEntity {
  abbreviation?: string;
  name?: string;
}

/** Standard Hydrometeorological Exchange Format parameter codes. */
export interface Pedts {
  observed?: string;
  forecast?: string;
}

// ---------------------------------------------------------------------------
// Gauges
// ---------------------------------------------------------------------------

export interface GaugeStatusPoint {
  primary?: number;
  primaryUnit?: string;
  secondary?: number;
  secondaryUnit?: string;
  floodCategory?: string;
  validTime?: string;
}

export interface GaugeStatus {
  observed?: GaugeStatusPoint;
  forecast?: GaugeStatusPoint;
}

/** A single gauge as returned by the gauges list endpoint. */
export interface GaugeListItem {
  lid?: string;
  name?: string;
  rfc?: NamedEntity;
  wfo?: NamedEntity;
  state?: NamedEntity;
  latitude?: number;
  longitude?: number;
  pedts?: Pedts;
  status?: GaugeStatus;
}

export interface ListGaugesResponse {
  gauges?: GaugeListItem[];
}

export interface FloodCategoryDatum {
  stage?: number;
  flow?: number;
}

export interface FloodCategories {
  action?: FloodCategoryDatum;
  minor?: FloodCategoryDatum;
  moderate?: FloodCategoryDatum;
  major?: FloodCategoryDatum;
}

export interface FloodCrestDatum {
  occurredTime?: string;
  stage?: number;
  flow?: number;
  preliminary?: string;
  olddatum?: boolean;
}

export interface FloodCrests {
  historic?: FloodCrestDatum[];
  recent?: FloodCrestDatum[];
}

export interface FloodImpact {
  stage?: number;
  statement?: string;
}

export interface FloodLowWaterDatum {
  occurredTime?: string;
  stage?: number;
  flow?: number;
  statement?: string;
}

export interface FloodLowWaters {
  historic?: FloodLowWaterDatum[];
}

export interface GaugeLRO {
  minorCS?: string;
  moderateCS?: string;
  majorCS?: string;
  producedTime?: string;
  interval?: string;
}

export interface GaugeFlood {
  stageUnits?: string;
  flowUnits?: string;
  categories?: FloodCategories;
  lro?: GaugeLRO;
  crests?: FloodCrests;
  lowWaters?: FloodLowWaters;
  impacts?: FloodImpact[];
}

export interface ProbabilityPeriod {
  stage?: string;
  flow?: string;
  volume?: string;
}

export interface ImagesProbability {
  weekint?: ProbabilityPeriod;
  entperiod?: ProbabilityPeriod;
  shortrange?: string;
}

export interface ImagesHydrograph {
  default?: string;
  floodcat?: string;
}

export interface GaugePhotoGeometry {
  type?: string;
  coordinates?: number[];
}

export interface GaugePhotoProperties {
  image?: string;
  caption?: string;
}

export interface GaugePhoto {
  id?: string;
  type?: string;
  geometry?: GaugePhotoGeometry;
  properties?: GaugePhotoProperties;
}

export interface GaugeImages {
  probability?: ImagesProbability;
  hydrograph?: ImagesHydrograph;
  photos?: GaugePhoto[];
}

export interface DataAttribution {
  abbrev?: string;
  text?: string;
  title?: string;
  url?: string;
}

export interface GaugeImpactLowWater {
  value?: string;
  impact?: string;
}

export interface NormalThreshold {
  value?: number;
  units?: string;
}

export interface LowThreshold {
  value?: number;
  units?: string;
}

export interface GaugeHydronote {
  statement?: string;
  effective?: string;
  expiration?: string;
}

export interface DatumValue {
  label?: string;
  abbrev?: string;
  description?: string;
  value?: number;
}

export interface GaugeDatums {
  vertical?: { value?: DatumValue[] };
  horizontal?: { value?: DatumValue[] };
  notes?: { value?: string[] };
}

export interface ZeroDatum {
  value?: number;
  datum?: string;
}

export interface InundationDownloads {
  depthGrids?: string;
  images?: string;
  kmz?: string;
}

export interface InundationDataAttribution {
  text?: string;
  title?: string;
  url?: string;
  image?: string;
}

export interface GaugeInundation {
  enabled?: boolean;
  url?: string;
  zeroDatum?: ZeroDatum;
  downloads?: InundationDownloads;
  siteSpecificInfo?: string;
  dataAttribution?: InundationDataAttribution[];
}

export interface GaugeInService {
  enabled?: boolean;
  message?: string;
}

/**
 * A single gauge's full metadata, as returned by `GET /gauges/{identifier}`.
 *
 * `TruncateObs`, `TruncateFcst`, `ObservedFloodCategory` and
 * `ForecastFloodCategory` are capitalized exactly as the API returns them.
 */
export interface Gauge {
  lid?: string;
  usgsId?: string;
  reachId?: string;
  name?: string;
  description?: string;
  rfc?: NamedEntity;
  wfo?: NamedEntity;
  state?: NamedEntity;
  county?: string;
  timeZone?: string;
  latitude?: number;
  longitude?: number;
  pedts?: Pedts;
  status?: GaugeStatus;
  flood?: GaugeFlood;
  images?: GaugeImages;
  dataAttribution?: DataAttribution[];
  impactsLowWaters?: GaugeImpactLowWater[];
  normalThreshold?: NormalThreshold;
  hydronotes?: GaugeHydronote[];
  datums?: GaugeDatums;
  inundation?: GaugeInundation;
  upstreamLid?: string;
  downstreamLid?: string;
  inService?: GaugeInService;
  lowThreshold?: LowThreshold;
  forecastReliability?: string;
  TruncateObs?: string;
  TruncateFcst?: string;
  ObservedFloodCategory?: string;
  ForecastFloodCategory?: string;
}

export interface Rating {
  stage?: number;
  flow?: number;
}

export interface Ratings {
  stageUnits?: string;
  flowUnits?: string;
  data?: Rating[];
}

export interface StageFlowDatum {
  /** When the observation was made, or when the forecast is valid. */
  validTime?: string;
  /** When the product was generated. */
  generatedTime?: string;
  primary?: number;
  secondary?: number;
}

export interface StageFlow {
  pedts?: string;
  /** When the product was issued. Not applicable to observed data. */
  issuedTime?: string;
  wfo?: string;
  timeZone?: string;
  primaryName?: string;
  primaryUnits?: string;
  secondaryName?: string;
  secondaryUnits?: string;
  data?: StageFlowDatum[];
}

export interface GetStageFlowAllResponse {
  observed?: StageFlow;
  forecast?: StageFlow;
}

// ---------------------------------------------------------------------------
// Reaches
// ---------------------------------------------------------------------------

export interface ReachRouteSegment {
  reachId?: string;
  streamOrder?: string;
}

export interface ReachRoute {
  upstream?: ReachRouteSegment[];
  downstream?: ReachRouteSegment[];
}

/** A single reach's metadata. */
export interface Reach {
  reachId?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  streamflow?: ForecastSeries[];
  route?: ReachRoute;
}

export interface StreamflowDatum {
  validTime?: string;
  flow?: number;
}

export interface Streamflow {
  referenceTime?: string;
  units?: string;
  data?: StreamflowDatum[];
}

export interface GetStreamflowResponse {
  reach?: Reach;
  analysisAssimilation?: Record<string, Streamflow>;
  shortRange?: Record<string, Streamflow>;
  mediumRange?: Record<string, Streamflow>;
  longRange?: Record<string, Streamflow>;
  mediumRangeBlend?: Record<string, Streamflow>;
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export interface GaugeFloodStats {
  observed?: Record<string, number>;
  forecast?: Record<string, number>;
}

export interface LastHMLReceived {
  fromAny?: string;
  wfo?: Record<string, string>;
}

export interface HMLStats {
  jobQueue?: number;
  productCounts?: Record<string, number>;
  lastHMLReceived?: LastHMLReceived;
}

export interface LROStats {
  currentLros?: number;
  currentInterval?: string;
}

export interface MonitorResponse {
  gauge?: GaugeFloodStats;
  hml?: HMLStats;
  lro?: LROStats;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export interface ApiErrorDetail {
  "@type"?: string;
  [key: string]: unknown;
}

/** Body of an error response, following the `google.rpc.Status` shape. */
export interface ApiErrorBody {
  code?: number;
  message?: string;
  details?: ApiErrorDetail[];
}

// ---------------------------------------------------------------------------
// Request parameters
// ---------------------------------------------------------------------------

export interface BoundingBox {
  /** Bottom-left X coordinate of a bounding box geometry. */
  xmin: number;
  /** Bottom-left Y coordinate of a bounding box geometry. */
  ymin: number;
  /** Top-right X coordinate of a bounding box geometry. */
  xmax: number;
  /** Top-right Y coordinate of a bounding box geometry. */
  ymax: number;
}

export interface ListGaugesParams {
  /** Restrict results to gauges within this bounding box. */
  bbox?: BoundingBox;
  /** Spatial reference system used by `bbox`. Default: `SRID_UNSPECIFIED`. */
  srid?: Srid;
  /** Filter gauges based on CatFIM configuration. Default: `false`. */
  catfim?: boolean;
}

export interface GetRatingsParams {
  /** Limit the number of returned results. Default: 10,000. */
  limit?: number | string;
  /** Sort by ascending or descending stage value. Default: `ASC`. */
  sort?: RatingsSort;
  /** Only return ratings at tenths-of-a-foot increments. Default: `false`. */
  onlyTenths?: boolean;
}

export interface GetStreamflowParams {
  /** National Water Model series to filter by. Default: `analysis_assimilation`. */
  series?: ForecastSeries;
}
