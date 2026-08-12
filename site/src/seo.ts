export interface PageSeo {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly robots?: string;
}

export const SITE_NAME = "fastrx";
export const SITE_ORIGIN = "https://rx.langhuihui.com";
export const SITE_TAGLINE = "Reactive streams, plain functions.";
export const DEFAULT_DESCRIPTION =
  "fastrx is a lightweight push-based reactive library where Observable<T> = (sink) => void. Ships with Chrome DevTools for marble diagrams, causal tracking, and time-travel replay.";

export const HOME_SEO: PageSeo = {
  title: "fastrx — Reactive Library",
  description: DEFAULT_DESCRIPTION,
  path: "/",
};

export const PLAYGROUND_SEO: PageSeo = {
  title: "Playground | fastrx",
  description:
    "Build and run fastrx pipelines visually. Connect sources, operators, and terminals, then inspect the event flow with marble diagrams.",
  path: "/playground",
};

export const NOT_FOUND_SEO: PageSeo = {
  title: "Page not found | fastrx",
  description: "The page you requested does not exist.",
  path: "/404",
  robots: "noindex, follow",
};

/** Absolute site origin. Prefer VITE_SITE_URL override, else the production domain. */
export function siteOrigin(): string {
  const fromEnv = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(
    /\/+$/,
    "",
  );
  return fromEnv || SITE_ORIGIN;
}

export function absoluteUrl(path: string): string {
  const origin = siteOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${normalized === "/" ? "/" : normalized}` : normalized;
}

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: Record<string, unknown>): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function seoForPath(path: string): PageSeo {
  if (path === "/") return HOME_SEO;
  if (path === "/playground") return PLAYGROUND_SEO;
  return NOT_FOUND_SEO;
}

/** Update document title + meta tags for the current SPA route. */
export function applyPageSeo(path: string): void {
  const page = seoForPath(path);
  const url = absoluteUrl(page.path === "/404" ? path : page.path);
  const image = absoluteUrl("/og-image.jpg");

  document.title = page.title;

  upsertMeta("name", "description", page.description);
  upsertMeta("name", "robots", page.robots ?? "index, follow");
  upsertLink("canonical", url);

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", page.title);
  upsertMeta("property", "og:description", page.description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertMeta("property", "og:image:alt", `${SITE_NAME} — ${SITE_TAGLINE}`);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", page.title);
  upsertMeta("name", "twitter:description", page.description);
  upsertMeta("name", "twitter:image", image);

  upsertJsonLd("fastrx-jsonld", {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en",
      },
      {
        "@type": ["SoftwareApplication", "SoftwareSourceCode"],
        name: SITE_NAME,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        description: DEFAULT_DESCRIPTION,
        url: absoluteUrl("/"),
        downloadUrl: "https://www.npmjs.com/package/fastrx",
        codeRepository: "https://github.com/langhuihui/fastrx",
        programmingLanguage: ["TypeScript", "JavaScript"],
        license: "https://opensource.org/licenses/MIT",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  });
}
