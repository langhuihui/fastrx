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
  { value: 0, label: "实时" },
  { value: 200, label: "0.2s/值" },
  { value: 500, label: "0.5s/值" },
  { value: 1000, label: "1s/值" },
  { value: 2000, label: "2s/值" },
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
          {shareCopied ? "已复制 ✓" : "分享链接"}
        </button>
      </div>

      <div className="pg-toolbar-group pg-toolbar-speed">
        <label className="pg-toolbar-label" htmlFor="pg-speed">
          速度
        </label>
        <select
          id="pg-speed"
          className="pg-toolbar-select"
          value={speedMs}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          title="每个值之间的间隔；下次 Run 生效"
        >
          {SPEED_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {speedMs > 0 && running && (
          <span className="pg-toolbar-hint">下次 Run 生效</span>
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

