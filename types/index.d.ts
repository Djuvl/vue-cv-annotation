/* eslint-disable @typescript-eslint/ban-types */
export type Item = {
  id: number | string;
  title: string;
  type: 0 | 1 | 2 | 3;
  cat: number;
  outline: 0 | 1 | 2;
  data: [number, number][][];
};
export type Expose = {
  reset: () => void;
  get: () => { type: 0 | 1 | 2 | 3; data: [number, number][][]; meta?: Record<string, any> };
  set: (type: 0 | 1 | 2 | 3, data: [number, number][][], meta?: Record<string, any>) => void;
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
