<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { pipe,interval,take,subscribe,race } from "../../src/index";
function onClick(){
  window.onmessage = evt=>console.log(evt.data.payload);
  pipe(race(interval(1000),interval(2000)),take(3),subscribe(console.log))
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
