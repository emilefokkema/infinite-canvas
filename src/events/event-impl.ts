import {InternalEvent} from "./internal-events/internal-event";
import { PreventableDefault } from "./preventable-default/preventable-default";

export class EventImpl<TPreventableDefault extends PreventableDefault> {
    constructor(protected readonly canvasEvent: InternalEvent, protected readonly preventableDefault: TPreventableDefault){

    }

    public get bubbles(): boolean{return false;}
    public get isTrusted(): boolean{return false;}
    public get eventPhase(): number{return Event.AT_TARGET;}
    public get cancelable(): boolean{return this.preventableDefault.cancelable;}
    public get defaultPrevented(): boolean{return this.preventableDefault.defaultPrevented;}
    public get AT_TARGET(): number{return Event.AT_TARGET}
    public get BUBBLING_PHASE(): number{return Event.BUBBLING_PHASE}
    public get CAPTURING_PHASE(): number{return Event.CAPTURING_PHASE}
    public get NONE(): number{return Event.NONE}

    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
    }

    preventDefault(): void {
        this.preventableDefault.preventDefault();
    }

    stopImmediatePropagation(): void {
        this.canvasEvent.stopImmediatePropagation();
    }

    stopPropagation(): void {
        this.canvasEvent.stopPropagation();
    }
}
