<template>
  <div>
    <div class="subpipes">
      <slot></slot>
    </div>
    <div class="root">
      <div
        :style="streams.every((s) => s.status != 1) ? 'background:gray' : ''"
      >
        <!-- <div class="red"></div>
        <div class="yellow"></div>
        <div class="green"></div> -->
        <span>{{ ctx.toString() }}</span>
      </div>

      <div
        v-for="stream in streams"
        :key="stream"
        :style="`padding-left:5px;background:${
          stream.color
        };overflow:hidden;max-width:200px;${
          stream.status != 1 ? 'opacity:.5' : ''
        }`"
      >
        <a-tag
          @click="ctx.clickTag(stream)"
          :color="
            stream.status == -1
              ? 'error'
              : ['default', 'processing', 'warning', 'success'][
                  stream.status || 0
                ]
          "
        >
          <template #icon>
            <sync-outlined :spin="true" v-if="stream.status == 1" />
            <CheckSquareOutlined v-else-if="stream.status == 3" />
            <CloseCircleOutlined v-else-if="stream.status == -1" />
            <PoweroffOutlined v-else-if="stream.status == 2" />
            <ApiOutlined v-else />
          </template>
          {{ stream.label }}
        </a-tag>
      </div>
    </div>
  </div>
</template>
<script>
import Pipeline from "./pipeline.jsx";
export default {
  props: ["ctx", "streams"],
};
</script>
<style scoped>
.root {
  border-radius: 5px 5px 0 0;
  background: lightgray;
  border: 1px solid rgb(68, 68, 68);
  
  min-height: 60px;
}
.root > div:first-child {
  display: flex;
  background: black;
  border-radius: 5px 5px 0 0;
  color: white;
  font-size: 8px;
  padding: 7px;
}
.root > div:first-child > div {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 2px;
}
.red {
  background: indianred;
}
.yellow {
  background: gold;
}
.green {
  background: green;
}
</style>