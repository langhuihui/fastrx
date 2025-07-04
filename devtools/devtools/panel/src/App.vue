<template>
  <n-config-provider :theme="darkTheme">
    <div class="app">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div class="logo-section">
            <img src="./assets/Rx_Logo_S.png" alt="FastRx Logo" />
            <div class="title-section">
              <h1 class="title">FastRx 可视化面板</h1>
              <p class="subtitle">实时数据流监控与动画展示</p>
            </div>
          </div>

          <div class="legend-section">
            <n-space>
              <n-tag
                v-for="item in legendItems"
                :key="item.status"
                :type="item.type"
                :bordered="false"
                size="small"
              >
                <template #icon>
                  <component :is="item.icon" />
                </template>
                {{ item.label }}
              </n-tag>
            </n-space>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="timeline-container" v-if="timelineEvents.length > 0">
        <div class="timeline-header">
          <h3>数据流时间轴</h3>
          <div class="timeline-controls">
            <n-button size="small" @click="toggleTimelineView">
              {{ isMultiAxis ? "单轴视图" : "多轴视图" }}
            </n-button>
            <n-button size="small" @click="clearTimeline">
              清空时间轴
            </n-button>
          </div>
        </div>

        <!-- Multi-Axis Timeline -->
        <div v-if="isMultiAxis" class="multi-axis-timeline">
          <div
            v-for="(stream, streamId) in streamTimelines"
            :key="streamId"
            class="stream-timeline"
          >
            <div class="stream-header">
              <div class="stream-info">
                <div
                  class="stream-color"
                  :style="{ backgroundColor: stream.color }"
                ></div>
                <span class="stream-name">{{
                  stream.name || `数据流 ${streamId}`
                }}</span>
                <span class="stream-count"
                  >({{ stream.events.length }} 事件)</span
                >
              </div>
              <div class="stream-status">
                <n-tag :type="getStreamStatusType(stream.status)" size="small">
                  {{ getStreamStatusText(stream.status) }}
                </n-tag>
              </div>
            </div>

            <div class="stream-track">
              <!-- Timeline Line -->
              <div class="timeline-line">
                <div class="timeline-progress"></div>
              </div>

              <!-- Stream Events -->
              <div
                v-for="(event, index) in stream.events"
                :key="index"
                class="timeline-event-marker"
                :style="getEventPosition(event.timestamp)"
                :class="event.type"
              >
                <div class="event-dot"></div>
                <div class="event-tooltip">
                  <div class="event-time">
                    {{ formatTime(event.timestamp) }}
                  </div>
                  <div class="event-message">{{ event.message }}</div>
                </div>
              </div>

              <!-- Current Time Indicator -->
              <div class="current-time-indicator">
                <div class="current-time-dot"></div>
                <div class="current-time-line"></div>
              </div>
            </div>
          </div>

          <!-- Global Timeline Labels -->
          <div class="global-timeline-labels">
            <div class="time-label">{{ formatTime(currentTime - 30000) }}</div>
            <div class="time-label">{{ formatTime(currentTime - 15000) }}</div>
            <div class="time-label current">{{ formatTime(currentTime) }}</div>
            <div class="time-label">{{ formatTime(currentTime + 15000) }}</div>
            <div class="time-label">{{ formatTime(currentTime + 30000) }}</div>
          </div>
        </div>

        <!-- Single Axis Timeline (Original) -->
        <div v-else class="dynamic-timeline">
          <!-- Timeline Track -->
          <div class="timeline-track">
            <!-- Moving Timeline Line -->
            <div class="timeline-line">
              <div class="timeline-progress"></div>
            </div>

            <!-- Timeline Events -->
            <div
              v-for="(event, index) in timelineEvents"
              :key="index"
              class="timeline-event-marker"
              :style="getEventPosition(event.timestamp)"
              :class="event.type"
            >
              <div class="event-dot"></div>
              <div class="event-tooltip">
                <div class="event-time">{{ formatTime(event.timestamp) }}</div>
                <div class="event-message">{{ event.message }}</div>
              </div>
            </div>

            <!-- Current Time Indicator -->
            <div class="current-time-indicator">
              <div class="current-time-dot"></div>
              <div class="current-time-line"></div>
            </div>
          </div>

          <!-- Timeline Labels -->
          <div class="timeline-labels">
            <div class="time-label">{{ formatTime(currentTime - 30000) }}</div>
            <div class="time-label">{{ formatTime(currentTime - 15000) }}</div>
            <div class="time-label current">{{ formatTime(currentTime) }}</div>
            <div class="time-label">{{ formatTime(currentTime + 15000) }}</div>
            <div class="time-label">{{ formatTime(currentTime + 30000) }}</div>
          </div>
        </div>

        <!-- Event List -->
        <div class="event-list">
          <div class="event-list-header">
            <h4>事件详情</h4>
            <n-select
              v-model:value="selectedStreamFilter"
              :options="streamFilterOptions"
              placeholder="筛选数据流"
              size="small"
              style="width: 150px"
            />
          </div>
          <div
            v-for="(event, index) in filteredEvents"
            :key="index"
            class="event-item"
            :class="event.type"
          >
            <div class="event-time">{{ formatTime(event.timestamp) }}</div>
            <div class="event-stream" v-if="isMultiAxis">
              <n-tag size="small" :color="getStreamColor(event.streamId)">
                {{ getStreamName(event.streamId) }}
              </n-tag>
            </div>
            <div class="event-content">
              <n-tag :type="getEventType(event.type)" size="small">
                {{ event.message }}
              </n-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Pipeline Visualization -->
      <div class="pipelines-container">
        <div
          v-for="(pipeline, index) in pipelines"
          :key="index"
          class="pipeline-wrapper"
        >
          <enhanced-pipeline
            :source="pipeline"
            :timeline-events="timelineEvents"
            @add-timeline-event="addTimelineEvent"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="pipelines.length === 0" class="empty-state">
        <n-empty description="等待数据流连接...">
          <template #icon>
            <div class="loading-animation">
              <div class="pulse"></div>
            </div>
          </template>
        </n-empty>
      </div>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { darkTheme } from "naive-ui";
import {
  CheckmarkCircleOutline,
  AlertCircleOutline,
  SyncOutline,
  PowerOutline,
  TimeOutline,
} from "@vicons/ionicons5";
import EnhancedPipeline from "./components/EnhancedPipeline.vue";

// Reactive data
const pipelines = ref([]);
const timelineEvents = ref([]);
const nodes = reactive({});
const currentTime = ref(Date.now());
const isMultiAxis = ref(false);
const streamTimelines = reactive({});
const selectedStreamFilter = ref(null);

// Legend items
const legendItems = [
  { status: -1, type: "error", label: "错误", icon: AlertCircleOutline },
  { status: 1, type: "info", label: "活跃", icon: SyncOutline },
  { status: 2, type: "warning", label: "取消", icon: PowerOutline },
  { status: 3, type: "success", label: "完成", icon: CheckmarkCircleOutline },
];

// Timeline functions
const addTimelineEvent = (event) => {
  const eventWithStream = {
    ...event,
    timestamp: Date.now(),
    streamId: event.nodeId || "default",
  };

  timelineEvents.value.unshift(eventWithStream);

  // Keep only last 50 events
  if (timelineEvents.value.length > 50) {
    timelineEvents.value = timelineEvents.value.slice(0, 50);
  }

  // Update stream timelines
  if (isMultiAxis.value) {
    updateStreamTimelines();
  }
};

const clearTimeline = () => {
  timelineEvents.value = [];
  Object.keys(streamTimelines).forEach((key) => delete streamTimelines[key]);
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const getEventType = (type) => {
  const typeMap = {
    next: "info",
    complete: "success",
    error: "error",
    subscribe: "warning",
  };
  return typeMap[type] || "default";
};

// Dynamic timeline functions
const getEventPosition = (timestamp) => {
  const timeDiff = currentTime.value - timestamp;
  const maxTime = 60000; // 60 seconds
  const position = Math.max(0, Math.min(100, (timeDiff / maxTime) * 100));
  return {
    left: `${position}%`,
  };
};

// Multi-axis timeline functions
const toggleTimelineView = () => {
  isMultiAxis.value = !isMultiAxis.value;
  if (isMultiAxis.value) {
    updateStreamTimelines();
  }
};

const updateStreamTimelines = () => {
  // Group events by stream
  const streamGroups = {};

  timelineEvents.value.forEach((event) => {
    const streamId = event.streamId || "default";
    if (!streamGroups[streamId]) {
      streamGroups[streamId] = {
        id: streamId,
        name: event.nodeId || `数据流 ${streamId}`,
        color: getStreamColorById(streamId),
        status: getStreamStatus(event),
        events: [],
      };
    }
    streamGroups[streamId].events.push(event);
  });

  // Update reactive object
  Object.keys(streamTimelines).forEach((key) => delete streamTimelines[key]);
  Object.assign(streamTimelines, streamGroups);
};

const getStreamColorById = (streamId) => {
  const colors = [
    "#8a2be2",
    "#00bfff",
    "#18a058",
    "#d03050",
    "#f0a020",
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
  ];
  return colors[streamId.charCodeAt(0) % colors.length];
};

const getStreamStatus = (event) => {
  if (event.type === "error") return -1;
  if (event.type === "complete") return 3;
  if (event.type === "warning") return 2;
  return 1;
};

const getStreamStatusType = (status) => {
  const statusMap = {
    "-1": "error",
    1: "info",
    2: "warning",
    3: "success",
  };
  return statusMap[status] || "default";
};

const getStreamStatusText = (status) => {
  const statusMap = {
    "-1": "错误",
    1: "活跃",
    2: "取消",
    3: "完成",
  };
  return statusMap[status] || "未知状态";
};

const getStreamColor = (streamId) => {
  return streamTimelines[streamId]?.color || "#8a2be2";
};

const getStreamName = (streamId) => {
  return streamTimelines[streamId]?.name || `数据流 ${streamId}`;
};

const streamFilterOptions = [
  { label: "所有数据流", value: null },
  { label: "活跃数据流", value: "info" },
  { label: "取消数据流", value: "warning" },
  { label: "完成数据流", value: "success" },
  { label: "错误数据流", value: "error" },
];

const filteredEvents = computed(() => {
  if (!selectedStreamFilter.value) {
    return timelineEvents.value;
  }
  return timelineEvents.value.filter(
    (event) => getEventType(event.type) === selectedStreamFilter.value
  );
});

// Update current time
let timeInterval;
onMounted(() => {
  // Update current time every 100ms
  timeInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 100);

  if (chrome.runtime) {
    const connect = () => {
      const port = chrome.runtime.connect({
        name: "" + chrome.devtools.inspectedWindow.tabId,
      });

      port.onDisconnect.addListener(() => {
        pipelines.value = [];
        Object.keys(nodes).forEach((key) => delete nodes[key]);
        setTimeout(connect, 1000);
      });

      port.onMessage.addListener(({ event, payload }) => {
        console.log("DevTools received message:", { event, payload });

        // 处理测试消息格式
        if (payload && payload.event && !event) {
          event = payload.event;
          payload = payload;
        }

        switch (event) {
          case "create":
            if (!nodes[payload.id]) {
              const ob = new Node(payload.name);
              nodes[payload.id] = ob;
            }
            break;
          case "next":
            if (nodes[payload.id]) {
              nodes[payload.id].next(payload.streamId, payload.data);
              addTimelineEvent({
                type: "next",
                message: `数据流: ${payload.data}`,
                nodeId: payload.id,
              });
            } else {
              // 如果没有找到节点，创建一个默认节点
              const ob = new Node(payload.nodeId || "unknown");
              nodes[payload.nodeId || "unknown"] = ob;
              ob.next(0, payload.data);
              addTimelineEvent({
                type: "next",
                message: `数据流: ${payload.data}`,
                nodeId: payload.nodeId || "unknown",
              });
            }
            break;
          case "complete":
            if (nodes[payload.id]) {
              nodes[payload.id].complete(payload.streamId, payload.err);
              addTimelineEvent({
                type: payload.err ? "error" : "complete",
                message: payload.err ? `错误: ${payload.err}` : "流完成",
                nodeId: payload.id,
              });
            }
            break;
          case "defer":
            if (nodes[payload.id]) {
              nodes[payload.id].defer(payload.streamId);
              addTimelineEvent({
                type: "warning",
                message: "流延迟",
                nodeId: payload.id,
              });
            }
            break;
          case "addSource":
            if (nodes[payload.id]) {
              nodes[payload.source.id].sinkNode = nodes[payload.id];
              nodes[payload.id].sources.push(nodes[payload.source.id]);
            }
            break;
          case "pipe":
            if (!nodes[payload.source.id]) {
              const ob = new Node(payload.source.name);
              nodes[payload.source.id] = ob;
            }
            const sink = new Node(payload.name);
            nodes[payload.id] = sink;
            sink.source = nodes[payload.source.id];
            nodes[payload.source.id].sinkNode = sink;
            break;
          case "update":
            if (nodes[payload.id]) {
              nodes[payload.id].name = payload.name;
            }
            break;
          case "subscribe":
            let node = nodes[payload.id];
            if (!node) break;
            if (!pipelines.value.includes(node)) {
              pipelines.value.unshift(node);
              addTimelineEvent({
                type: "subscribe",
                message: `订阅: ${node.name}`,
                nodeId: payload.id,
              });
            }
            const s = nodes[payload.sink?.nodeId] || node.sinkNode;
            node.subscribe(s && s.streams[payload.sink?.streamId]);
            break;
          case "test":
            // 处理测试消息
            addTimelineEvent({
              type: "info",
              message: `测试: ${payload.data}`,
              nodeId: "test",
            });
            break;
          default:
            console.log("Unknown event type:", event);
        }
      });
    };
    connect();
  }
});

// Cleanup interval on unmount
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});

// Node class (simplified version)
class Node {
  constructor(name = "") {
    this.name = name;
    this.streams = reactive([]);
    this.sources = reactive([]);
    this.source = null;
    this.sinkNode = null;
    this.color = undefined;
  }

  pickColor() {
    return this.color ?? "rgba(255,255,255,.5)";
  }

  toString() {
    return this.name;
  }

  ensureStream(index) {
    if (!this.streams[index]) {
      this.streams[index] = reactive({
        status: 1,
        label: "",
        color: this.pickColor(),
        sink: null,
      });
    }
    return this.streams[index];
  }

  next(index, data) {
    const stream = this.ensureStream(index);
    stream.label = data;
    this.color = stream.color;
  }

  complete(index, err) {
    const stream = this.ensureStream(index);
    if (err) stream.label = err;
    stream.status = err ? -1 : 3;
  }

  defer(index) {
    const stream = this.ensureStream(index);
    stream.status = 2;
  }

  subscribe(sinkStream) {
    this.streams = reactive([]);
    const stream = reactive({
      status: 1,
      label: "",
      color: this.pickColor(),
      sink: null,
    });

    if (!this.source) {
      stream.color = [
        "pink",
        "red",
        "orange",
        "blue",
        "green",
        "cyan",
        "purple",
      ][this.streams.length % 7];

      if (sinkStream) sinkStream.color = stream.color;
      while (sinkStream && sinkStream.sink) {
        sinkStream = sinkStream.sink;
        sinkStream.color = stream.color;
      }
    } else if (stream !== sinkStream && sinkStream) {
      stream.sink = sinkStream;
    }

    this.streams.push(stream);
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
}

.header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-section img {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 0 10px rgba(138, 43, 226, 0.5));
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #8a2be2, #00bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.legend-section {
  display: flex;
  align-items: center;
}

.timeline-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.timeline-header h3 {
  margin: 0;
  color: #8a2be2;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.multi-axis-timeline {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
}

.stream-timeline {
  position: relative;
  height: 60px;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stream-timeline:hover {
  border-color: rgba(138, 43, 226, 0.5);
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.2);
}

.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  height: 20px;
}

.stream-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stream-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.stream-name {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.stream-count {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
}

.stream-status {
  display: flex;
  align-items: center;
}

.stream-track {
  position: relative;
  height: 20px;
  margin-bottom: 0.5rem;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  transform: translateY(-50%);
}

.timeline-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #8a2be2, #00bfff);
  border-radius: 1px;
  animation: progress 2s linear infinite;
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
}

.timeline-event-marker {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

.timeline-event-marker:hover {
  z-index: 10;
}

.timeline-event-marker:hover .event-tooltip {
  opacity: 1;
  transform: translateY(-120%);
}

.event-dot {
  position: absolute;
  top: 50%;
  left: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.timeline-event-marker.next .event-dot {
  background: #18a058;
  animation: pulse 2s infinite;
}

.timeline-event-marker.complete .event-dot {
  background: #18a058;
}

.timeline-event-marker.error .event-dot {
  background: #d03050;
  animation: shake 0.5s ease-in-out;
}

.timeline-event-marker.subscribe .event-dot {
  background: #f0a020;
}

.timeline-event-marker.warning .event-dot {
  background: #f0a020;
}

.event-tooltip {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-120%);
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
  min-width: 150px;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  backdrop-filter: blur(10px);
}

.event-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.9);
}

.event-time {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
}

.event-message {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.current-time-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.current-time-dot {
  position: absolute;
  top: 50%;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(45deg, #8a2be2, #00bfff);
  transform: translate(50%, -50%);
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.8);
  animation: glow 2s ease-in-out infinite alternate;
}

.current-time-line {
  position: absolute;
  top: 50%;
  right: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8a2be2);
  transform: translateY(-50%);
}

.global-timeline-labels {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
}

.time-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.time-label.current {
  color: #8a2be2;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
}

.event-list {
  max-height: 150px;
  overflow-y: auto;
  margin-top: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
}

.event-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.event-list-header h4 {
  margin: 0;
  color: #8a2be2;
  font-size: 0.9rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  animation: slideIn 0.3s ease-out;
  transition: all 0.3s ease;
}

.event-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.event-item.next {
  border-left: 3px solid #18a058;
}

.event-item.complete {
  border-left: 3px solid #18a058;
}

.event-item.error {
  border-left: 3px solid #d03050;
}

.event-item.subscribe,
.event-item.warning {
  border-left: 3px solid #f0a020;
}

.pipelines-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.pipeline-wrapper {
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-animation {
  position: relative;
  width: 60px;
  height: 60px;
}

.pulse {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(45deg, #8a2be2, #00bfff);
  animation: pulse 2s infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.7;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }
  25% {
    transform: translate(-50%, -50%) translateX(-2px);
  }
  75% {
    transform: translate(-50%, -50%) translateX(2px);
  }
}

@keyframes glow {
  from {
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.8);
  }
  to {
    box-shadow: 0 0 30px rgba(138, 43, 226, 1);
  }
}

@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

/* Scrollbar styling */
.timeline::-webkit-scrollbar {
  width: 6px;
}

.timeline::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.timeline::-webkit-scrollbar-thumb {
  background: rgba(138, 43, 226, 0.5);
  border-radius: 3px;
}

.timeline::-webkit-scrollbar-thumb:hover {
  background: rgba(138, 43, 226, 0.7);
}
</style>
