<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
type Props = {
  src: string;
  mode?: number;
  annos?: Item[];
  maskColor?: string;
  scaleable?: boolean;
  separable?: boolean;
};

export type Expose = {
  reset: () => void;
  getPainter: () => Painter & Record<string, any>;
  setPainter: (p: Painter & Record<string, any>) => void;
};

export type Item = {
  id: number | string;
  title: string;
  type: 0 | 1 | 2 | 3;
  cat: number;
  outline: 0 | 1 | 2;
  data: [number, number][][];
};

export type Painter = {
  type: 0 | 1 | 2 | 3;
  data: [number, number][][];
};

const props = withDefaults(defineProps<Props>(), {
  mode: 1,
  annos: () => [],
  maskColor: '#0ff3',
  scaleable: true,
  separable: true,
});

const emit = defineEmits<{
  (e: 'img-load'): void;
  (e: 'anno-click', id: number | string): void;
}>();

const img = ref<HTMLImageElement | null>(null);
const size = ref<[number, number]>([100, 100]);
const curAnno = ref<Item | null>(null);
const viewTransfrom = reactive({ scale: 1, tX: 0, tY: 0 });
let painter = reactive<Painter>({
  type: 3,
  data: reactive([[]]),
});

const boxAnnos = computed(() => props.annos.filter((v) => v.type === 2));
const outlineAnnos = computed(() => props.annos.filter((v) => !!v.outline));

let painterMeta: Record<string, any> = {};
let activePoint: [number, number] | null = null;
const code = ['4', 'a', '7', 'd'];
const typeColors: string[] = [];
for (var a of code) for (var b of code) for (var c of code) typeColors.push('#' + c + b + a);

const imgLoad = () => {
  size.value = [img.value!.naturalWidth, img.value!.naturalHeight];
  emit('img-load');
};

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
    top: (yMin * 100) / size.value[1] + '%',
    left: (xMin * 100) / size.value[0] + '%',
    width: (width * 100) / size.value[0] + '%',
    height: (height * 100) / size.value[1] + '%',
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
const addPoint = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const length = painter.data.length;
  const pt: [number, number] = [event.offsetX, event.offsetY];
  painter.data[length - 1].push(pt);
  activePoint = pt;
};
const addPointNear = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const pt: [number, number] = [event.offsetX, event.offsetY];
  let minVal = [0, 0, Infinity];
  painter.data.some((ptArr, gIdx) => {
    if (painter.type === 2 && ptArr.length > 1) return;
    ptArr.some((v, i) => {
      const next = ptArr.length < i + 2 ? 0 : i + 1;
      const dis = pointToSegDist(pt, ptArr[i], ptArr[next]);
      // TODO: compare cos
      if (minVal[2] > dis) minVal = [gIdx, i + 1, dis];
    });
  });
  if (painter.type < 2) {
    painter.data[minVal[0]].push(pt);
    activePoint = pt;
    return;
  }
  if (painter.type === 2 && painter.data[minVal[0]].length > 1) return;
  painter.data[minVal[0]].splice(minVal[1], 0, pt);
  activePoint = pt;
};
const addSeg = (event: MouseEvent) => {
  if (event.button !== 0 || !props.separable) return;
  const mX = event.offsetX;
  const mY = event.offsetY;
  const length = painter.data.push([[mX, mY]]);
  activePoint = painter.data[length - 1][0];
};
const getPoint = (event: MouseEvent) => {
  if (event.button !== 0) return;
  const [a, b] = (event.target as HTMLElement).dataset.index!.split('|');
  activePoint = painter.data[+a][+b];
};
const movePoint = (event: MouseEvent) => {
  if (activePoint) {
    activePoint[0] = event.offsetX;
    activePoint[1] = event.offsetY;
  }
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
const dropPoint = (event: MouseEvent) => {
  if (event.button === 0) activePoint = null;
  else if (event.button === 2) delPoint(event);
};
const delPoint = (event: MouseEvent) => {
  const [gIdx, idx] = (event.target as HTMLElement).dataset.index!.split('|');
  painter.data[+gIdx].splice(+idx, 1);
  if (painter.data[+gIdx].length === 0) painter.data.splice(+gIdx, 1);
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

const setPainter = (p: Painter) => {
  const ratio = img.value!.width / img.value!.naturalWidth;
  painter.type = p.type;
  (painter.data = p.data.map((v) => v.map((v) => v.map((v) => v * ratio) as [number, number]))),
    (painterMeta = { ...p });
};
const getPainter = () => {
  const ratio = img.value!.naturalWidth / img.value!.width;
  const data = painter.data.map((v) => v.map((v) => v.map((v) => v * ratio)));
  return { ...painterMeta, type: painter.type, data };
};
const reset = () => Object.assign(viewTransfrom, { scale: 1, tX: 0, tY: 0 });

defineExpose({
  reset,
  getPainter,
  setPainter,
});
</script>

<template lang="pug">
.root
  .container(
    @mousewheel.stop.capture.prevent="viewScale",
    @mousemove.capture="movePannel",
    @contextmenu.prevent,
    :style="{ transform: `scale(${viewTransfrom.scale}) translate(${viewTransfrom.tX}px,${viewTransfrom.tY}px)` }"
  )
    img(:src="src", ref="img", @load="imgLoad")
    .mask-panel
      svg(:viewBox="`0 0 ${size[0]} ${size[1]}`")
        template(v-for="anno in annos")
          g(
            v-if="anno.type === 0",
            @click="$emit('anno-click', anno.id)",
            @mouseenter="setCurAnno(anno.id)",
            @mouseout="cancelCurAnno(anno.id)"
          )
            circle(
              v-for="pt in anno.data[0]",
              :cx="pt[0]",
              :cy="pt[1]",
              :fill="getColor(anno.cat)",
              :r="7 / viewTransfrom.scale"
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
              :stroke-width="5 / viewTransfrom.scale",
              fill="none",
              style="pointer-events: stroke"
            )
          circle(
            v-else-if="anno.type === 2",
            :cx="anno.data[0][0][0] / 2 + anno.data[0][1][0] / 2",
            :cy="anno.data[0][0][1] / 2 + anno.data[0][1][1] / 2",
            :fill="getColor(anno.cat) + (mode ? '7' : '')",
            :r="Math.min(15, (anno.data[0][1][0] - anno.data[0][0][0]) / 2, (anno.data[0][1][1] - anno.data[0][0][1]) / 2)",
            @click="$emit('anno-click', anno.id)",
            @mouseenter="setCurAnno(anno.id)",
            @mouseout="cancelCurAnno(anno.id)"
          )
          path(
            v-else,
            :d="anno.data.map((v) => `M${v.map((p) => `${p[0]},${p[1]}`).join('L')}z`).join('')",
            :fill="getColor(anno.cat) + (mode ? '5' : '')",
            :stroke-width="(mode ? 2 : 0) / viewTransfrom.scale",
            stroke="white",
            fill-rule="evenodd",
            @click="$emit('anno-click', anno.id)",
            @mouseenter="setCurAnno(anno.id)",
            @mouseout="cancelCurAnno(anno.id)"
          )
    .mask-panel.ignore(v-if="!!mode")
      .crop-box(
        v-for="anno in boxAnnos",
        :style="[getBbox(anno), { borderColor: getColor(anno.cat) }]"
      )
      .crop-box(
        v-for="anno in outlineAnnos",
        :style="[getBbox(anno), { borderColor: getColor(anno.cat) + '6' }]"
      ) {{ anno.outline === 2 ? anno.title : '' }}
      .crop-box.main(v-if="curAnno", :style="getBbox(curAnno)") {{ curAnno.title }}
    .mask-panel(v-if="!mode")
      svg.painter(
        @mousedown.exact.stop="addPoint",
        @mousedown.shift.stop="addPointNear",
        @mousedown.ctrl.stop="addSeg",
        @mousemove.stop="movePoint"
      )
        path(
          v-if="painter.type === 1",
          :d="painter.data.map((v) => v.length ? `M${v.map((p) => `${p[0]},${p[1]}`).join('L')}` : '').join('')",
          :stroke-width="1 / viewTransfrom.scale",
          fill="none",
          stroke="white"
        )
        template(v-else-if="painter.type === 2")
          rect(
            v-for="rect in painter.data.filter((v) => v.length > 1)",
            :x="rect[0][0]",
            :y="rect[0][1]",
            :width="rect[1][0] - rect[0][0]",
            :height="rect[1][1] - rect[0][1]",
            :stroke-width="1 / viewTransfrom.scale",
            fill="none",
            stroke="white"
          )
        path(
          v-else-if="painter.type === 3",
          :d="painter.data.map((v) => v.length ? `M${v.map((p) => `${p[0]},${p[1]}`).join('L')}z` : '').join('')",
          :stroke-width="1 / viewTransfrom.scale",
          fill="#512da8a6",
          stroke="white",
          fill-rule="evenodd"
        )
        g(v-for="(grp, gIdx) in painter.data")
          circle(
            v-for="(pt, idx) in grp",
            :data-index="`${gIdx}|${idx}`",
            :cx="pt[0]",
            :cy="pt[1]",
            :fill="idx === 0 ? '#f008' : '#0008'",
            :r="5 / viewTransfrom.scale",
            @mousedown.stop="getPoint",
            @mouseup.stop="dropPoint",
            @click.alt.exact.stop="delPoint"
          )
</template>

<style scoped>
.root {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 1fr minmax(0, auto) 1fr;
  overflow: hidden;
}
.container {
  grid-area: 2/2/3/3;
  transform-origin: 0 0;
}
.container > img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
.mask-panel {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
.mask-panel.ignore {
  pointer-events: none;
}
.mask-panel.ignore .crop-box {
  position: absolute;
  border: 1px #f00 solid;
  margin: -1px;
  box-sizing: content-box;
  color: #fff;
  font-size: 12px;
}
.mask-panel.ignore .main {
  border: 2px #f00 solid;
  padding: 1px;
  margin: -3px;
  background-color: #0003;
}
.mask-panel svg {
  width: 100%;
  height: 100%;
}
</style>
