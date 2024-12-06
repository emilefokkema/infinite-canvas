import { MappedEventPreventableDefault } from "./mapped-event-preventable-default";

export class EventBasedInfiniteCanvasPreventableDefault implements MappedEventPreventableDefault{
    private _defaultPrevented: boolean;
    public get infiniteCanvasDefaultPrevented(): boolean{return this._defaultPrevented;}
    public get nativeDefaultPrevented(): boolean{return this.event.defaultPrevented;}
    public get nativeCancelable(): boolean{return this.event.cancelable;}
    public get defaultPrevented(): boolean{return this._defaultPrevented;}
    public get cancelable(): boolean{return true;}
    constructor(protected readonly event: Event){

    }
    public preventDefault(preventNativeDefault?: boolean): void{
        this._defaultPrevented = true;
        if(preventNativeDefault){
            this.event.preventDefault();
        }
    }
}