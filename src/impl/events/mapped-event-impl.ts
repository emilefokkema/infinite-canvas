import { EventImpl } from "./event-impl";
import {InfiniteCanvasEventWithDefaultBehavior} from "api/infinite-canvas-event-with-default-behavior";
import {InternalEvent} from "./internal-events/internal-event";
import { MappedEventPreventableDefault } from "./preventable-default/mapped-event-preventable-default";

export class MappedEventImpl<TEvent extends Event> extends EventImpl<MappedEventPreventableDefault> implements Event, InfiniteCanvasEventWithDefaultBehavior{
    constructor(canvasEvent: InternalEvent, preventableDefault: MappedEventPreventableDefault, protected readonly event: TEvent){
        super(canvasEvent, preventableDefault);
    }
    public get nativeDefaultPrevented(): boolean{return this.preventableDefault.nativeDefaultPrevented;}
    public get nativeCancelable(): boolean{return this.preventableDefault.nativeCancelable;}
    public get cancelBubble(): boolean{return this.event.cancelBubble}
    public get composed(): boolean{return this.event.composed}
    public get currentTarget(): EventTarget | null{return this.event.currentTarget}
    public get returnValue(): boolean{return this.event.returnValue}
    public get srcElement(): EventTarget | null{return this.event.srcElement}
    public get target(): EventTarget | null{return this.event.target}
    public get timeStamp(): number{return this.event.timeStamp}
    public get type(): string{return this.event.type}

    preventDefault(preventNativeDefault?: boolean): void {
        this.preventableDefault.preventDefault(preventNativeDefault);
    }

    composedPath(): EventTarget[] {
        return this.event.composedPath();
    }
}
