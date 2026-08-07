export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export const NAVIGATION = [
  { label: "Overview", href: "/" },
  { label: "Playground", href: "/playground" },
  {
    label: "GitHub",
    href: "https://github.com/langhuihui/fastrx",
  },
] as const satisfies readonly NavigationItem[];

export const FEATURES = [
  {
    title: "Push-based & tiny",
    body: "Observables are plain functions. No class hierarchies, no subscriptions objects — just (sink) => void.",
  },
  {
    title: "Devtools built in",
    body: "Chrome devtools extension with marble diagrams, causal links, time-travel replay, and per-node snapshots.",
  },
  {
    title: "Stable node IDs",
    body: "Every operator gets a stable identity (opName#N). Debug sessions survive reloads; panels update in place.",
  },
  {
    title: "Zero-config instrumentation",
    body: "No bundler plugin required. The library self-instruments via externally_connectable when devtools opens.",
  },
  {
    title: "Causal tracking",
    body: "Every event carries its cause. See exactly which upstream emission triggered a downstream value.",
  },
  {
    title: "Familiar operators",
    body: "map, filter, scan, merge, combineLatest, switchMap, debounceTime, retry — the RxJS vocabulary you know.",
  },
] as const satisfies readonly { readonly title: string; readonly body: string }[];

export const OPERATOR_CATEGORIES = [
  { name: "Sources", ops: ["of", "interval", "timer", "range", "fromEvent", "subject"] },
  { name: "Combiners", ops: ["merge", "combineLatest", "zip", "concat", "race"] },
  { name: "Operators", ops: ["map", "filter", "scan", "switchMap", "debounceTime", "delay", "take", "distinct"] },
  { name: "Terminals", ops: ["subscribe", "toPromise", "toReadableStream"] },
] as const satisfies readonly { readonly name: string; readonly ops: readonly string[] }[];
