import { Event } from "./event";
import { EventListener } from "./event-listener";
import {InfiniteCanvasAddEventListenerOptions} from "./infinite-canvas-add-event-listener-options";

interface ListenerWrapperRecord<TSourceEvent, TTargetEvent>{
    original: EventListener<TTargetEvent>;
    wrapper: EventListener<TSourceEvent>;
}
export abstract class EventTransformer<TSourceEvent, TTargetEvent> implements Event<TTargetEvent>{
    private _wrappers: ListenerWrapperRecord<TSourceEvent, TTargetEvent>[] = [];
    protected constructor(private readonly sourceEvent: Event<TSourceEvent>) {
    }
    public addListener(listener: EventListener<TTargetEvent>, options?: InfiniteCanvasAddEventListenerOptions): void{
        this.sourceEvent.addListener(this.wrapEventListener(listener, options), options);
    }
    public removeListener(listener: EventListener<TTargetEvent>): void{
        const index: number = this._wrappers.findIndex(r => r.original === listener);
        if(index === -1){
            return;
        }
        this.sourceEvent.removeListener(this._wrappers[index].wrapper);
        this._wrappers.splice(index, 1);
    }
    protected abstract transformEvent(source: TSourceEvent): TTargetEvent;
    private removeWrapper(wrapper: EventListener<TSourceEvent>): void{
        const index: number = this._wrappers.findIndex(r => r.wrapper === wrapper);
        if(index === -1){
            return;
        }
        this._wrappers.splice(index, 1);
    }
    private makeOnce(wrapper: EventListener<TSourceEvent>): EventListener<TSourceEvent>{
        const result: EventListener<TSourceEvent> = (source: TSourceEvent) => {
            this.removeWrapper(result);
            wrapper(source);
        };
        return result;
    }
    private wrapEventListener(listener: EventListener<TTargetEvent>, options: InfiniteCanvasAddEventListenerOptions): EventListener<TSourceEvent>{
        let wrapper: EventListener<TSourceEvent> = (source: TSourceEvent) => {
            listener(this.transformEvent(source));
        };
        if(options && options.once){
            wrapper = this.makeOnce(wrapper);
        }
        this._wrappers.push({original: listener, wrapper: wrapper});
        return wrapper;
    }
}
