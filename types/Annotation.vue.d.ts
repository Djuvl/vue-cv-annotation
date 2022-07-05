import type { Painter } from './AnnotationPainter.vue';
export declare type Expose = {
    reset: () => void;
} & Painter;
export declare type Item = {
    id: number | string;
    title: string;
    type: 0 | 1 | 2 | 3;
    cat: number;
    outline: 0 | 1 | 2;
    data: [number, number][][];
};
declare const _default: import("vue").DefineComponent<{
    src: {
        type: import("vue").PropType<string>;
        required: true;
    };
    mode: {
        type: import("vue").PropType<number>;
    } & {
        default: number;
    };
    annos: {
        type: import("vue").PropType<Item[]>;
    } & {
        default: () => never[];
    };
    maskColor: {
        type: import("vue").PropType<string>;
    } & {
        default: string;
    };
    scaleable: {
        type: import("vue").PropType<boolean>;
    } & {
        default: boolean;
    };
    separable: {
        type: import("vue").PropType<boolean>;
    } & {
        default: boolean;
    };
}, () => void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "img-load": () => void;
} & {
    "anno-click": (id: string | number) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    src: {
        type: import("vue").PropType<string>;
        required: true;
    };
    mode: {
        type: import("vue").PropType<number>;
    } & {
        default: number;
    };
    annos: {
        type: import("vue").PropType<Item[]>;
    } & {
        default: () => never[];
    };
    maskColor: {
        type: import("vue").PropType<string>;
    } & {
        default: string;
    };
    scaleable: {
        type: import("vue").PropType<boolean>;
    } & {
        default: boolean;
    };
    separable: {
        type: import("vue").PropType<boolean>;
    } & {
        default: boolean;
    };
}>> & {
    "onImg-load"?: (() => any) | undefined;
    "onAnno-click"?: ((id: string | number) => any) | undefined;
}, {
    mode: number;
    separable: boolean;
    annos: Item[];
    maskColor: string;
    scaleable: boolean;
}>;
export default _default;
