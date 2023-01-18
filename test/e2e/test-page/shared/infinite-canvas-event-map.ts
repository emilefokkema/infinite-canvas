import { DrawEvent } from "./draw-event";
import { TransformationEvent } from "./transformation-event";
import { TouchEventShape } from "./touch-event-shape";
import { ElementEventMap } from './element-event-map';

interface ShapeEventMap extends ElementEventMap{
    draw: DrawEvent;
    transformationstart: TransformationEvent;
    transformationchange: TransformationEvent;
    transformationend: TransformationEvent;
    wheelignored: {},
    touchstart: TouchEventShape;
    touchmove: TouchEventShape;
    touchend: TouchEventShape;
}

type OtherGlobalEventsShapeMap = {[K in Exclude<keyof HTMLElementEventMap, keyof ShapeEventMap>]: {}};

export type InfiniteCanvasEventMap = ShapeEventMap & OtherGlobalEventsShapeMap