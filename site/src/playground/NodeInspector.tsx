import { isSubgraphable, lookupSpec, type ParamSpec } from "./node-catalogue.js";

interface NodeInspectorProps {
  readonly nodeId: string | null;
  readonly op: string | null;
  readonly params: Record<string, string>;
  readonly onParamChange: (name: string, value: string) => void;
  readonly onDelete: () => void;
  /** Historical output values for this node (cleared on every run). */
  readonly history?: readonly string[];
  /** Open the nested subgraph editor (only shown for *Map operators). */
  readonly onEditSubgraph?: () => void;
}

function ParamInput({
  spec,
  value,
  onChange,
}: {
  spec: ParamSpec;
  value: string;
  onChange: (v: string) => void;
}) {
  const className = `pg-param-input pg-param-input-${spec.type}`;
  if (spec.type === "expr") {
    return (
      <textarea
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={spec.placeholder}
        rows={2}
        spellCheck={false}
      />
    );
  }
  return (
    <input
      type="text"
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={spec.placeholder}
      spellCheck={false}
    />
  );
}

export default function NodeInspector({
  nodeId,
  op,
  params,
  onParamChange,
  onDelete,
  history,
  onEditSubgraph,
}: NodeInspectorProps) {
  if (!nodeId || !op) {
    return (
      <aside className="pg-inspector pg-inspector-empty" aria-label="Node inspector">
        <p>Select a node to edit its parameters.</p>
      </aside>
    );
  }
  const spec = lookupSpec(op);
  if (!spec) {
    return (
      <aside className="pg-inspector" aria-label="Node inspector">
        <p>Unknown operator: {op}</p>
      </aside>
    );
  }
  return (
    <aside className="pg-inspector" aria-label="Node inspector">
      <header className="pg-inspector-header">
        <h2 className="pg-inspector-title">
          <code>{op}</code>
        </h2>
        <button type="button" className="pg-inspector-delete" onClick={onDelete}>
          Delete
        </button>
      </header>
      <p className="pg-inspector-desc">{spec.description}</p>
      {isSubgraphable(spec.op) && onEditSubgraph && (
        <button
          type="button"
          className="pg-inspector-subgraph-btn"
          onClick={onEditSubgraph}
        >
          Edit inner stream (subgraph)
        </button>
      )}
      {spec.params.length > 0 ? (
        <dl className="pg-param-list">
          {spec.params.map((p) => (
            <div key={p.name} className="pg-param-row">
              <dt className="pg-param-label">
                <code>{p.name}</code>
                <span className="pg-param-type">{p.type}</span>
              </dt>
              <dd className="pg-param-input-wrap">
                <ParamInput
                  spec={p}
                  value={params[p.name] ?? p.default}
                  onChange={(v) => onParamChange(p.name, v)}
                />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="pg-inspector-no-params">No parameters.</p>
      )}
      {history && history.length > 0 && (
        <section className="pg-inspector-history" aria-label="Output history">
          <h3 className="pg-inspector-history-title">Output history</h3>
          <ol className="pg-inspector-history-list">
            {history.map((v, i) => (
              <li key={i} className="pg-inspector-history-item">
                <span className="pg-inspector-history-idx">{i + 1}</span>
                <code>{v}</code>
              </li>
            ))}
          </ol>
        </section>
      )}
    </aside>
  );
}
