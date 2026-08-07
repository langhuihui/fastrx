<template>
  <div class="enhanced-pipeline">
    <!-- Source Pipeline -->
    <div v-if="source.source" class="pipeline-chain">
      <enhanced-pipeline
        :source="source.source"
        :timeline-events="timelineEvents"
        :selected-node-id="selectedNodeId"
        :snapshot-map="snapshotMap"
        @add-timeline-event="$emit('add-timeline-event', $event)"
        @select-node="$emit('select-node', $event)"
      />

      <!-- Data Flow Animation -->
      <div class="flow-connector">
        <div class="flow-arrow">
          <div class="arrow-line"></div>
          <div class="arrow-head"></div>
        </div>

        <!-- Animated data particles -->
        <div
          v-for="(particle, index) in dataParticles"
          :key="index"
          class="data-particle"
          :style="particle.style"
          :class="{ active: particle.active }"
        >
          <div class="particle-content">{{ particle.data }}</div>
        </div>
      </div>
    </div>

    <!-- Main Observable Node -->
    <div
      class="observable-node"
      :class="{ 'node-selected': source.nodeId === selectedNodeId }"
      @click="emit('select-node', source.nodeId)"
    >
      <!-- Sub-pipelines -->
      <div v-if="source.sources.length > 0" class="sub-pipelines">
        <div
          v-for="(subSource, index) in source.sources"
          :key="index"
          class="sub-pipeline"
        >
          <enhanced-pipeline
            :source="subSource"
            :timeline-events="timelineEvents"
            :selected-node-id="selectedNodeId"
            :snapshot-map="snapshotMap"
            @add-timeline-event="$emit('add-timeline-event', $event)"
            @select-node="$emit('select-node', $event)"
          />

          <!-- Sub-pipeline flow indicators -->
          <div class="sub-flow-indicators">
            <div
              class="flow-indicator up"
              :class="{ active: subSource.cdSub > 0.1 }"
            >
              <n-icon size="16">
                <ArrowUpOutline />
              </n-icon>
            </div>
            <div
              class="flow-indicator down"
              :class="{ active: subSource.cdData > 0.1 }"
            >
              <n-icon size="16">
                <ArrowDownOutline />
              </n-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Node Content -->
      <div class="node-content">
        <div class="node-header">
          <div class="node-name">{{ source.toString() }}</div>
          <div class="node-status">
            <n-tag :type="getNodeStatusType()" size="small" :bordered="false">
              <template #icon>
                <n-icon>
                  <component :is="getStatusIcon()" />
                </n-icon>
              </template>
              {{ getNodeStatusText() }}
            </n-tag>
          </div>
        </div>

        <!-- Streams Display -->
        <div class="streams-container">
          <div
            v-for="(stream, index) in source.streams"
            :key="index"
            class="stream-item"
            :class="{ active: stream.status === 1 }"
          >
            <div class="stream-header">
              <div
                class="stream-color-indicator"
                :style="{ backgroundColor: stream.color }"
              ></div>
              <span class="stream-label">Stream {{ index + 1 }}</span>
            </div>

            <div class="stream-content">
              <n-tag
                :type="getStreamStatusType(stream.status)"
                size="small"
                @click="handleStreamClick(stream)"
                class="stream-tag"
              >
                <template #icon>
                  <n-icon>
                    <component :is="getStreamStatusIcon(stream.status)" />
                  </n-icon>
                </template>
                {{ streamLabel(stream, index) }}
              </n-tag>
            </div>

            <!-- Stream animation -->
            <div
              v-if="stream.status === 1"
              class="stream-pulse"
              :style="{ backgroundColor: stream.color }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import {
  CheckmarkCircleOutline,
  AlertCircleOutline,
  SyncOutline,
  PowerOutline,
  ArrowUpOutline,
  ArrowDownOutline,
  PlayOutline,
} from "@vicons/ionicons5";

// Props
const props = defineProps({
  source: {
    type: Object,
    required: true,
  },
  timelineEvents: {
    type: Array,
    default: () => [],
  },
  selectedNodeId: {
    type: String,
    default: null,
  },
  snapshotMap: {
    type: Map,
    default: null,
  },
});

// Emits
const emit = defineEmits(["add-timeline-event", "select-node"]);

// Reactive data
const dataParticles = ref([]);

// Computed
const isNodeActive = computed(() => {
  return props.source.streams.some((stream) => stream.status === 1);
});

// Methods
const getNodeStatusType = () => {
  if (props.source.streams.some((s) => s.status === -1)) return "error";
  if (props.source.streams.some((s) => s.status === 3)) return "success";
  if (props.source.streams.some((s) => s.status === 2)) return "warning";
  if (isNodeActive.value) return "info";
  return "default";
};

const getNodeStatusText = () => {
  if (props.source.streams.some((s) => s.status === -1)) return "错误";
  if (props.source.streams.some((s) => s.status === 3)) return "完成";
  if (props.source.streams.some((s) => s.status === 2)) return "取消";
  if (isNodeActive.value) return "活跃";
  return "等待";
};

const getStatusIcon = () => {
  if (props.source.streams.some((s) => s.status === -1))
    return AlertCircleOutline;
  if (props.source.streams.some((s) => s.status === 3))
    return CheckmarkCircleOutline;
  if (props.source.streams.some((s) => s.status === 2)) return PowerOutline;
  if (isNodeActive.value) return SyncOutline;
  return PlayOutline;
};

const getStreamStatusType = (status) => {
  switch (status) {
    case -1:
      return "error";
    case 1:
      return "info";
    case 2:
      return "warning";
    case 3:
      return "success";
    default:
      return "default";
  }
};

const getStreamStatusIcon = (status) => {
  switch (status) {
    case -1:
      return AlertCircleOutline;
    case 1:
      return SyncOutline;
    case 2:
      return PowerOutline;
    case 3:
      return CheckmarkCircleOutline;
    default:
      return PlayOutline;
  }
};

const handleStreamClick = (stream) => {
  emit("add-timeline-event", {
    type: "stream-click",
    message: `点击流: ${stream.label || "未命名流"}`,
    nodeId: props.source.name,
  });
};

// In replay mode (snapshotMap present), show the node's value at the scrub
// position instead of the live stream.label.
const streamLabel = (stream, index) => {
  if (props.snapshotMap) {
    const snap = props.snapshotMap.get(props.source.nodeId);
    if (snap !== undefined) return snap;
    return "—";
  }
  return stream.label || "等待数据...";
};

// Data flow animation
const createDataParticle = (data) => {
  const particle = {
    id: Date.now() + Math.random(),
    data: data,
    active: true,
    style: {
      left: "0%",
      opacity: "1",
    },
  };

  dataParticles.value.push(particle);

  // Animate particle
  setTimeout(() => {
    particle.style.left = "100%";
    particle.style.opacity = "0";
  }, 100);

  // Remove particle after animation
  setTimeout(() => {
    const index = dataParticles.value.findIndex((p) => p.id === particle.id);
    if (index > -1) {
      dataParticles.value.splice(index, 1);
    }
  }, 2000);
};

// Watch for data changes
watch(
  () => props.source.streams,
  (newStreams) => {
    newStreams.forEach((stream) => {
      if (stream.label && stream.status === 1) {
        createDataParticle(stream.label);
      }
    });
  },
  { deep: true }
);

// Watch for timeline events
watch(
  () => props.timelineEvents,
  (events) => {
    const recentEvents = events.filter(
      (event) => event.nodeId === props.source.name && event.type === "next"
    );

    if (recentEvents.length > 0) {
      const latestEvent = recentEvents[0];
      createDataParticle(latestEvent.message);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.enhanced-pipeline {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.pipeline-chain {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.flow-connector {
  position: relative;
  width: 80px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-arrow {
  position: relative;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #8a2be2, #00bfff);
  border-radius: 1px;
}

.flow-arrow::after {
  content: "";
  position: absolute;
  right: -8px;
  top: -3px;
  width: 0;
  height: 0;
  border-left: 8px solid #00bfff;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.data-particle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(45deg, #8a2be2, #00bfff);
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 10px;
  color: white;
  white-space: nowrap;
  transition: all 2s ease-out;
  z-index: 10;
}

.particle-content {
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.sub-pipelines {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.sub-pipeline {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sub-flow-indicators {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.flow-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.flow-indicator.active {
  background: linear-gradient(45deg, #8a2be2, #00bfff);
  color: white;
  animation: pulse 1s infinite;
}

.observable-node {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  min-width: 200px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.observable-node:hover {
  border-color: rgba(138, 43, 226, 0.5);
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.2);
}

.observable-node.node-selected {
  border-color: #00bfff;
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.4);
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.node-name {
  font-weight: bold;
  color: #8a2be2;
  font-size: 1.1rem;
}

.streams-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stream-item {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.stream-item.active {
  background: rgba(138, 43, 226, 0.1);
  border: 1px solid rgba(138, 43, 226, 0.3);
}

.stream-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.stream-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.stream-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.stream-content {
  display: flex;
  justify-content: center;
}

.stream-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.stream-tag:hover {
  transform: scale(1.05);
}

.stream-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  opacity: 0.1;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.1;
    transform: scale(1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .enhanced-pipeline {
    flex-direction: column;
    align-items: stretch;
  }

  .pipeline-chain {
    flex-direction: column;
  }

  .flow-connector {
    width: 40px;
    height: 80px;
    transform: rotate(90deg);
  }
}
</style>
