<script setup lang="ts">
import { reactive, ref } from 'vue';
export type Painter = {
  get: () => { type: 0 | 1 | 2 | 3; data: [number, number][][]; meta?: Record<string, any> };
  set: (type: 0 | 1 | 2 | 3, data: [number, number][][], meta?: Record<string, any>) => void;
};

type Props = {
  separable?: boolean;
  scale: number;
  ratio: number;
};

const props = withDefaults(defineProps<Props>(), {
  separable: true,
});

const type = ref<0 | 1 | 2 | 3>(3);
let data: [number, number][][] = reactive([[]]);
let meta: Record<string, any> | undefined = undefined;
const mousePosition = ref([0, 0]);

let activePoint: [number, number] | null = null;

const addPoint = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const length = data.length;
  const pt: [number, number] = reactive([event.offsetX, event.offsetY]);
  if (type.value === 2 && data[length - 1].length > 1) data[length - 1][1] = pt;
  else data[length - 1].push(pt);
  activePoint = pt;
};

const addPointNear = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const pt: [number, number] = reactive([event.offsetX, event.offsetY]);
  let minVal = [0, 0, Infinity];
  data.some((ptArr, gIdx) => {
    if (type.value === 2 && ptArr.length > 1) return;
    ptArr.some((v, i) => {
      const next = ptArr.length < i + 2 ? 0 : i + 1;
      const dis = pointToSegDist(pt, ptArr[i], ptArr[next]);
      // TODO: compare cos
      if (minVal[2] > dis) minVal = [gIdx, i + 1, dis];
    });
  });
  if (type.value < 2) {
    data[minVal[0]].push(pt);
    activePoint = pt;
    return;
  }
  if (type.value === 2 && data[minVal[0]].length > 1) return;
  data[minVal[0]].splice(minVal[1], 0, pt);
  activePoint = pt;
};

const addSeg = (event: MouseEvent) => {
  if (event.button !== 0 || !props.separable) return;
  const mX = event.offsetX;
  const mY = event.offsetY;
  const length = data.push([[mX, mY]]);
  activePoint = data[length - 1][0];
};

const getPoint = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const [a, b] = (event.target as HTMLElement).dataset.index!.split('|');
  activePoint = data[+a][+b];
};

const movePoint = (event: MouseEvent) => {
  mousePosition.value = [event.offsetX, event.offsetY];
  if (activePoint) {
    activePoint[0] = event.offsetX;
    activePoint[1] = event.offsetY;
  }
};

const dropPoint = () => {
  activePoint = null;
};

const delPoint = (event: MouseEvent) => {
  const [gIdx, idx] = (event.target as HTMLElement).dataset.index!.split('|');
  data[+gIdx].splice(+idx, 1);
  if (data[+gIdx].length === 0 && data.length > 1) data.splice(+gIdx, 1);
};

const pointToSegDist: (a: [number, number], b: [number, number], c: [number, number]) => number = (
  [x, y],
  [x0, y0],
  [x1, y1]
) => {
  const cross = (x1 - x0) * (x - x0) + (y1 - y0) * (y - y0);
  if (cross <= 0) return (x - x0) * (x - x0) + (y - y0) * (y - y0);
  const d2 = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
  if (cross >= d2) return (x - x1) * (x - x1) + (y - y1) * (y - y1);
  const r = cross / d2;
  const px = x0 + (x1 - x0) * r;
  const py = y0 + (y1 - y0) * r;
  return (x - px) * (x - px) + (py - y) * (py - y);
};

const get = () => {
  return { type: type.value, data: data.map((v) => v.map((v) => v.map((v) => v * props.ratio))), meta: meta };
};

const set = (t: 0 | 1 | 2 | 3, d: [number, number][][], m?: Record<string, any>) => {
  type.value = t;
  data.splice(0, data.length, ...d.map((v) => v.map((v) => v.map((v) => v * props.ratio) as [number, number])));
  meta = m;
};

defineExpose({ get, set });
</script>

<template lang="pug">
.absolute.w-full.h-full.top-0
  svg.h-full.w-full(
    @mousedown.exact.stop="addPoint",
    @mousedown.shift.stop="addPointNear",
    @mousedown.ctrl.stop="addSeg",
    @mousemove.stop="movePoint"
    @mouseup.stop="dropPoint",
  )
    g
     line(x1="0", :y1="mousePosition[1]", x2="100%", :y2="mousePosition[1]", :stroke-width="1 / scale", stroke="red")
     line(:x1="mousePosition[0]", y1="0", :x2="mousePosition[0]", y2="100%",:stroke-width="1 / scale", stroke="red")
    path(
      v-if="type === 1",
      :d="data.map((v) => v.length ? `M${v.map((p) => `${p[0]},${p[1]}`).join('L')}` : '').join('')",
      :stroke-width="1 / scale",
      fill="none",
      stroke="white"
    )
    template(v-else-if="type === 2")
      rect(
        v-for="rect in data.filter((v) => v.length > 1)",
        :x="Math.min(rect[0][0], rect[1][0])",
        :y="Math.min(rect[0][1], rect[1][1])",
        :width="Math.abs(rect[1][0] - rect[0][0])",
        :height="Math.abs(rect[1][1] - rect[0][1])",
        :stroke-width="1 / scale",
        fill="none",
        stroke="white"
      )
    path(
      v-else-if="type === 3",
      :d="data.map((v) => v.length ? `M${v.map((p) => `${p[0]},${p[1]}`).join('L')}z` : '').join('')",
      :stroke-width="1 / scale",
      fill="#512da8a6",
      stroke="white",
      fill-rule="evenodd"
    )
    g(v-for="(grp, gIdx) in data")
      circle(
        v-for="(pt, idx) in grp",
        :data-index="`${gIdx}|${idx}`",
        :cx="pt[0]",
        :cy="pt[1]",
        :fill="idx === 0 ? '#f008' : '#0008'",
        :r="5 / scale",
        @mousedown.stop="getPoint",
        @click.alt.exact.stop="delPoint"
        @click.right.prevent.stop="delPoint"
      )
</template>
