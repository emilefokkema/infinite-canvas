import { EventImpl } from "./event-impl";
import {InternalEvent} from "./internal-events/internal-event";
import { PreventableDefault } from "./preventable-default/preventable-default";

export class CustomEventImpl extends EventImpl<PreventableDefault> implements Event{
    public get cancelBubble(): boolean{return false;}
    public get composed(): boolean{return false;}
    public get currentTarget(): EventTarget | null{return null;}
    public get returnValue(): boolean{return true;}
    public get srcElement(): EventTarget | null{return null;}
    public get target(): EventTarget | null{return null;}
    public get timeStamp(): number{return 0;}

    constructor(canvasEvent: InternalEvent, preventableDefault: PreventableDefault, public readonly type: string) {
        super(canvasEvent, preventableDefault);
    }

    composedPath(): EventTarget[] {
        return [];
    }
}
