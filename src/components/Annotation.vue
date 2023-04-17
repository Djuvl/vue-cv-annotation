<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';
import AnnoPainter from './AnnotationPainter.vue';
import type { Painter } from './AnnotationPainter.vue';

export type Mode = 0 | 1;
export type AnnoType = 0 | 1 | 2 | 3;
export type OutlineType = 0 | 1 | 2;

export type Expose = { reset: () => void } & Painter;
export type Item = {
  id: number | string;
  title: string;
  type: AnnoType;
  cat: number;
  outline: OutlineType;
  data: [number, number][][];
};

type Props = {
  src: string;
  mode?: Mode;
  annos?: Item[];
  anno?: Item;
  maskColor?: string;
  scaleable?: boolean;
  separable?: boolean;
  uiScale?: number;
};

const props = withDefaults(defineProps<Props>(), {
  mode: 1,
  annos: () => [],
  anno: undefined,
  maskColor: '#0ff3',
  scaleable: true,
  separable: true,
  uiScale: 1,
});

const emit = defineEmits<{
  (e: 'img-load'): void;
  (e: 'anno-click', id: number | string): void;
}>();

const img = ref<HTMLImageElement | null>(null);
const curAnno = ref<Item | null>(null);
const painter = ref<Painter | null>(null);
const viewTransfrom = reactive({ scale: 1, tX: 0, tY: 0 });

const boxAnnos = computed(() => props.annos.filter((v) => v.type === 2));
const outlineAnnos = computed(() => props.annos.filter((v) => !!v.outline));

const code = ['4', 'a', '7', 'd'];
const typeColors: string[] = [];
for (var a of code) for (var b of code) for (var c of code) typeColors.push('#' + c + b + a);

const imgLoad = () => emit('img-load');
const getColor = (seq = 0) => {
  return props.mode ? typeColors[seq % 64] : props.maskColor;
};

const getBbox = (anno: Item) => {
  const xArray = anno.data.flat().map((v) => v[0]);
  const yArray = anno.data.flat().map((v) => v[1]);
  const xMin = Math.min(...xArray);
  const yMin = Math.min(...yArray);
  const width = Math.max(0, ...xArray) - xMin;
  const height = Math.max(0, ...yArray) - yMin;

  return {
    top: yMin * 100 + '%',
    left: xMin * 100 + '%',
    width: width * 100 + '%',
    height: height * 100 + '%',
  };
};

const setCurAnno = (annoId: string | number) => {
  curAnno.value = props.annos.find((v) => v.id === annoId)!;
};

const cancelCurAnno = (annoId: string | number) => {
  if (curAnno.value?.id === annoId) curAnno.value = null;
};

const viewScale = (event: WheelEvent) => {
  if (!props.scaleable) return;
  const [mouseX, mouseY] = [event.offsetX, event.offsetY];
  const scale = Math.min(5, Math.max(viewTransfrom.scale + event.deltaY / 1200, 1));
  let tX = viewTransfrom.tX + ((mouseX + viewTransfrom.tX) * (viewTransfrom.scale - scale)) / scale;
  let tY = viewTransfrom.tY + ((mouseY + viewTransfrom.tY) * (viewTransfrom.scale - scale)) / scale;
  if (scale === 1) [tX, tY] = [0, 0];
  Object.assign(viewTransfrom, { scale, tX, tY });
};

const movePannel = (event: MouseEvent) => {
  if (event.buttons == 2 && props.scaleable) {
    Object.assign(viewTransfrom, {
      scale: viewTransfrom.scale,
      tX: viewTransfrom.tX + event.movementX / viewTransfrom.scale,
      tY: viewTransfrom.tY + event.movementY / viewTransfrom.scale,
    });
  }
};

const reset = () => Object.assign(viewTransfrom, { scale: 1, tX: 0, tY: 0 });

const get = () => painter.value?.get();

const set: Painter['set'] = async (...args) => {
  if (!painter.value) await nextTick();
  painter.value?.set(...args);
};

defineExpose({
  reset,
  get,
  set,
});
</script>

<template lang="pug">
div(class="grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_minmax(0,_auto)_1fr] overflow-hidden")
  .row-start-2.col-start-2.origin-top-left(
    @mousewheel.stop.capture.prevent="viewScale",
    @mousemove.capture="movePannel",
    @contextmenu.prevent,
    :style="{ transform: `scale(${viewTransfrom.scale}) translate(${viewTransfrom.tX}px,${viewTransfrom.tY}px)` }"
    data-cy="root"
  )
    img.block.max-h-full.max-w-full(:src="src", ref="img", @load="imgLoad")
    .absolute.w-full.h-full.top-0
      svg.h-full.w-full(viewBox="0 0 1 1" preserveAspectRatio='none')
        template(v-for="anno in annos")
          g(
            v-if="anno.type === 0",
            @click="$emit('anno-click', anno.id)",
            @mouseenter="setCurAnno(anno.id)",
            @mouseout="cancelCurAnno(anno.id)"
          )
            path(
              v-for="pt in anno.data[0]",
              :d="`M ${pt[0]} ${pt[1]} l 0.0001 0`"
              :stroke="getColor(anno.cat)",
              :stroke-width="7 / viewTransfrom.scale * uiScale"
              vector-effect="non-scaling-stroke"
              stroke-linecap="round"
            )
          g(
            v-else-if="anno.type === 1",
            @click="emit('anno-click', anno.id)",
            @mouseenter="setCurAnno(anno.id)",
            @mouseout="cancelCurAnno(anno.id)"
          )
            polyline(
              v-for="line in anno.data",
              :points="line.reduce((str, v) => `${str} ${v[0]},${v[1]}`, '')",
              :stroke="getColor(anno.cat)",
              :stroke-width="2 / viewTransfrom.scale * uiScale",
              fill="none",
              style="pointer-events: stroke"
              vector-effect="non-scaling-stroke"
              stroke-linejoin="round"
              stroke-linecap="round"
            )
          path(
            v-else-if="anno.type === 2",
            vector-effect="non-scaling-stroke"
            :d="`M ${(anno.data[0][0][0] + anno.data[0][1][0]) / 2} ${(anno.data[0][0][1] + anno.data[0][1][1]) / 2} l 0.0001 0`"
            :stroke="getColor(anno.cat) + (mode ? '7' : '')",
            :stroke-width="16 / viewTransfrom.scale * uiScale"
            stroke-linecap="round"
            @click="$emit('anno-click', anno.id)",
            @mouseenter="setCurAnno(anno.id)",
            @mouseout="cancelCurAnno(anno.id)"
          )
          path(
            v-else,
            :d="anno.data.map((v) => `M${v.map((p) => `${p[0]},${p[1]}`).join('L')}z`).join('')",
            :fill="getColor(anno.cat) + (mode ? '5' : '')",
            :stroke-width="(mode ? 1 : 0) / viewTransfrom.scale * uiScale",
            stroke="white",
            fill-rule="evenodd",
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
            @click="$emit('anno-click', anno.id)",
            @mouseenter="setCurAnno(anno.id)",
            @mouseout="cancelCurAnno(anno.id)"
          )
    .absolute.w-full.h-full.top-0.pointer-events-none(v-if="!!mode" data-cy="outline")
      .absolute.box-content.text-base.text-white.border.border-solid.border-red-500.-m-px(
        v-for="anno in boxAnnos",
        :style="[getBbox(anno), { borderColor: getColor(anno.cat) }]"
      )
      .absolute.box-content.text-base.text-white.border.border-solid.border-red-500.-m-px(
        v-for="anno in outlineAnnos",
        :style="[getBbox(anno), { borderColor: getColor(anno.cat) + '6' }]"
      ) {{ anno.outline === 2 ? anno.title : '' }}
      div(v-if="curAnno", class="border-solid p-px bg-[#0003] border-2 border-red-500 m-[-3px] text-base text-white absolute box-content", :style="getBbox(curAnno)") {{ curAnno.title }}
    AnnoPainter(v-if="img && !mode", ref="painter", data-cy="painter", :anno="props.anno", :scale="viewTransfrom.scale / uiScale")
</template>
