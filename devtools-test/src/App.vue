<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { pipe,interval,take,subscribe } from "../../src/index";
function onClick(){
  window.onmessage = evt=>console.log(evt.data.payload);
  pipe(interval(1000),take(100),subscribe(console.log))
}

</script>

<template>
  <img alt="Rx logo" src="./assets/Rx_Logo_S.png" @click="onClick"/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
