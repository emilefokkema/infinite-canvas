import { Point } from "../geometry/point";
import { MoveSubscription } from "./move-subscription";
import { Movable } from "./movable";
export declare class InfiniteCanvasMovable implements Movable {
    point: Point;
    private handlers;
    constructor(point: Point);
    private removeHandler;
    moveTo(x: number, y: number): void;
    onMoved(handler: () => void): MoveSubscription;
}
