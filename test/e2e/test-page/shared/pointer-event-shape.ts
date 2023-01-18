import { MouseEventShape } from "./mouse-event-shape";

export interface PointerEventShape extends MouseEventShape{
    pointerId: number;
}

export const pointerEventShape: PointerEventShape = {
    button: 0,
    offsetX: 0,
    offsetY: 0,
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0,
    ctrlKey: false,
    cancelable: false,
    nativeCancelable: false,
    isTrusted: false,
    bubbles: false,
    eventPhase: 0,
    type: '',
    pointerId: 0
}

