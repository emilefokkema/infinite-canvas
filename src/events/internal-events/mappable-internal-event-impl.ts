import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { MappableInternalEvent } from "./mappable-internal-event";
import { PreventableDefault } from "../preventable-default/preventable-default";

export abstract class MappableInternalEventImpl<TEvent extends Event, TPreventableDefault extends PreventableDefault> implements MappableInternalEvent<TEvent> {
    private resultEvent: TEvent;
    public get infiniteCanvasDefaultPrevented(): boolean{return this.preventableDefault.infiniteCanvasDefaultPrevented;}
    public propagationStopped: boolean = false;
    public immediatePropagationStopped: boolean = false;
    constructor(protected readonly preventableDefault: TPreventableDefault){}
    protected abstract createResultEvent(rectangle: CanvasRectangle): TEvent;
    public stopPropagation(): void{
        this.propagationStopped = true;
    }
    public stopImmediatePropagation(): void{
        this.immediatePropagationStopped = true;
    }
    public getResultEvent(rectangle: CanvasRectangle): TEvent{
        if(!this.resultEvent){
            this.resultEvent = this.createResultEvent(rectangle);
        }
        return this.resultEvent;
    }
}
