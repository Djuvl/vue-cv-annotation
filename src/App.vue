<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld, { Item, Expose } from '../../anno-vite';
// import HelloWorld, { Item, Expose } from './components';

const test = ref<Expose | null>(null);
const mode = ref(1);
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
const init = () => {
  mode.value = 0;
  test.value?.set(2, [[]]);
};
const get = () => {
  console.log(test.value?.get());
};
</script>

<template>
  <button @click="get">get</button>
  <HelloWorld
    ref="test"
    class="h-96"
    src="https://t7.baidu.com/it/u=2701208059,2978966657&fm=193&f=GIF"
    :annos="annos"
    :mode="mode"
    @img-load="init"
  >
  </HelloWorld>
</template>
