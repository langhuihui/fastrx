import { of, interval, range, timer } from "fastrx";

// Helpers injected into the `new Function` scope so user expressions like
// `x => of(x, x * 2)` can construct inner Observables.
const HELPERS = { of, interval, range, timer };
const HELPER_NAMES = Object.keys(HELPERS);
const HELPER_VALUES = Object.values(HELPERS);

/**
 * Evaluate a user-provided expression as a function with the given parameter
 * names. Uses `new Function` (single-user playground, same threat model as a
 * devtools console — NOT multi-tenant). HELPERS (of/interval/range/timer) are
 * injected so `switchMap(x => of(x*2))` works.
 *
 * Throws on evaluation failure or if the result is not a function.
 */
export function safeFn(params: string[], body: string): (...args: unknown[]) => unknown {
  const factory = new Function(
    ...HELPER_NAMES,
    ...params,
    `"use strict"; return (${body});`,
  );
  const fn = factory(...HELPER_VALUES);
  if (typeof fn !== "function") {
    throw new Error(`expression must evaluate to a function, got ${typeof fn}`);
  }
  return fn as (...args: unknown[]) => unknown;
}

/** Parse a "1,2,3" values string into an array of JSON-parsed values. */
export function parseValues(values: string): unknown[] {
  return values
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return s;
      }
    });
}

/** Parse a JSON value or return the raw string if JSON.parse fails. */
export function parseValue(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
