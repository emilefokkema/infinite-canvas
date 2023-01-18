import { InfiniteCanvasProxy, EventListenerProxy } from "./proxies";
import { InfiniteCanvasOnE2ETestPage } from "./page/interfaces";
import { InfiniteCanvasEventMap } from "./shared/infinite-canvas-event-map";
import { DrawEvent, drawEventShape } from "./shared/draw-event";
import { EventListenerProviderProxyImpl } from "./event-listener-provider-proxy-impl";
import { MouseEventMap, TransformationEventMap, TouchEventMap, PointerEventMap } from "./shared/maps";
import { MouseEventShape, mouseEventShape } from "./shared/mouse-event-shape";
import { WheelEventShape, wheelEventShape } from "./shared/wheel-event-shape";
import { TouchEventShape, touchEventShape } from "./shared/touch-event-shape";
import { transformationEventShape } from "./shared/transformation-event";
import { PointerEventShape, pointerEventShape } from "./shared/pointer-event-shape";

export class InfiniteCanvasProxyImpl extends EventListenerProviderProxyImpl<InfiniteCanvasEventMap, InfiniteCanvasOnE2ETestPage> implements InfiniteCanvasProxy{

    public addMouseEventListener<K extends keyof MouseEventMap<InfiniteCanvasEventMap>>(
        type: K,
        preventDefault?: (ev: MouseEventShape) => boolean,
        preventNativeDefault?: (ev: MouseEventShape) => boolean,
        stopPropagation?: (ev: MouseEventShape) => boolean,
        capture?: boolean): Promise<EventListenerProxy<MouseEventMap<InfiniteCanvasEventMap>[K]>>{
        return this.addEventListener({
            type,
            shape: mouseEventShape,
            preventDefault,
            preventNativeDefault,
            stopPropagation,
            capture
        });
    }
    public addWheelEventListener(
        preventDefault?: (ev: WheelEventShape) => boolean,
        preventNativeDefault?: (ev: WheelEventShape) => boolean): Promise<EventListenerProxy<WheelEventShape>>{
        return this.addEventListener({
            type: 'wheel',
            shape: wheelEventShape,
            preventDefault,
            preventNativeDefault
        })
    }
    public addPointerEventListener<K extends keyof PointerEventMap<InfiniteCanvasEventMap>>(
        type: K,
        preventDefault?: (ev: PointerEventShape) => boolean,
        preventNativeDefault?: (ev: PointerEventShape) => boolean,
        stopPropagation?: (ev: PointerEventShape) => boolean,
        capture?: boolean): Promise<EventListenerProxy<PointerEventMap<InfiniteCanvasEventMap>[K]>>{
        return this.addEventListener({
            type,
            shape: pointerEventShape,
            preventDefault,
            preventNativeDefault,
            stopPropagation,
            capture
        });
    }
    public addTransformationEventListener<K extends keyof TransformationEventMap>(type: K): Promise<EventListenerProxy<TransformationEventMap[K]>>{
        return this.addEventListener({
            type,
            shape: transformationEventShape
        });
    }
    public addTouchEventListener<K extends keyof TouchEventMap>(
        type: K,
        preventDefault?: (ev: TouchEventShape) => boolean,
        preventNativeDefault?: (ev: TouchEventShape) => boolean): Promise<EventListenerProxy<TouchEventMap[K]>>{
            
            return this.addEventListener({
                type,
                shape: touchEventShape,
                preventDefault,
                preventNativeDefault
            })
    }
    public addDrawEventListener(debounceInterval?: number): Promise<EventListenerProxy<DrawEvent>>{
        return this.addEventListener({
            type: 'draw',
            shape: drawEventShape,
            debounceInterval
        })
    }
}
