import {EventMap} from "../api-surface/event-map";
import {AddEventListenerOptions} from "../api-surface/add-event-listener-options";
import {DrawEvent} from "../api-surface/draw-event";
import {TransformationEvent} from "../api-surface/transformation-event";
import { Event } from "./event";
import {TransformationEventTransformer} from "./transformation-event-transformer";
import {CanvasRectangle} from "../rectangle/canvas-rectangle";

export class EventDispatcherCollection{
    private transformationStartEvent: Event<TransformationEvent>;
    private transformationChangeEvent: Event<TransformationEvent>;
    private transformationEndEvent: Event<TransformationEvent>;
    constructor(
        rectangle: CanvasRectangle,
        private readonly drawEvent: Event<DrawEvent>,
        transformationStartEvent: Event<void>,
        transformationChangeEvent: Event<void>,
        transformationEndEvent: Event<void>) {
            this.transformationStartEvent = new TransformationEventTransformer(transformationStartEvent, rectangle);
            this.transformationChangeEvent = new TransformationEventTransformer(transformationChangeEvent, rectangle);
            this.transformationEndEvent = new TransformationEventTransformer(transformationEndEvent, rectangle);
    }
    public addEventListener<K extends keyof EventMap>(event: K, listener: (ev: EventMap[K]) => void, options?: AddEventListenerOptions){
        switch (event) {
            case "draw": {
                this.drawEvent.addListener(listener, options);
                break;
            }
            case "transformationStart": {
                this.transformationStartEvent.addListener(listener, options)
                break;
            }
            case "transformationChange": {
                this.transformationChangeEvent.addListener(listener, options)
                break;
            }
            case "transformationEnd": {
                this.transformationEndEvent.addListener(listener, options)
                break;
            }
        }
    }

    public removeEventListener<K extends keyof EventMap>(event: K, listener: (ev: EventMap[K]) => void){
        switch (event) {
            case "draw": {
                this.drawEvent.removeListener(listener);
                break;
            }
            case "transformationStart": {
                this.transformationStartEvent.removeListener(listener)
                break;
            }
            case "transformationChange": {
                this.transformationChangeEvent.removeListener(listener)
                break;
            }
            case "transformationEnd": {
                this.transformationEndEvent.removeListener(listener)
                break;
            }
        }
    }
}
