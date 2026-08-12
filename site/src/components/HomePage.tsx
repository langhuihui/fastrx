import { FEATURES, OPERATOR_CATEGORIES } from "../content.js";

const sampleCode = `import { pipe, of, map, filter, subscribe } from "fastrx";

pipe(
  of(1, 2, 3, 4, 5),
  filter((x) => x > 1),
  map((x) => x * 2),
  subscribe((value) => console.log(value)),
);
// 4  6  8  10`;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              Lightweight · devtools built in
            </p>
            <h1 id="hero-title">
              Reactive streams, <span>plain functions.</span>
            </h1>
            <p className="hero-summary">
              fastrx is a push-based reactive library where{" "}
              <code>Observable&lt;T&gt; = (sink) =&gt; void</code>. No class
              hierarchies, no subscription objects — just functions and pipes.
              Ships with a Chrome devtools extension for marble diagrams, causal
              tracking, and time-travel replay.
            </p>
            <div className="hero-actions">
              <a className="site-button site-button-primary" href="/playground">
                Try the playground
                <span aria-hidden="true">→</span>
              </a>
              <a className="site-button site-button-secondary" href="/devtools">
                Install DevTools
              </a>
            </div>
          </div>

          <div className="hero-code-window" aria-label="fastrx example">
            <div className="hero-code-toolbar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>example.ts</p>
            </div>
            <div className="hero-code-status">
              <span>Plain TypeScript</span>
              <span className="hero-code-status-badge">No bundler plugin</span>
            </div>
            <pre>
              <code>{sampleCode}</code>
            </pre>
            <div className="hero-code-output">
              <span className="hero-code-output-label">Output</span>
              <span>4  6  8  10</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="type-section" aria-labelledby="features-title">
        <div className="site-container">
          <h2 id="features-title" className="section-title">
            Why fastrx
          </h2>
          <ul className="home-feature-grid">
            {FEATURES.map((f) => (
              <li key={f.title} className="home-feature-card">
                <h3 className="home-feature-title">{f.title}</h3>
                <p className="home-feature-body">{f.body}</p>
                {"href" in f && f.href ? (
                  <p className="home-feature-link">
                    <a href={f.href}>{f.linkLabel ?? "Learn more →"}</a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Code example */}
      <section className="type-section" aria-labelledby="code-title">
        <div className="site-container">
          <h2 id="code-title" className="section-title">
            A simple pipeline
          </h2>
          <pre className="home-code-block">
            <code>{sampleCode}</code>
          </pre>
        </div>
      </section>

      {/* Operator gallery */}
      <section className="type-section" aria-labelledby="operators-title">
        <div className="site-container">
          <h2 id="operators-title" className="section-title">
            Operator catalogue
          </h2>
          <p className="section-lede">
            The familiar RxJS vocabulary — sources, combinners, operators, and
            terminals.
          </p>
          <div className="home-op-categories">
            {OPERATOR_CATEGORIES.map((cat) => (
              <div key={cat.name} className="home-op-category">
                <h3 className="home-op-category-title">{cat.name}</h3>
                <ul className="home-op-list">
                  {cat.ops.map((op) => (
                    <li key={op} className="home-op-chip">
                      <code>{op}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-section" aria-labelledby="cta-title">
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <h2 id="cta-title">
              Build reactive pipelines <span>visually.</span>
            </h2>
            <p className="hero-summary">
              Drag operators onto a canvas, connect them, and watch the live
              event flow with causal links.
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
