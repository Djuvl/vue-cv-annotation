import type { Painter } from './AnnotationPainter.vue';
export declare type Mode = 0 | 1;
export declare type AnnoType = 0 | 1 | 2 | 3;
export declare type OutlineType = 0 | 1 | 2;
export declare type Expose = {
    reset: () => void;
} & Painter;
export declare type Item = {
    id: number | string;
    title: string;
    type: AnnoType;
    cat: number;
    outline: OutlineType;
    data: [number, number][][];
};
declare const _default: import("vue").DefineComponent<{
    src: {
        type: import("vue").PropType<string>;
        required: true;
    };
    mode: {
        type: import("vue").PropType<Mode>;
    } & {
        default: number;
    };
    annos: {
        type: import("vue").PropType<Item[]>;
    } & {
        default: () => never[];
    };
    anno: {
        type: import("vue").PropType<Item>;
    } & {
        default: undefined;
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
    uiScale: {
        type: import("vue").PropType<number>;
    } & {
        default: number;
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
        type: import("vue").PropType<Mode>;
    } & {
        default: number;
    };
    annos: {
        type: import("vue").PropType<Item[]>;
    } & {
        default: () => never[];
    };
    anno: {
        type: import("vue").PropType<Item>;
    } & {
        default: undefined;
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
    uiScale: {
        type: import("vue").PropType<number>;
    } & {
        default: number;
    };
}>> & {
    "onImg-load"?: (() => any) | undefined;
    "onAnno-click"?: ((id: string | number) => any) | undefined;
}, {
    mode: Mode;
    separable: boolean;
    anno: Item;
    annos: Item[];
    maskColor: string;
    scaleable: boolean;
    uiScale: number;
}>;
export default _default;
