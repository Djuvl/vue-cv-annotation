<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { AnnoType } from './Annotation.vue';
export type Painter = {
  get: () => { type: AnnoType; data: [number, number][][]; meta?: Record<string, any> };
  set: (type: AnnoType, data: [number, number][][], meta?: Record<string, any>) => void;
};

type Props = {
  scale: number;
  separable?: boolean;
  anno?: { type: AnnoType; data: [number, number][][] };
};

const props = withDefaults(defineProps<Props>(), {
  separable: true,
  anno: undefined,
});

let _data = ref<{
  type: AnnoType;
  data: [number, number][][];
  meta?: Record<string, any>;
} | null>(null);

const type = computed(() => _data.value?.type ?? props.anno?.type ?? 3);
let data = computed(() => _data.value?.data || props.anno?.data || reactive([[]]));
let meta = computed(() => _data.value?.meta);
const mousePosition = ref([0, 0]);

let activePoint: [number, number] | null = null;

const addPoint = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const length = data.value.length;
  const rect = svg.value!.getBoundingClientRect();
  const pt: [number, number] = reactive([
    (event.clientX - rect.x) / rect.width,
    (event.clientY - rect.y) / rect.height,
  ]);
  if (type.value === 2 && data.value[length - 1].length > 1) data.value[length - 1][1] = pt;
  else data.value[length - 1].push(pt);
  activePoint = pt;
};

const addPointNear = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const rect = svg.value!.getBoundingClientRect();
  const pt: [number, number] = reactive([
    (event.clientX - rect.x) / rect.width,
    (event.clientY - rect.y) / rect.height,
  ]);
  let minVal = [0, 0, Infinity];
  data.value.some((ptArr, gIdx) => {
    if (type.value === 2 && ptArr.length > 1) return;
    ptArr.some((v, i) => {
      const next = ptArr.length < i + 2 ? 0 : i + 1;
      const dis = pointToSegDist(pt, ptArr[i], ptArr[next]);
      // TODO: compare cos
      if (minVal[2] > dis) minVal = [gIdx, i + 1, dis];
    });
  });
  if (type.value < 2) {
    data.value[minVal[0]].push(pt);
    activePoint = pt;
    return;
  }
  if (type.value === 2 && data.value[minVal[0]].length > 1) return;
  data.value[minVal[0]].splice(minVal[1], 0, pt);
  activePoint = pt;
};

const addSeg = (event: MouseEvent) => {
  if (event.button !== 0 || !props.separable) return;
  const rect = svg.value!.getBoundingClientRect();
  const length = data.value.push([[(event.clientX - rect.x) / rect.width, (event.clientY - rect.y) / rect.height]]);
  activePoint = data.value[length - 1][0];
};

const getPoint = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const [a, b] = (event.target as HTMLElement).dataset.index!.split('|');
  activePoint = data.value[+a][+b];
};

const svg = ref<SVGGraphicsElement | null>(null);
const movePoint = (event: MouseEvent) => {
  const rect = svg.value!.getBoundingClientRect();
  const pt = { x: (event.clientX - rect.x) / rect.width, y: (event.clientY - rect.y) / rect.height };
  mousePosition.value = [pt.x, pt.y];
  if (activePoint) {
    activePoint[0] = pt.x;
    activePoint[1] = pt.y;
  }
};

const dropPoint = () => {
  activePoint = null;
};

const delPoint = (event: MouseEvent) => {
  const [gIdx, idx] = (event.target as HTMLElement).dataset.index!.split('|');
  data.value[+gIdx].splice(+idx, 1);
  if (data.value[+gIdx].length === 0 && data.value.length > 1) data.value.splice(+gIdx, 1);
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
  return { type: type.value, data: data.value.map((v) => v.map((v) => v.map((v) => v))), meta: meta.value };
};

const set = (t: 0 | 1 | 2 | 3, d: [number, number][][], m?: Record<string, any>) => {
  _data.value = {
    type: t,
    data: d.map((v) => v.map((v) => v.map((v) => v) as [number, number])),
    meta: m,
  };
};

defineExpose({ get, set });
</script>

<template lang="pug">
.absolute.w-full.h-full.top-0
  svg.h-full.w-full(
    ref="svg"
    viewBox="0 0 1 1"
    preserveAspectRatio='none'
    @mousedown.exact.stop="addPoint",
    @mousedown.shift.stop="addPointNear",
    @mousedown.ctrl.stop="addSeg",
    @mousemove.stop="movePoint"
    @mouseup.stop="dropPoint",
  )
    g
     line(x1="0", :y1="mousePosition[1]", x2="1", :y2="mousePosition[1]", :stroke-width="1 / scale", stroke="red", vector-effect="non-scaling-stroke")
     line(:x1="mousePosition[0]", y1="0", :x2="mousePosition[0]", y2="1",:stroke-width="1 / scale", stroke="red", vector-effect="non-scaling-stroke")
    path(
      v-if="type === 1",
      :d="data.map((v) => v.length ? `M${v.map((p) => `${p[0]},${p[1]}`).join('L')}` : '').join('')",
      :stroke-width="2 / scale",
      fill="none",
      stroke="white"
      vector-effect="non-scaling-stroke"
      stroke-linecap="round"
      stroke-linejoin="round"
    )
    template(v-else-if="type === 2")
      rect(
        v-for="rect in data.filter((v) => v.length > 1)",
        :x="Math.min(rect[0][0], rect[1][0])",
        :y="Math.min(rect[0][1], rect[1][1])",
        :width="Math.abs(rect[1][0] - rect[0][0])",
        :height="Math.abs(rect[1][1] - rect[0][1])",
        :stroke-width="2 / scale",
        fill="none",
        stroke="white"
        vector-effect="non-scaling-stroke"
      )
    path(
      v-else-if="type === 3",
      :d="data.map((v) => v.length ? `M${v.map((p) => `${p[0]},${p[1]}`).join('L')}z` : '').join('')",
      :stroke-width="1 / scale",
      fill="#512da8a6",
      stroke="white",
      fill-rule="evenodd"
      vector-effect="non-scaling-stroke"
      stroke-linejoin="round"
    )
    g(v-for="(grp, gIdx) in data")
      path(
        v-for="(pt, idx) in grp",
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        :data-index="`${gIdx}|${idx}`",
        :d="`M ${pt[0]} ${pt[1]} l 0.0001 0`"
        :stroke-width="9 / scale"
        :stroke="idx === 0 ? '#f008' : '#0008'"
        @mousedown.stop="getPoint",
        @click.alt.exact.stop="delPoint"
        @click.right.prevent.stop="delPoint"
      )
</template>
