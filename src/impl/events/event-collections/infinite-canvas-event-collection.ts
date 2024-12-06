import { EventMap } from '../../api-surface/event-map'
import {isTransformationEventKey, isPointerEventKey, PointerEventMap, DrawEventMap, TransformationEventMap, UnmappedEventMap, HandledOrFilteredEventMap} from "../infinite-canvas-event-map";
import { EventCollection, EventListenerCollection } from './event-collection';
import {Config, InfiniteCanvas} from "../../api-surface/infinite-canvas";
import {Transformer} from "../../transformer/transformer";
import { RectangleManager } from '../../rectangle/rectangle-manager';
import { DrawEventCollection } from './draw-event-collection';
import { DrawingIterationProviderWithCallback } from '../../drawing-iteration-provider-with-callback';
import { TransformationEventCollection } from './transformation-event-collection';
import { HandledOrFilteredEventCollection } from './handled-or-filtered-event-collection';
import { PointerEventCollection } from './pointer-event-collection';
import { MappingPointerEventCollection } from './mapping-pointer-event-collection';
import { MappingEventCollection } from './mapping-event-collection';
import { InternalMouseEvent } from '../mouse-events/internal-mouse-event';
import { toTouchesArray } from '../touch-events/to-touches-array';
import { InternalTouchEvent } from '../touch-events/internal-touch-event';
import { InternalPointerEvent } from '../mouse-events/internal-pointer-event';
import { InternalDragEvent } from '../mouse-events/internal-drag-event';
import { InternalUnmappedEvent } from '../internal-events/internal-unmapped-event';

export class InfiniteCanvasEventCollection implements EventCollection<EventMap>{
    constructor(
        private readonly drawEventCollection: EventCollection<DrawEventMap>,
        private readonly transformationEventCollection: EventCollection<TransformationEventMap>,
        private readonly pointerEventCollection: EventCollection<PointerEventMap>,
        private readonly unmappedEventCollection: EventCollection<UnmappedEventMap>){

    }
    public setOn(type: keyof EventMap, listener: (this: InfiniteCanvas, ev: EventMap[keyof EventMap]) => any): void{
        if(type === 'draw'){
            this.drawEventCollection.setOn('draw', listener)
        }else if(isTransformationEventKey(type)){
            this.transformationEventCollection.setOn(type, listener)
        }else if(isPointerEventKey(type)){
            this.pointerEventCollection.setOn(type, listener);
        }else{
            this.unmappedEventCollection.setOn(type, listener);
        }
    }
    public getOn(type: keyof EventMap): (this: InfiniteCanvas, ev: EventMap[keyof EventMap]) => any{
        if(type === 'draw'){
            return this.drawEventCollection.getOn('draw')
        }else if(isTransformationEventKey(type)){
            return this.transformationEventCollection.getOn(type);
        }else if(isPointerEventKey(type)){
            return this.pointerEventCollection.getOn(type);
        }else{
            return this.unmappedEventCollection.getOn(type);
        }
    }
    public addEventListener(type: keyof EventMap, listener: ((this: InfiniteCanvas, ev: EventMap[keyof EventMap]) => any) | EventListenerObject, options?: boolean | AddEventListenerOptions): void{
        if(type === 'draw'){
            this.drawEventCollection.addEventListener('draw', listener, options);
        }else if(isTransformationEventKey(type)){
            this.transformationEventCollection.addEventListener(type, listener, options);
        }else if(isPointerEventKey(type)){
            this.pointerEventCollection.addEventListener(type, listener, options);
        }else{
            this.unmappedEventCollection.addEventListener(type, listener, options)
        }
	}
	public removeEventListener(type: keyof EventMap, listener: ((this: InfiniteCanvas, ev: EventMap[keyof EventMap]) => any) | EventListenerObject, options?: boolean | EventListenerOptions): void{
        if(type === 'draw'){
            this.drawEventCollection.removeEventListener('draw', listener, options);
        }else if(isTransformationEventKey(type)){
            this.transformationEventCollection.removeEventListener(type, listener, options);
        }else if(isPointerEventKey(type)){
            this.pointerEventCollection.removeEventListener(type, listener, options);
        }else{
            this.unmappedEventCollection.removeEventListener(type, listener, options)
        }
	}
    public static create(
        canvas: EventListenerCollection<HTMLElementEventMap>,
        transformer: Transformer,
        rectangleManager: RectangleManager,
        infiniteCanvas: InfiniteCanvas,
        config: Config,
        drawingIterationProvider: DrawingIterationProviderWithCallback): InfiniteCanvasEventCollection{
            const drawEventCollection: EventCollection<DrawEventMap> = new DrawEventCollection(drawingIterationProvider, rectangleManager, infiniteCanvas);
            const transformationEventCollection: EventCollection<TransformationEventMap> = new TransformationEventCollection(transformer, rectangleManager, infiniteCanvas);
            const handledOrFilteredEventCollection: EventCollection<HandledOrFilteredEventMap> = new HandledOrFilteredEventCollection(canvas,
                transformer,
                rectangleManager,
                infiniteCanvas,
                config);
            const pointerEventCollection: EventCollection<PointerEventMap> = new PointerEventCollection(
                handledOrFilteredEventCollection,
                new MappingPointerEventCollection(
                    new MappingEventCollection(canvas, (e) => new InternalMouseEvent(e), rectangleManager, infiniteCanvas),
                    new MappingEventCollection(canvas, (e) => {
                        const touches = toTouchesArray(e.targetTouches);
                        const changedTouches = toTouchesArray(e.changedTouches);
                        return InternalTouchEvent.create(
                            rectangleManager.rectangle,
                            e,
                            touches,
                            changedTouches
                        )
                    }, rectangleManager, infiniteCanvas),
                    new MappingEventCollection(canvas, (e) => new InternalPointerEvent(e), rectangleManager, infiniteCanvas),
                    new MappingEventCollection(canvas, (e) => new InternalDragEvent(e), rectangleManager, infiniteCanvas))
                );
            return new InfiniteCanvasEventCollection(
                drawEventCollection,
                transformationEventCollection,
                pointerEventCollection,
                new MappingEventCollection(canvas, (e) => new InternalUnmappedEvent(e), rectangleManager, infiniteCanvas));
    }
}
