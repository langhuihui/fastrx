<template>
  <div class="marble-container">
    <!-- Fixed left column: lane labels -->
    <div class="lane-labels">
      <div
        v-for="(lane, i) in lanes"
        :key="lane.nodeId"
        class="lane-label-row"
        :style="{ height: LANE_H + 'px', color: lane.color, borderBottom: `2px solid ${lane.color}33` }"
      >
        <span class="lane-label-text">{{ lane.nodeId }}</span>
      </div>
      <div v-if="lanes.length === 0" class="lane-empty">等待事件…</div>
    </div>

    <!-- Scrollable lane area -->
    <div class="marble-scroll">
      <div class="marble-view" :style="{ width: totalWidth + 'px', height: totalHeight + 'px' }">
        <!-- Lanes -->
        <div
          v-for="lane in lanes"
          :key="lane.nodeId"
          class="marble-lane"
          :style="{ top: lane.y + 'px', height: LANE_H + 'px', borderBottom: `2px solid ${lane.color}22` }"
        >
          <button
            v-for="e in lane.events"
            :key="e.sequence"
            class="marble"
            :class="[
              `marble-${e.kind}`,
              {
                'marble-cause': causeChainSet.has(e.sequence),
                'marble-selected': selectedSeq === e.sequence,
                'marble-future': maxVisibleSeq != null && e.sequence > maxVisibleSeq,
              },
            ]"
            :style="{ left: e.sequence * COL_W + 'px', background: e.kind === 'next' ? lane.color : undefined }"
            @click="emit('select', e.sequence)"
            :title="`${e.kind} #${e.sequence}${e.data ? ' ' + e.data : ''}${e.err ? ' err=' + e.err : ''}`"
          >
            {{ e.kind === 'next' ? marbleText(e.data) : terminalSymbol(e.kind) }}
          </button>
        </div>

        <!-- SVG causal overlay (only when something is selected) -->
        <svg
          v-if="causalLines.length"
          class="causal-overlay"
          :width="totalWidth"
          :height="totalHeight"
        >
          <defs>
            <marker id="causal-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L7,4 L0,8 z" fill="#00bfff" />
            </marker>
          </defs>
          <line
            v-for="(l, i) in causalLines"
            :key="i"
            :x1="l.x1"
            :y1="l.y1"
            :x2="l.x2"
            :y2="l.y2"
            stroke="#00bfff"
            stroke-width="2"
            stroke-dasharray="4 2"
            marker-end="url(#causal-arrow)"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  events: { type: Array, required: true },
  nodeOrder: { type: Array, required: true },
  selectedSeq: { type: Number, default: null },
  causeChainSet: { type: Set, default: () => new Set() },
  maxVisibleSeq: { type: Number, default: null },
});
const emit = defineEmits(["select"]);

const COL_W = 44;
const LANE_H = 44;
const NODE_COLORS = [
  "#5e9cff",
  "#3dd68c",
  "#c084fc",
  "#ffb224",
  "#ff7c7c",
  "#45d0e6",
  "#f16ab3",
];

// Kinds shown as marbles; structural kinds (create/pipe/addSource) are excluded.
const DATA_KINDS = new Set(["next", "complete", "error", "subscribe", "defer"]);

const lanes = computed(() =>
  props.nodeOrder.map((nodeId, i) => ({
    nodeId,
    y: i * LANE_H,
    color: NODE_COLORS[i % NODE_COLORS.length],
    events: props.events.filter(
      (e) => e.nodeId === nodeId && DATA_KINDS.has(e.kind)
    ),
  }))
);

const maxSeq = computed(() =>
  props.events.reduce((m, e) => Math.max(m, e.sequence || 0), 0)
);
const totalWidth = computed(() => (maxSeq.value + 1) * COL_W);
const totalHeight = computed(() => props.nodeOrder.length * LANE_H);

// Causal lines: for each event in the selected chain that has a cause also in
// the chain, draw a line from cause marble to effect marble.
const causalLines = computed(() => {
  if (props.selectedSeq == null) return [];
  const laneIndexOf = new Map(props.nodeOrder.map((id, i) => [id, i]));
  const lines = [];
  for (const e of props.events) {
    if (!e.cause) continue;
    if (!props.causeChainSet.has(e.sequence)) continue;
    if (!props.causeChainSet.has(e.cause.sequence)) continue;
    // In replay mode, skip lines that point into the "future".
    if (props.maxVisibleSeq != null && e.sequence > props.maxVisibleSeq) continue;
    const ci = laneIndexOf.get(e.cause.nodeId);
    const ei = laneIndexOf.get(e.nodeId);
    if (ci == null || ei == null) continue;
    lines.push({
      x1: e.cause.sequence * COL_W + COL_W / 2,
      y1: ci * LANE_H + LANE_H / 2,
      x2: e.sequence * COL_W + COL_W / 2,
      y2: ei * LANE_H + LANE_H / 2,
    });
  }
  return lines;
});

function marbleText(data) {
  if (data === undefined || data === null || data === "") return "—";
  return data.length > 18 ? data.slice(0, 15) + "…" : data;
}

function terminalSymbol(kind) {
  switch (kind) {
    case "complete":
      return "✓";
    case "error":
      return "!";
    case "subscribe":
      return "▶";
    case "defer":
      return "×";
    default:
      return "•";
  }
}
</script>

<style scoped>
.marble-container {
  display: flex;
  max-width: 1200px;
  margin: 1rem auto;
  padding: 0 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.lane-labels {
  flex-shrink: 0;
  width: 140px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.lane-label-row {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  font-size: 0.72rem;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  overflow: hidden;
}

.lane-label-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lane-empty {
  padding: 1rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
}

.marble-scroll {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

.marble-view {
  position: relative;
}

.marble-lane {
  position: absolute;
  left: 0;
  width: 100%;
}

.marble {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 9px;
  line-height: 1;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  z-index: 1;
}

.marble:hover {
  transform: translate(-50%, -50%) scale(1.25);
  z-index: 3;
}

.marble-next {
  color: #fff;
}

.marble-complete {
  border-color: #18a058;
  color: #18a058;
  background: rgba(24, 160, 88, 0.15);
}

.marble-error {
  border-color: #d03050;
  color: #d03050;
  background: rgba(208, 48, 80, 0.15);
  animation: shake 0.4s ease-in-out;
}

.marble-subscribe {
  border-color: #f0a020;
  color: #f0a020;
  background: rgba(240, 160, 32, 0.15);
}

.marble-defer {
  border-color: #f0a020;
  color: #f0a020;
  background: rgba(240, 160, 32, 0.1);
}

.marble-cause {
  box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.5);
  z-index: 2;
}

.marble-selected {
  box-shadow: 0 0 0 3px #00bfff;
  z-index: 4;
}

.marble-future {
  opacity: 0.18;
  filter: grayscale(0.5);
}

.causal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
}

@keyframes shake {
  0%, 100% { transform: translate(-50%, -50%); }
  25% { transform: translate(-55%, -50%); }
  75% { transform: translate(-45%, -50%); }
}
</style>
