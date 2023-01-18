import { Units } from "./units";

export interface CanvasElementInitialization{
    styleWidth: string;
    styleHeight: string;
    canvasWidth: number | 'boundingclientrect';
    canvasHeight: number | 'boundingclientrect';
    spaceBelowCanvas?: number
}

export interface InfiniteCanvasE2EInitialization{
    greedyGestureHandling?: boolean
    rotationEnabled?: boolean,
    units?: Units,
    drawing: Function
}

export interface FullInfiniteCanvasE2EInitialization extends CanvasElementInitialization, InfiniteCanvasE2EInitialization{

}

export interface EventListenerConfiguration<TEventMap, Type extends keyof TEventMap, T = TEventMap[Type]> {
    type: Type;
    preventDefault?: (ev: T) => boolean;
    preventNativeDefault?: (ev: T) => boolean;
    stopPropagation?: (ev: T) => boolean;
    shape: T,
    debounceInterval?: number,
    capture?: boolean
}