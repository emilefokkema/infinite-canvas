import { Point } from "../geometry/point";
import { Movable } from "./movable";
export declare class MoveSubscription {
    initial: Point;
    cancel: () => Movable;
    current: Point;
    constructor(initial: Point, cancel: () => Movable);
}
