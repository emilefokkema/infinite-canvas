import { Event } from "./event";
import {AddEventListenerOptions} from "../api-surface/add-event-listener-options";

interface ListenerWrapperRecord<TSourceEvent, TTargetEvent>{
    original: (ev: TTargetEvent) => void;
    wrapper: (ev: TSourceEvent) => void;
}
export abstract class EventTransformer<TSourceEvent, TTargetEvent> implements Event<TTargetEvent>{
    private _wrappers: ListenerWrapperRecord<TSourceEvent, TTargetEvent>[] = [];
    protected constructor(private readonly sourceEvent: Event<TSourceEvent>) {
    }
    public addListener(listener: (ev: TTargetEvent) => void, options?: AddEventListenerOptions): void{
        this.sourceEvent.addListener(this.wrapEventListener(listener, options), options);
    }
    public removeListener(listener: (ev: TTargetEvent) => void): void{
        const index: number = this._wrappers.findIndex(r => r.original === listener);
        if(index === -1){
            return;
        }
        this.sourceEvent.removeListener(this._wrappers[index].wrapper);
        this._wrappers.splice(index, 1);
    }
    protected abstract transformEvent(source: TSourceEvent): TTargetEvent;
    private removeWrapper(wrapper: (ev: TSourceEvent) => void): void{
        const index: number = this._wrappers.findIndex(r => r.wrapper === wrapper);
        if(index === -1){
            return;
        }
        this._wrappers.splice(index, 1);
    }
    private makeOnce(wrapper: (ev: TSourceEvent) => void): (ev: TSourceEvent) => void{
        const result: (ev: TSourceEvent) => void = (source: TSourceEvent) => {
            this.removeWrapper(result);
            wrapper(source);
        };
        return result;
    }
    private wrapEventListener(listener: (ev: TTargetEvent) => void, options: AddEventListenerOptions): (ev: TSourceEvent) => void{
        let wrapper: (ev: TSourceEvent) => void = (source: TSourceEvent) => {
            listener(this.transformEvent(source));
        };
        if(options && options.once){
            wrapper = this.makeOnce(wrapper);
        }
        this._wrappers.push({original: listener, wrapper: wrapper});
        return wrapper;
    }
}
