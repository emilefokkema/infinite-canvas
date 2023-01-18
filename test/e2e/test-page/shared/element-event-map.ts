import { MouseEventShape } from "./mouse-event-shape";
import { WheelEventShape } from "./wheel-event-shape";
import { PointerEventShape } from "./pointer-event-shape";

export interface ElementEventMap{
    mousedown: MouseEventShape;
    mousemove: MouseEventShape;
    mouseup: MouseEventShape;
    dragstart: MouseEventShape;
    pointerdown: PointerEventShape;
    pointermove: PointerEventShape;
    pointerenter: PointerEventShape;
    wheel: WheelEventShape;
    click: MouseEventShape;
}
