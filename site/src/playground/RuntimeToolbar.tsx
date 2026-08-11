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
  /** Currently selected preset id (for dropdown sync). */
  readonly selectedPresetId: string | null;
  /** Share the current graph as a link with the graph encoded in the hash. */
  readonly onShare: () => void;
  readonly shareCopied: boolean;
  readonly canShare: boolean;
}

const SPEED_TICKS = [0, 200, 500, 1000, 2000] as const;
const SPEED_MIN = 0;
const SPEED_MAX = 2000;
const SPEED_STEP = 100;

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
  selectedPresetId,
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
        <input
          type="range"
          id="pg-speed"
          className="pg-toolbar-slider"
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={SPEED_STEP}
          value={speedMs}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          title="Interval between values (ms). 0 = realtime. Takes effect on next Run."
        />
        <span className="pg-toolbar-speed-label">
          {speedMs === 0 ? "Realtime" : `${speedMs}ms`}
        </span>
        {speedMs > 0 && running && (
          <span className="pg-toolbar-hint">Takes effect on next Run</span>
        )}
      </div>

      <div className="pg-toolbar-group pg-toolbar-presets">
        <label className="pg-toolbar-label" htmlFor="pg-preset">
          Examples
        </label>
        <select
          id="pg-preset"
          className="pg-toolbar-select"
          value={selectedPresetId ?? ""}
          onChange={(e) => {
            const id = e.target.value;
            if (id) onPreset(id);
          }}
        >
          <option value="" disabled>
            — Select an example —
          </option>
          {presets.map((p) => (
            <option key={p.id} value={p.id} title={p.description}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="pg-toolbar-error">{error}</p>}
    </div>
  );
}


