export declare type Painter = {
    get: () => {
        type: 0 | 1 | 2 | 3;
        data: [number, number][][];
        meta?: Record<string, any>;
    };
    set: (type: 0 | 1 | 2 | 3, data: [number, number][][], meta?: Record<string, any>) => void;
};
declare const _default: import("vue").DefineComponent<{
    separable: {
        type: import("vue").PropType<boolean>;
    } & {
        default: boolean;
    };
    scale: {
        type: import("vue").PropType<number>;
        required: true;
    };
    ratio: {
        type: import("vue").PropType<number>;
        required: true;
    };
}, () => void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    separable: {
        type: import("vue").PropType<boolean>;
    } & {
        default: boolean;
    };
    scale: {
        type: import("vue").PropType<number>;
        required: true;
    };
    ratio: {
        type: import("vue").PropType<number>;
        required: true;
    };
}>>, {
    separable: boolean;
}>;
export default _default;
