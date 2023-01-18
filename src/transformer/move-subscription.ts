import { Point } from "../geometry/point";
import { Anchor } from "./anchor";

export class MoveSubscription{
    public current: Point;
    constructor(public initial: Point, public cancel: () => Anchor){
        this.current = initial;
    }
}