import { Point } from "../geometry/point";
import { MoveSubscription } from "./move-subscription";
import { EventDispatcher } from "../event-utils/event-dispatcher";
import { Anchor } from "./anchor";

export class InfiniteCanvasAnchor implements Anchor{
    private moveEventDispatcher: EventDispatcher<Point> = new EventDispatcher<Point>();
    private _fixedOnInfiniteCanvas: boolean = false;
    public get fixedOnInfiniteCanvas(): boolean{return this._fixedOnInfiniteCanvas;}
    constructor(public point: Point){
    }
    private removeHandler(handler: (newPoint: Point) => void): void{
        this.moveEventDispatcher.removeListener(handler);
    }
    public moveTo(x: number, y:number): void{
        const newPoint: Point = new Point(x, y);
        this.point = newPoint;
        this.moveEventDispatcher.dispatch(newPoint);
    }
    public onMoved(handler: () => void, fixedOnInfiniteCanvas: boolean): MoveSubscription{
        let result: MoveSubscription;
        this._fixedOnInfiniteCanvas = fixedOnInfiniteCanvas;
        const newHandler: (newPoint: Point) => void = (newPoint: Point) => {
            result.current = newPoint;
            handler();
        };
        this.moveEventDispatcher.addListener(newHandler);
        result = new MoveSubscription(this.point, () => {
            this.removeHandler(newHandler);
            this._fixedOnInfiniteCanvas = false;
            return this;
        });
        return result;
    }
}