import { AnnoType } from './Annotation.vue';
export declare type Painter = {
    get: () => {
        type: AnnoType;
        data: [number, number][][];
        meta?: Record<string, any>;
    };
    set: (type: AnnoType, data: [number, number][][], meta?: Record<string, any>) => void;
};
declare const _default: import("vue").DefineComponent<{
    scale: {
        type: import("vue").PropType<number>;
        required: true;
    };
    separable: {
        type: import("vue").PropType<boolean>;
    } & {
        default: boolean;
    };
    anno: {
        type: import("vue").PropType<{
            type: AnnoType;
            data: [number, number][][];
        }>;
    } & {
        default: undefined;
    };
}, () => void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    scale: {
        type: import("vue").PropType<number>;
        required: true;
    };
    separable: {
        type: import("vue").PropType<boolean>;
    } & {
        default: boolean;
    };
    anno: {
        type: import("vue").PropType<{
            type: AnnoType;
            data: [number, number][][];
        }>;
    } & {
        default: undefined;
    };
}>>, {
    separable: boolean;
    anno: {
        type: AnnoType;
        data: [number, number][][];
    };
}>;
export default _default;
