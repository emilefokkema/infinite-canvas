import { EventSource } from "./event-source";
import { EventTarget } from './event-target';

export class TypedEventSource<TEventMap, TType extends keyof TEventMap> implements EventSource<TEventMap[TType]>{
    constructor(private readonly target: EventTarget<TEventMap>, private readonly type: TType, private readonly capture: boolean){

    }
    public addListener(listener: (ev: TEventMap[TType]) => void): void{
        this.target.addEventListener(this.type, listener, this.capture);
    }
    public removeListener(listener: (ev: TEventMap[TType]) => void): void{
        this.target.removeEventListener(this.type, listener, this.capture);
    }
}