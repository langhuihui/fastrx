import { useEffect, useState } from "react";

import { NAVIGATION } from "./content.js";
import { applyPageSeo } from "./seo.js";
import HomePage from "./components/HomePage.js";
import PlaygroundPage from "./playground/PlaygroundPage.js";

function currentPath(): string {
  const path = window.location.pathname;
  return path === "/" ? path : path.replace(/\/+$/, "");
}

export default function App() {
  const [path, setPath] = useState(currentPath);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const focusMainContent = () => {
      window.requestAnimationFrame(() => {
        document.getElementById("main-content")?.focus();
      });
    };

    const handlePopState = () => {
      setPath(currentPath());
      setMenuOpen(false);
      focusMainContent();
    };

    const handleNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor =
        target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;

      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", destination);
      setPath(
        destination.pathname === "/"
          ? "/"
          : destination.pathname.replace(/\/+$/, ""),
      );
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "auto" });
      focusMainContent();
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleNavigation);
    };
  }, []);

  const isHome = path === "/";
  const isPlayground = path === "/playground";

  useEffect(() => {
    applyPageSeo(path);
  }, [path]);

  return (
    <div className="site-shell">
      <a className="site-skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="site-header-inner">
          <a className="site-wordmark" href="/" aria-label="fastrx home">
            <span className="site-wordmark-mark" aria-hidden="true">
              f
            </span>
            <span>fastrx</span>
          </a>

          <button
            className="site-nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="site-nav-toggle-label">Menu</span>
            <span className="site-nav-toggle-icon" aria-hidden="true" />
          </button>

          <nav
            id="site-navigation"
            className={`site-nav${menuOpen ? " site-nav-open" : ""}`}
            aria-label="Primary navigation"
          >
            <ul className="site-nav-list">
              {NAVIGATION.map((item) => {
                const playgroundLink = item.href === "/playground";
                const active =
                  (item.href === "/" && isHome) ||
                  (playgroundLink && isPlayground);

                return (
                  <li key={item.label}>
                    <a
                      className={
                        playgroundLink
                          ? "site-nav-link site-nav-playground"
                          : "site-nav-link"
                      }
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {isHome ? (
          <HomePage />
        ) : isPlayground ? (
          <PlaygroundPage />
        ) : (
          <section className="site-not-found" aria-labelledby="not-found-title">
            <h1 id="not-found-title">Page not found</h1>
            <p>The page you requested does not exist.</p>
            <a className="site-button site-button-primary" href="/">
              Return home
            </a>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <a className="site-wordmark site-footer-wordmark" href="/">
            fastrx
          </a>
          <p>A lightweight push-based reactive library with devtools.</p>
          <nav aria-label="Footer navigation">
            <ul className="site-footer-links">
              {NAVIGATION.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
