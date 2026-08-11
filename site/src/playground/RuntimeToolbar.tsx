interface RuntimeToolbarProps {
  readonly lifecycle: string;
  readonly error: string | null;
  readonly canRun: boolean;
  readonly onRun: () => void;
  readonly onStop: () => void;
  readonly onReset: () => void;
  readonly onPreset: (id: string) => void;
  readonly presets: ReadonlyArray<{ id: string; title: string; description: string }>;
  /** Slow-motion value spacing in ms (0 = realtime). */
  readonly speedMs: number;
  readonly onSpeedChange: (ms: number) => void;
  /** Share the current graph as a link with the graph encoded in the hash. */
  readonly onShare: () => void;
  readonly shareCopied: boolean;
  readonly canShare: boolean;
}

const SPEED_OPTIONS = [
  { value: 0, label: "Realtime" },
  { value: 200, label: "0.2s/value" },
  { value: 500, label: "0.5s/value" },
  { value: 1000, label: "1s/value" },
  { value: 2000, label: "2s/value" },
] as const;

export default function RuntimeToolbar({
  lifecycle,
  error,
  canRun,
  onRun,
  onStop,
  onReset,
  onPreset,
  presets,
  speedMs,
  onSpeedChange,
  onShare,
  shareCopied,
  canShare,
}: RuntimeToolbarProps) {
  const running = lifecycle === "running";
  return (
    <div className="pg-toolbar">
      <div className="pg-toolbar-group">
        {!running ? (
          <button
            type="button"
            className="pg-toolbar-btn pg-toolbar-btn-primary"
            onClick={onRun}
            disabled={!canRun}
          >
            ▶ Run
          </button>
        ) : (
          <button
            type="button"
            className="pg-toolbar-btn pg-toolbar-btn-stop"
            onClick={onStop}
          >
            ⏸ Stop
          </button>
        )}
        <button type="button" className="pg-toolbar-btn" onClick={onReset}>
          ↺ Reset
        </button>
        <button
          type="button"
          className="pg-toolbar-btn pg-toolbar-btn-share"
          onClick={onShare}
          disabled={!canShare}
        >
          {shareCopied ? "Copied ✓" : "Share link"}
        </button>
      </div>

      <div className="pg-toolbar-group pg-toolbar-speed">
        <label className="pg-toolbar-label" htmlFor="pg-speed">
          Speed
        </label>
        <select
          id="pg-speed"
          className="pg-toolbar-select"
          value={speedMs}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          title="Interval between values. Takes effect on next Run."
        >
          {SPEED_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {speedMs > 0 && running && (
          <span className="pg-toolbar-hint">Takes effect on next Run</span>
        )}
      </div>

      <div className="pg-toolbar-group pg-toolbar-presets">
        <span className="pg-toolbar-label">Examples:</span>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            className="pg-toolbar-btn pg-toolbar-btn-preset"
            onClick={() => onPreset(p.id)}
            title={p.description}
          >
            {p.title}
          </button>
        ))}
      </div>

      {error && <p className="pg-toolbar-error">{error}</p>}
    </div>
  );
}

