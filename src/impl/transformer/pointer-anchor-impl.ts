import { PointerAnchor } from "./pointer-anchor";
import { Point } from "../geometry/point";
import { Anchor } from "./anchor";
import { InfiniteCanvasAnchor } from "./infinite-canvas-anchor";

export class PointerAnchorImpl implements PointerAnchor{
    private _touchId: number;
    private _defaultPrevented: boolean = false;
    public readonly anchor: Anchor;
    public get defaultPrevented(): boolean{return this._defaultPrevented;}
    public get touchId(): number{return this._touchId;}
    public get pointerId(): number{return this.pointerEvent.pointerId;}
    constructor(public pointerEvent: PointerEvent){
        this.anchor = new InfiniteCanvasAnchor(new Point(pointerEvent.offsetX, pointerEvent.offsetY));
    }
    public preventDefault(): void{
        this._defaultPrevented = true;
    }
    public setTouchId(touchId: number): void{
        this._touchId = touchId;
    }
    public updatePointerEvent(ev: PointerEvent): void{
        this.pointerEvent = ev;
        this.anchor.moveTo(ev.offsetX, ev.offsetY);
    }
}