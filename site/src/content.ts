export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export const NAVIGATION = [
  { label: "Overview", href: "/" },
  { label: "DevTools", href: "/devtools" },
  { label: "Playground", href: "/playground" },
  {
    label: "GitHub",
    href: "https://github.com/langhuihui/fastrx",
  },
] as const satisfies readonly NavigationItem[];

export const DEVTOOLS_CAPABILITIES = [
  {
    title: "Marble diagrams",
    body: "Watch next, error, and complete events unfold on a timeline for every node in the pipeline.",
  },
  {
    title: "Causal links",
    body: "Every emission carries its cause. Click an event to highlight the full upstream chain that produced it.",
  },
  {
    title: "Time-travel replay",
    body: "Scrub through buffered history and re-inspect values after the fact — even if the stream already completed.",
  },
  {
    title: "Stable node IDs",
    body: "Operators keep identities like map#3 across reloads. Use .label() when you want a human-readable name in the panel.",
  },
] as const satisfies readonly { readonly title: string; readonly body: string }[];

export const DEVTOOLS_INSTALL_STEPS = [
  {
    title: "Clone the repository",
    body: "The extension ships in-repo under the devtools/ folder. Clone or download the project first.",
    code: `git clone https://github.com/langhuihui/fastrx.git
cd fastrx`,
  },
  {
    title: "Build the panel",
    body: "The Vue panel must be built before Chrome can load the extension.",
    code: `cd devtools/devtools/panel
npm install
npm run build`,
  },
  {
    title: "Load the unpacked extension",
    body: "Open chrome://extensions, enable Developer mode, then Load unpacked and select the repo’s top-level devtools/ folder (the one that contains manifest.json).",
    code: null,
  },
  {
    title: "Open the FastRx panel",
    body: "On any page that imports fastrx, open Chrome DevTools and switch to the FastRx tab. Events appear as soon as the panel connects — no bundler plugin required.",
    code: null,
  },
] as const satisfies readonly {
  readonly title: string;
  readonly body: string;
  readonly code: string | null;
}[];

export const DEVTOOLS_TIPS = [
  {
    title: "Zero-config instrumentation",
    body: "When the panel opens, the extension writes window.__fastrxExtId into the page. The library connects via chrome.runtime.connect — no content script or Vite plugin.",
  },
  {
    title: "Name nodes with .label()",
    body: "Call .label(\"checkout\") on an operator to show a stable display name in the panel without changing its node id.",
  },
  {
    title: "Strip instrumentation in production",
    body: "Define __FASTRX_NO_DEVTOOLS__ at compile time (bundler define) to dead-code-eliminate all Inspect wrapping.",
  },
  {
    title: "Events while the panel is closed",
    body: "The library keeps a 500-event ring buffer when DevTools is disconnected and drains it when the panel reconnects.",
  },
] as const satisfies readonly { readonly title: string; readonly body: string }[];

export const DEVTOOLS_TROUBLESHOOTING = [
  {
    title: "No FastRx tab",
    body: "Rebuild the panel (npm run build in devtools/devtools/panel), reload the extension on chrome://extensions, then close and reopen DevTools.",
  },
  {
    title: "Panel open but no events",
    body: "Confirm the page imports fastrx (not a build with __FASTRX_NO_DEVTOOLS__). In the page console, window.__fastrxExtId should be the extension id while the panel is visible.",
  },
  {
    title: "chrome.runtime.connect missing",
    body: "externally_connectable only works on http(s) pages. chrome:// and extension pages cannot connect.",
  },
] as const satisfies readonly { readonly title: string; readonly body: string }[];

export const FEATURES = [
  {
    title: "Push-based & tiny",
    body: "Observables are plain functions. No class hierarchies, no subscriptions objects — just (sink) => void.",
  },
  {
    title: "Devtools built in",
    body: "Chrome devtools extension with marble diagrams, causal links, time-travel replay, and per-node snapshots.",
    href: "/devtools",
    linkLabel: "Install guide →",
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
] as const satisfies readonly {
  readonly title: string;
  readonly body: string;
  readonly href?: string;
  readonly linkLabel?: string;
}[];

export const OPERATOR_CATEGORIES = [
  { name: "Sources", ops: ["of", "interval", "timer", "range", "fromEvent", "subject"] },
  { name: "Combiners", ops: ["merge", "combineLatest", "zip", "concat", "race"] },
  { name: "Operators", ops: ["map", "filter", "scan", "switchMap", "debounceTime", "delay", "take", "distinct"] },
  { name: "Terminals", ops: ["subscribe", "toPromise", "toReadableStream"] },
] as const satisfies readonly { readonly name: string; readonly ops: readonly string[] }[];
