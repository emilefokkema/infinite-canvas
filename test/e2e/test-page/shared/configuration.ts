import { Units } from "./units";

export interface InfiniteCanvasE2EInitialization{
    styleWidth: string;
    styleHeight: string;
    canvasWidth: number | 'boundingclientrect';
    canvasHeight: number | 'boundingclientrect';
    greedyGestureHandling?: boolean
    rotationEnabled?: boolean,
    units?: Units,
    spaceBelowCanvas?: number
    drawing: Function
}

export interface EventListenerConfiguration<TEventMap, Type extends keyof TEventMap, T = TEventMap[Type]> {
    type: Type;
    preventDefault?: (ev: T) => boolean;
    shape: T,
    debounceInterval?: number
}