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
    public AT_TARGET = 2 as const
    public BUBBLING_PHASE = 3 as const
    public CAPTURING_PHASE = 1 as const
    public NONE: 0 = 0

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
