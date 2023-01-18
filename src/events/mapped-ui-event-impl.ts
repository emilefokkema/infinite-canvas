import { MappedEventImpl } from "./mapped-event-impl";

export class MappedUIEventImpl<TEvent extends UIEvent> extends MappedEventImpl<TEvent> implements UIEvent{
    public get detail(): number{return this.event.detail}
    public get view(): Window | null{return this.event.view}
    public get which(): number{return this.event.which}
    public initUIEvent(typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window | null, detailArg?: number): void{

    }
}