<template>
  <template v-if="source.source">
    <pipeline :source="source.source"></pipeline>
    <span class="arrow" :style="'color:white' + ';opacity:' + (source.source.cdSub)"
      >←</span
    >
    :
    <span class="arrow" :style="'color:' + source.pickColor() + ';opacity:' + (source.source.cdData)"
      >→</span
    >
  </template>
  <observable :ctx="source" :streams="source.streams">
    <template v-for="ss in s.sources" :key="ss">
      <div class="subpipe">
        <pipeline :source="ss"></pipeline>
        <div class="after" :style="'color:white' + ';opacity:' + ss.cdSub">
          ↑
        </div>
        <div
          class="after"
          :style="'color:' + ss.pickColor() + ';opacity:' + ss.cdData"
        >
          ↓
        </div>
      </div>
    </template>
  </observable>
</template>
<script>
export default {
  name: "pipeline",
  props: ["source"],
};
</script>