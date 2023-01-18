import {MouseEventProperties} from "./mouse-event-properties";
import {InternalEvent} from "../internal-events/internal-event";
import { MappedUIEventImpl } from "../mapped-ui-event-impl";
import { MappedEventPreventableDefault } from "../preventable-default/mapped-event-preventable-default";

export class MouseEventImpl<TMouseEvent extends MouseEvent> extends MappedUIEventImpl<TMouseEvent> implements MouseEvent {
    public readonly offsetX: number;
    public readonly offsetY: number;
    public readonly movementX: number;
    public readonly movementY: number;
    constructor(canvasEvent: InternalEvent, preventableDefault: MappedEventPreventableDefault, event: TMouseEvent, props: MouseEventProperties) {
        super(canvasEvent, preventableDefault, event);
        this.offsetX = props.offsetX;
        this.offsetY = props.offsetY;
        this.movementX = props.movementX;
        this.movementY = props.movementY;
    }

    public get altKey(): boolean{return this.event.altKey}
    public get button(): number{return this.event.button}
    public get buttons(): number{return this.event.buttons}
    public get clientX(): number{return this.event.clientX}
    public get clientY(): number{return this.event.clientY}
    public get ctrlKey(): boolean{return this.event.ctrlKey}
    public get metaKey(): boolean{return this.event.metaKey}
    public get pageX(): number{return this.event.pageX}
    public get pageY(): number{return this.event.pageY}
    public get relatedTarget(): EventTarget | null{return this.event.relatedTarget}
    public get screenX(): number{return this.event.screenX}
    public get screenY(): number{return this.event.screenY}
    public get shiftKey(): boolean{return this.event.shiftKey}
    public get x(): number{return this.event.x}
    public get y(): number{return this.event.y}

    getModifierState(keyArg: string): boolean {
        return this.event.getModifierState(keyArg);
    }

    initMouseEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget | null): void {
    }
}
