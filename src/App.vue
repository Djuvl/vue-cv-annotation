<script setup lang="ts">
import { ref } from 'vue';
// import HelloWorld, { Item, Expose } from '../../anno-vite';
import HelloWorld, { Item, Expose, AnnoType, OutlineType, Mode } from './components';

const test = ref<Expose | null>(null);
const mode = ref<Mode>(1);
const annos = ref<Item[]>([
  {
    id: 1,
    type: 3,
    cat: 10,
    outline: 1,
    title: 'pt',
    data: [
      [
        [0.1, 0.1],
        [0.3, 0.3],
        [0.1, 0.3],
      ],
    ],
  },
]);
const init = () => {
  mode.value = 0;
  // test.value?.set(1, [[]]);
};

const get = () => {
  console.log(test.value?.get());
};
function setPaint(id: any) {
  const anno = annos.value.find((v) => v.id === id);
  mode.value = 0;
  test.value?.set(anno!.type, anno!.data);
}
</script>

<template>
  <button @click="get">get</button>
  <HelloWorld
    ref="test"
    class="h-96"
    src="https://t7.baidu.com/it/u=2701208059,2978966657&fm=193&f=GIF"
    :annos="annos"
    :anno="annos[0]"
    :mode="mode"
    @img-load="init"
    @anno-click="setPaint"
  >
  </HelloWorld>
</template>
