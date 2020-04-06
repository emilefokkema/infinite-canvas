import { Point } from "../geometry/point";
import { Movable } from "./movable";

export class MoveSubscription{
    public current: Point;
    constructor(public initial: Point, public cancel: () => Movable){
        this.current = initial;
    }
}