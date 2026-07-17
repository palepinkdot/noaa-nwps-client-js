import type { ApiErrorBody } from "./types.js";

export interface NwpsApiErrorOptions {
  status: number;
  statusText: string;
  url: string;
  body?: ApiErrorBody;
}

/** Thrown when the NWPS API responds with a non-2xx status code. */
export class NwpsApiError extends Error {
  /** HTTP status code of the response. */
  readonly status: number;
  /** HTTP status text of the response. */
  readonly statusText: string;
  /** The request URL that produced this error. */
  readonly url: string;
  /** Parsed JSON error body, if the response contained one. */
  readonly body?: ApiErrorBody;

  constructor(message: string, options: NwpsApiErrorOptions) {
    super(message);
    this.name = "NwpsApiError";
    this.status = options.status;
    this.statusText = options.statusText;
    this.url = options.url;
    this.body = options.body;

    // Restore the prototype chain (needed when targeting ES5 or when
    // bundlers transpile class extension of built-ins).
    Object.setPrototypeOf(this, NwpsApiError.prototype);
  }
}
