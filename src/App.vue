<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from 'vue';
import HelloWorld, { Item, Expose } from './components/Annotation.vue';
const test = ref<Expose | null>(null);
const annos = ref<Item[]>([
  {
    id: 1,
    type: 0,
    cat: 10,
    outline: 2,
    title: 'pt',
    data: [
      [
        [10, 10],
        [100, 100],
        [10, 100],
      ],
    ],
  },
]);
const get = () => {
  console.log(test.value);
};
</script>

<template>
  vue
  <button @click="get">get</button>
  <HelloWorld
    ref="test"
    class="anno"
    src="https://t7.baidu.com/it/u=2701208059,2978966657&fm=193&f=GIF"
    :annos="annos"
    :mode="0"
  />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
.anno {
  height: 400px;
}
</style>
