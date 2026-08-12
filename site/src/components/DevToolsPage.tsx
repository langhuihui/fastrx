import {
  DEVTOOLS_CAPABILITIES,
  DEVTOOLS_INSTALL_STEPS,
  DEVTOOLS_TIPS,
  DEVTOOLS_TROUBLESHOOTING,
} from "../content.js";

const labelExample = `import { pipe, of, map, subscribe } from "fastrx";

pipe(
  of(1, 2, 3),
  map((x) => x * 2).label("double"),
  subscribe(console.log),
);`;

export default function DevToolsPage() {
  return (
    <>
      <section className="hero-section dt-hero" aria-labelledby="devtools-title">
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              Chrome extension
            </p>
            <h1 id="devtools-title">
              See every emission <span>as it happens.</span>
            </h1>
            <p className="hero-summary">
              The FastRx DevTools panel adds marble diagrams, causal tracking,
              and time-travel replay to Chrome DevTools — wired directly to the
              library with no bundler plugin.
            </p>
            <div className="hero-actions">
              <a className="site-button site-button-primary" href="#install">
                Install guide
                <span aria-hidden="true">→</span>
              </a>
              <a
                className="site-button site-button-secondary"
                href="https://github.com/langhuihui/fastrx/tree/main/devtools"
              >
                Source on GitHub
              </a>
            </div>
          </div>

          <div className="hero-code-window" aria-label="label example">
            <div className="hero-code-toolbar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>pipeline.ts</p>
            </div>
            <div className="hero-code-status">
              <span>Optional naming</span>
              <span className="hero-code-status-badge">.label()</span>
            </div>
            <pre>
              <code>{labelExample}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="type-section" aria-labelledby="capabilities-title">
        <div className="site-container">
          <div className="site-section-heading">
            <h2 id="capabilities-title">What you get</h2>
            <p>
              Built for debugging push pipelines in the browser — the same
              instrumentation the playground visualizes.
            </p>
          </div>
          <ul className="dt-capability-list">
            {DEVTOOLS_CAPABILITIES.map((item, index) => (
              <li key={item.title} className="dt-capability">
                <span className="dt-capability-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="dt-capability-title">{item.title}</h3>
                <p className="dt-capability-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="install"
        className="type-section dt-install-section"
        aria-labelledby="install-title"
      >
        <div className="site-container">
          <div className="site-section-heading">
            <h2 id="install-title">Install</h2>
            <p>
              Load the unpacked Chrome extension from this repository. Chrome
              76+ required for externally_connectable.
            </p>
          </div>
          <ol className="dt-steps">
            {DEVTOOLS_INSTALL_STEPS.map((step, index) => (
              <li key={step.title} className="dt-step">
                <div className="dt-step-header">
                  <span className="dt-step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className="dt-step-title">{step.title}</h3>
                </div>
                <p className="dt-step-body">{step.body}</p>
                {step.code ? (
                  <pre className="home-code-block">
                    <code>{step.code}</code>
                  </pre>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="type-section" aria-labelledby="tips-title">
        <div className="site-container">
          <div className="site-section-heading">
            <h2 id="tips-title">Usage notes</h2>
            <p>
              Instrumentation is on by default in the published package. Opt out
              only when you need a production build without the Inspect layer.
            </p>
          </div>
          <ul className="dt-tip-list">
            {DEVTOOLS_TIPS.map((tip) => (
              <li key={tip.title} className="dt-tip">
                <h3 className="dt-tip-title">{tip.title}</h3>
                <p className="dt-tip-body">{tip.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="type-section dt-trouble-section" aria-labelledby="trouble-title">
        <div className="site-container">
          <div className="site-section-heading">
            <h2 id="trouble-title">Troubleshooting</h2>
            <p>Most connection issues come from a stale panel build or a page CSP that blocks inspectedWindow.eval.</p>
          </div>
          <ul className="dt-trouble-list">
            {DEVTOOLS_TROUBLESHOOTING.map((item) => (
              <li key={item.title} className="dt-trouble">
                <h3 className="dt-trouble-title">{item.title}</h3>
                <p className="dt-trouble-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hero-section dt-cta" aria-labelledby="devtools-cta-title">
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <h2 id="devtools-cta-title">
              Try a pipeline <span>in the browser.</span>
            </h2>
            <p className="hero-summary">
              The playground runs the same event protocol locally — useful before
              you wire the extension into your app.
            </p>
            <div className="hero-actions">
              <a className="site-button site-button-primary" href="/playground">
                Open playground
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
