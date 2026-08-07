import { CATALOGUE, CATEGORY_LABELS, CATEGORY_COLORS } from "./node-catalogue.js";

interface PaletteProps {
  readonly onAddNode: (op: string) => void;
}

const CATEGORY_ORDER = ["source", "combiner", "operator", "terminal"] as const;

export default function NodePalette({ onAddNode }: PaletteProps) {
  return (
    <aside className="pg-palette" aria-label="Node palette">
      <h2 className="pg-palette-title">Operators</h2>
      {CATEGORY_ORDER.map((cat) => {
        const specs = CATALOGUE.filter((s) => s.category === cat);
        return (
          <section key={cat} className="pg-palette-category">
            <h3 className="pg-palette-category-title" style={{ color: CATEGORY_COLORS[cat] }}>
              {CATEGORY_LABELS[cat]}
            </h3>
            <ul className="pg-palette-list">
              {specs.map((s) => (
                <li key={s.op}>
                  <button
                    type="button"
                    className="pg-palette-item"
                    onClick={() => onAddNode(s.op)}
                    title={s.description}
                  >
                    <code>{s.op}</code>
                    <span className="pg-palette-item-ports">
                      {s.inputs > 0 && <span aria-label="inputs">{s.inputs}→</span>}
                      {s.outputs > 0 && <span aria-label="outputs">→{s.outputs}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </aside>
  );
}
