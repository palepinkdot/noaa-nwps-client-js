# nwps-client

A TypeScript/JavaScript client for NOAA's [National Water Prediction Service (NWPS) API](https://api.water.noaa.gov/nwps/v1/docs/) — gauge observations and forecasts, rating curves, National Water Model streamflow, and hydrologic products.

- Zero runtime dependencies — uses the native `fetch`
- Full TypeScript types for every request and response
- Works in Node.js (20+), browsers, and other `fetch`-capable runtimes
- Ships both ESM and CommonJS builds

## Install

```sh
npm install nwps-client
```

## Usage

```ts
import { NwpsClient } from "nwps-client";

const nwps = new NwpsClient();

// Get a gauge's metadata by LID or USGS ID.
const gauge = await nwps.gauges.get("ANAW1");
console.log(gauge.name, gauge.status?.observed?.primary);

// List gauges in a bounding box.
const { gauges } = await nwps.gauges.list({
  bbox: { xmin: -124.8, ymin: 45.5, xmax: -116.9, ymax: 49.0 },
  srid: "EPSG_4326",
});

// Get a gauge's rating curve.
const ratings = await nwps.gauges.getRatings("ANAW1", { sort: "ASC" });

// Get observed and forecast stage/flow for a gauge.
const stageFlow = await nwps.gauges.getStageFlow("ANAW1");

// Get National Water Model streamflow forecasts for a reach.
const reach = await nwps.reaches.get("23021904");
const streamflow = await nwps.reaches.getStreamflow("23021904", {
  series: "short_range",
});

// Get a specific hydrologic product by parameter code.
const product = await nwps.products.getStageFlow("ANAW1", "HGIRG");

// Check NWPS internal monitoring/data status.
const status = await nwps.health.monitor();
```

## Client options

```ts
const nwps = new NwpsClient({
  // Override the API base URL (e.g. for a proxy). Defaults to
  // "https://api.water.noaa.gov".
  baseUrl: "https://api.water.noaa.gov",

  // Extra headers sent with every request.
  headers: { "X-Api-Key": "..." },

  // Abort requests that take longer than this, in milliseconds.
  timeoutMs: 10_000,

  // Custom `fetch` implementation, e.g. for older Node versions or tests.
  fetch: myFetch,
});
```

## Error handling

Non-2xx responses reject with an `NwpsApiError`, which includes the HTTP
status and the parsed error body when the API returned one:

```ts
import { NwpsApiError } from "nwps-client";

try {
  await nwps.gauges.get("not-a-real-gauge");
} catch (error) {
  if (error instanceof NwpsApiError) {
    console.error(error.status, error.body?.message);
  }
}
```

## API coverage

| Resource   | Method                                       | Endpoint                                               |
| ---------- | -------------------------------------------- | ------------------------------------------------------ |
| `gauges`   | `list(params?)`                              | `GET /nwps/v1/gauges`                                  |
| `gauges`   | `get(identifier)`                            | `GET /nwps/v1/gauges/{identifier}`                     |
| `gauges`   | `getRatings(identifier, params?)`            | `GET /nwps/v1/gauges/{identifier}/ratings`             |
| `gauges`   | `getStageFlow(identifier)`                   | `GET /nwps/v1/gauges/{identifier}/stageflow`           |
| `gauges`   | `getStageFlowByProduct(identifier, product)` | `GET /nwps/v1/gauges/{identifier}/stageflow/{product}` |
| `reaches`  | `get(reachId)`                               | `GET /nwps/v1/reaches/{reachId}`                       |
| `reaches`  | `getStreamflow(reachId, params?)`            | `GET /nwps/v1/reaches/{reachId}/streamflow`            |
| `products` | `getStageFlow(identifier, pedts)`            | `GET /nwps/v1/products/stageflow/{identifier}/{pedts}` |
| `health`   | `monitor()`                                  | `GET /nwps/v1/monitor`                                 |

Response and parameter shapes mirror the [official API docs](https://api.water.noaa.gov/nwps/v1/docs/) field-for-field — see [`src/types.ts`](src/types.ts) for the full type definitions.

## Development

```sh
npm install
npm run build       # bundle to dist/ (ESM + CJS + .d.ts)
npm test            # run the test suite
npm run typecheck   # type-check without emitting
```

## License

MIT
