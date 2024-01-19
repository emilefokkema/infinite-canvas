import {EventSource} from "../event-utils/event-source";
import {InfiniteCanvasEventSource} from "./infinite-canvas-event-source";
import {once} from "../event-utils/once";
import {InfiniteCanvas} from "../api-surface/infinite-canvas";
import {
    acceptEventListenerObjects,
    EventSourceThatAcceptsEventListenerObjects
} from "../event-utils/accept-event-listener-objects";
import { addThisArg } from "../event-utils/add-this-arg";
import { MappableInternalEvent } from "./internal-events/mappable-internal-event";
import { shareSplit } from "../event-utils/share-split";
import { filter } from "../event-utils/filter";
import { map } from "../event-utils/map";
import { CanvasRectangle } from '../rectangle/canvas-rectangle'
import { RectangleManager } from '../rectangle/rectangle-manager'

class InfiniteCanvasEventPhaseSource<TEvent extends Event> {
    private readonly _onceSource: EventSourceThatAcceptsEventListenerObjects<TEvent>;
    private readonly source: EventSourceThatAcceptsEventListenerObjects<TEvent>
    constructor(source: EventSource<TEvent>, infiniteCanvas: InfiniteCanvas){
        source = addThisArg(source, infiniteCanvas);
        this._onceSource = acceptEventListenerObjects(once(source));
        this.source = acceptEventListenerObjects(source);
    }
    public addListener(listener: ((this: InfiniteCanvas, ev: TEvent) => any) | EventListenerObject, options?: AddEventListenerOptions): void{
        if(options && options.once){
            this._onceSource.addListener(listener);
        }else{
            this.source.addListener(listener);
        }
    }
    public removeListener(listener: ((this: InfiniteCanvas, ev: TEvent) => any) | EventListenerObject): void{
        this.source.removeListener(listener);
        this._onceSource.removeListener(listener);
    }
}
class InfiniteCanvasEvent<TEvent extends Event> implements InfiniteCanvasEventSource<TEvent>{
    private wrappedOnEventHandler: (this: InfiniteCanvas, event: TEvent) => void;
    private onEventHandler: (this: InfiniteCanvas, event: TEvent) => any;
    constructor(
        private readonly captureSource: InfiniteCanvasEventPhaseSource<TEvent>,
        private readonly bubbleSource: InfiniteCanvasEventPhaseSource<TEvent>){
    }
    public get on(): (this: InfiniteCanvas, event: TEvent) => any{
        return this.onEventHandler;
    }
    public set on(value: (this: InfiniteCanvas, event: TEvent) => any){
        if(!value){
            this.bubbleSource.removeListener(this.wrappedOnEventHandler);
            this.wrappedOnEventHandler = null;
            this.onEventHandler = null;
        }else{
            this.wrappedOnEventHandler = function(ev: TEvent){
                return value.apply(this, [ev])
            }
            this.onEventHandler = value;
            this.bubbleSource.addListener(this.wrappedOnEventHandler);
        }
    }
    public addListener(listener: ((this: InfiniteCanvas, ev: TEvent) => any) | EventListenerObject, options?: boolean | AddEventListenerOptions): void{
        const notBooleanOptions: AddEventListenerOptions = options && (typeof options === 'boolean' ? undefined : options);
        const capture: boolean = typeof options === 'boolean' ? options : options && options.capture;
        if(capture){
            this.captureSource.addListener(listener, notBooleanOptions);
        }else{
            this.bubbleSource.addListener(listener, notBooleanOptions);
        }
    }
    public removeListener(listener: ((this: InfiniteCanvas, ev: TEvent) => any) | EventListenerObject, options?: boolean | EventListenerOptions): void{
        const capture: boolean = typeof options === 'boolean' ? options : options && options.capture;
        if(capture){
            this.captureSource.removeListener(listener);
        }else{
            this.bubbleSource.removeListener(listener);
        }
    }
}

function createInfiniteCanvasEvent<
    TSource extends EventSource<Event>,
    TEvent extends Event = TSource extends EventSource<infer R> ? R : never
    >(
    captureSource: TSource,
    bubbleSource: TSource,
    infiniteCanvas: InfiniteCanvas): InfiniteCanvasEventSource<TEvent>{
    return new InfiniteCanvasEvent(
        new InfiniteCanvasEventPhaseSource(captureSource, infiniteCanvas),
        new InfiniteCanvasEventPhaseSource(bubbleSource, infiniteCanvas));
}

export function preventPropagation<
    TInternalEvent extends MappableInternalEvent<TTarget>,
    TTarget extends Event = TInternalEvent extends MappableInternalEvent<infer R> ? R : never
    >(
    captureSource: EventSource<TInternalEvent>,
    bubbleSource: EventSource<TInternalEvent>,
    rectangleManager: RectangleManager,
    infiniteCanvas: InfiniteCanvas
): InfiniteCanvasEventSource<TTarget>{
    const captureSourceMapped = map(filter(captureSource, ev => !ev.immediatePropagationStopped), e => e.getResultEvent(rectangleManager.rectangle));
    const bubbleSourceMapped = map(filter(bubbleSource, ev => !ev.propagationStopped && !ev.immediatePropagationStopped), e => e.getResultEvent(rectangleManager.rectangle));
    return createInfiniteCanvasEvent(captureSourceMapped, bubbleSourceMapped, infiniteCanvas);
}

interface Stages<TEvent>{
    captureSource: EventSource<TEvent>;
    bubbleSource: EventSource<TEvent>;
    afterBubble: EventSource<TEvent>;
}

export function getStages<TEvent>(source: EventSource<TEvent>): Stages<TEvent>{
    const {first: captureSource, second: captureSourceActedUpon} = shareSplit(source);
    const {first: bubbleSource, second: afterBubble} = shareSplit(captureSourceActedUpon);
    return {
        captureSource,
        bubbleSource,
        afterBubble
    };
}

export function createStoppableInfiniteCanvasEvent<
    TInternalEvent extends MappableInternalEvent<TTarget>,
    TTarget extends Event = TInternalEvent extends MappableInternalEvent<infer R> ? R : never
    >(
    source: EventSource<TInternalEvent>,
    rectangleManager: RectangleManager,
    infiniteCanvas: InfiniteCanvas
): InfiniteCanvasEventSource<TTarget>{
    const {captureSource, bubbleSource} = getStages(source);
    return preventPropagation(
        captureSource, 
        bubbleSource,
        rectangleManager,
        infiniteCanvas);
}
