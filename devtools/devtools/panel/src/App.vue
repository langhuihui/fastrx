<template>
  <div class="app">
    <div class="head">
      <img src="./assets/Rx_Logo_S.png" />
      <div>
        <div class="title">FastRx 可视化面板</div>
        <div class="sub-title">Animated Panel for Rx Observables</div>
      </div>
      <div style="float: right">
        <span style="color: white">图例：</span>
        <a-tag
          :key="item"
          v-for="item in sample"
          :color="
            item.status == -1
              ? 'error'
              : ['default', 'processing', 'warning', 'success'][
                  item.status || 0
                ]
          "
        >
          <template #icon>
            <sync-outlined :spin="true" v-if="item.status == 1" />
            <CheckSquareOutlined v-else-if="item.status == 3" />
            <CloseCircleOutlined v-else-if="item.status == -1" />
            <PoweroffOutlined v-else-if="item.status == 2" />
            <ApiOutlined v-else />
          </template>
          {{ item.label }}
        </a-tag>
      </div>
    </div>

    <div class="pipeline" v-for="pipe in pipelines" :key="pipe">
      <pipeline :source="pipe"> </pipeline>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import pipeline from "./components/pipeline.jsx";
import { Node } from "./components/node";
export default {
  components: { pipeline },
  setup() {
    let nodes = {};
    const pipelines = reactive([]);
    const sample = [
      {
        status: -1,
        label: "error",
      },
      {
        status: 1,
        label: "alive",
      },
      {
        status: 2,
        label: "cancel",
      },
      {
        status: 3,
        label: "complete",
      },
    ];
    if (chrome.runtime) {
      const connect = () => {
        const port = chrome.runtime.connect({
          name: "" + chrome.devtools.inspectedWindow.tabId,
        });
        document.body.style.backgroundColor = "lightgray";
        port.onDisconnect.addListener(() => {
          pipelines.length = 0;
          nodes = {};
          setTimeout(connect, 0);
          document.body.style.backgroundColor = "gray";
        });
        port.onMessage.addListener(({ event, payload }) => {
          switch (event) {
            case "create":
              if (!nodes[payload.id]) {
                const ob = new Node(payload.name);
                nodes[payload.id] = ob;
              }
              break;
            case "next":
              if (nodes[payload.id])
                nodes[payload.id].next(payload.streamId, payload.data);
              break;
            case "complete":
              if (nodes[payload.id])
                nodes[payload.id].complete(payload.streamId, payload.err);
              break;
            case "defer":
              if (nodes[payload.id]) nodes[payload.id].defer(payload.streamId);
              break;
            case "addSource":
              if (nodes[payload.id]) {
                // const ob = new Node(payload.source.name);
                // nodes[payload.source.id] = ob;
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
              break;
            case "update":
              if (nodes[payload.id]) {
                nodes[payload.id].name = payload.name;
              }
              break;
            case "subscribe":
              let node = nodes[payload.id];
              if (!node) break;
              if (payload.end) {
                pipelines.unshift(node);

                // const pipeline = [node];
                // while (node.source) {
                //   pipeline.unshift(node.source);
                //   node = node.source;
                // }
                // pipelines.push(pipeline);
              }
              node.subscribe(
                nodes[payload.sink.nodeId] &&
                  nodes[payload.sink.nodeId].streams[payload.sink.streamId]
              );
          }
        });
      };
      connect();
    }

    return {
      pipelines,
      sample,
    };
  },
};

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
body {
  background: rgba (0, 0, 0, 0.66);
}
.app {
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;
}
.head {
  background: black;
  height: 60px;
  width: 100%;
  padding: 10px;
}
.head > div {
  display: inline-block;
}
.head img {
  width: 35px;
  height: 35px;
  vertical-align: super;
  margin-right: 10px;
}
.input {
  display: flex;
  width: 80%;
  justify-content: stretch;
}
.title {
  color: violet;
  font-size: 18px;
  font-weight: bold;
}
.sub-title {
  color: white;
  font-size: 12px;
}

.components {
  margin-top: 10px;
}

.pipeline {
  text-align: center;
  margin: 30px;
  width: 100vw;
  overflow: auto;
  filter: drop-shadow(2px 4px 6px black);
  display: flex;
  place-items: flex-end;
}
.pipeline span.arrow,
.subpipe .before,
.subpipe .after {
  font-size: 40px;
  color: white;
}
span.arrow.disable {
  color: rgb(167, 167, 167);
}
.subpipes {
  display: flex;
}
.subpipe {
  position: relative;
  display: flex;
  margin: 5px;
  align-items: flex-end;
  margin-bottom: 35px;
}
.subpipe .before {
  content: "↑";
  position: absolute;
  bottom: -45px;
  left: 10px;
}
.subpipe .after {
  content: "↓";
  position: absolute;
  bottom: -45px;
  right: 10px;
}
</style>