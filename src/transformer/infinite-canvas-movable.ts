import { Point } from "../geometry/point";
import { MoveSubscription } from "./move-subscription";
import { Movable } from "./movable";

export class InfiniteCanvasMovable implements Movable{
    private handlers: ((newPoint: Point) => void)[];
    constructor(public point: Point){
        this.handlers = [];
    }
    private removeHandler(handler: (newPoint: Point) => void): Movable{
        const index: number = this.handlers.indexOf(handler);
        if(index > -1){
            this.handlers.splice(index, 1);
        }
        return this;
    }
    public moveTo(x: number, y:number): void{
        const newPoint: Point = new Point(x, y);
        this.point = newPoint;
        for(const handler of this.handlers){
            handler(newPoint);
        }
    }
    public onMoved(handler: () => void): MoveSubscription{
        let result: MoveSubscription;
        const newHandler: (newPoint: Point) => void = (newPoint: Point) => {
            result.current = newPoint;
            handler();
        };
        this.handlers.push(newHandler);
        result = new MoveSubscription(this.point, () => this.removeHandler(newHandler));
        return result;
    }
}