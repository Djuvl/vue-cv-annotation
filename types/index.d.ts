/* eslint-disable @typescript-eslint/ban-types */
export declare type Expose = {
  reset: () => void;
  getPainter: () => Painter & Record<string, any>;
  setPainter: (p: Painter & Record<string, any>) => void;
};
export declare type Item = {
  id: number | string;
  title: string;
  type: 0 | 1 | 2 | 3;
  cat: number;
  outline: 0 | 1 | 2;
  data: [number, number][][];
};
export declare type Painter = {
  type: 0 | 1 | 2 | 3;
  data: [number, number][][];
};
declare const _sfc_main: import('vue').DefineComponent<
  {
    src: {
      type: StringConstructor;
      required: true;
    };
    mode: {
      type: NumberConstructor;
      required: false;
      default: number;
    };
    annos: {
      type: ArrayConstructor;
      required: false;
      default: () => never[];
    };
    maskColor: {
      type: StringConstructor;
      required: false;
      default: string;
    };
    scaleable: {
      type: BooleanConstructor;
      required: false;
      default: boolean;
    };
    separable: {
      type: BooleanConstructor;
      required: false;
      default: boolean;
    };
  },
  {
    props: {
      src: string;
      mode: number;
      annos: Item[];
      maskColor: string;
      scaleable: boolean;
      separable: boolean;
    };
    emit: {
      (e: 'img-load'): void;
      (e: 'anno-click', id: number | string): void;
    };
    img: import('vue').Ref<HTMLImageElement | null>;
    size: import('vue').Ref<[number, number]>;
    curAnno: import('vue').Ref<{
      id: number | string;
      title: string;
      type: 0 | 1 | 2 | 3;
      cat: number;
      outline: 0 | 1 | 2;
      data: [number, number][][];
    } | null>;
    viewTransfrom: {
      scale: number;
      tX: number;
      tY: number;
    };
    painter: {
      type: 0 | 1 | 2 | 3;
      data: [number, number][][];
    };
    boxAnnos: import('vue').ComputedRef<Item[]>;
    outlineAnnos: import('vue').ComputedRef<Item[]>;
    painterMeta: Record<string, any>;
    activePoint: null;
    code: string[];
    typeColors: string[];
    imgLoad: () => void;
    getColor: (seq?: number) => string;
    getBbox: (anno: Item) => {
      top: string;
      left: string;
      width: string;
      height: string;
    };
    setCurAnno: (annoId: string | number) => void;
    cancelCurAnno: (annoId: string | number) => void;
    viewScale: (event: WheelEvent) => void;
    addPoint: (event: MouseEvent) => void;
    addPointNear: (event: MouseEvent) => void;
    addSeg: (event: MouseEvent) => void;
    getPoint: (event: MouseEvent) => void;
    movePoint: (event: MouseEvent) => void;
    movePannel: (event: MouseEvent) => void;
    dropPoint: (event: MouseEvent) => void;
    delPoint: (event: MouseEvent) => void;
    pointToSegDist: (a: [number, number], b: [number, number], c: [number, number]) => number;
    setPainter: (p: Painter) => void;
    getPainter: () => {
      type: 0 | 1 | 2 | 3;
      data: number[][][];
    };
    reset: () => {
      scale: number;
      tX: number;
      tY: number;
    } & {
      scale: number;
      tX: number;
      tY: number;
    };
    computed: typeof computed;
    isReactive: typeof isReactive;
    reactive: typeof reactive;
    ref: typeof ref;
    toRaw: typeof toRaw;
    toRefs: typeof toRefs;
    unref: typeof unref;
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  ('img-load' | 'anno-click')[],
  'img-load' | 'anno-click',
  import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
  Readonly<
    {
      src?: unknown;
      mode?: unknown;
      annos?: unknown;
      maskColor?: unknown;
      scaleable?: unknown;
      separable?: unknown;
    } & {
      src: string;
      mode: number;
      annos: unknown[];
      maskColor: string;
      scaleable: boolean;
      separable: boolean;
    } & {}
  > & {
    'onImg-load'?: ((...args: any[]) => any) | undefined;
    'onAnno-click'?: ((...args: any[]) => any) | undefined;
  },
  {
    mode: number;
    annos: unknown[];
    maskColor: string;
    scaleable: boolean;
    separable: boolean;
  }
>;
export default _sfc_main;
