import { MouseEventShape } from "./mouse-event-shape";
import { WheelEventShape } from "./wheel-event-shape";
import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { TransformationEvent } from "./transformation-event";
import { TouchEventShape } from "./touch-event-shape";
import { PointerEventShape } from "./pointer-event-shape";

export type KeysHavingPropertyOfType<T, TType> = {[K in keyof T]: T[K] extends TType ? K : never}[keyof T];
export type OnlyPropertiesOfType<T, TType> = {[L in KeysHavingPropertyOfType<T, TType>]: T[L]};
export type NotPropertiesOfType<T, TType> = {[L in {[K in keyof T]: T[K] extends TType ? never : K}[keyof T]]: T[L]};

export type MouseEventMap<TEventMap> = NotPropertiesOfType<OnlyPropertiesOfType<TEventMap, MouseEventShape>, WheelEventShape | PointerEventShape>;
export type PointerEventMap<TEventMap> = OnlyPropertiesOfType<TEventMap, PointerEventShape>;
export type TransformationEventMap = OnlyPropertiesOfType<InfiniteCanvasEventMap, TransformationEvent>;
export type TouchEventMap = OnlyPropertiesOfType<InfiniteCanvasEventMap, TouchEventShape>;