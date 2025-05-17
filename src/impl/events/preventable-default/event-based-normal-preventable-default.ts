import { MappedEventPreventableDefault } from "./mapped-event-preventable-default";

export class EventBasedNormalPreventableDefault implements MappedEventPreventableDefault {
    public get infiniteCanvasDefaultPrevented(): boolean{return false;}
    public get nativeDefaultPrevented(): boolean{return this.event.defaultPrevented;}
    public get nativeCancelable(): boolean{return this.event.cancelable;}
    public get defaultPrevented(): boolean{return this.event.defaultPrevented;}
    public get cancelable(): boolean{return this.event.cancelable;}
    constructor(protected readonly event: Event){

    }
    public preventDefault(): void{
        this.event.preventDefault();
    }
}