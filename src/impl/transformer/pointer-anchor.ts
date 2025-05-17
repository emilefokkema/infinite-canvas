import { Anchor } from "./anchor";

export interface PointerAnchor{
    readonly anchor: Anchor;
    readonly defaultPrevented: boolean;
    readonly touchId: number;
    readonly pointerId: number;
    readonly pointerEvent: PointerEvent;
    preventDefault(): void;
    setTouchId(touchId: number): void;
    updatePointerEvent(ev: PointerEvent): void;
}