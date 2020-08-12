import { Gesture } from "./gesture";
import { Transformable } from "../transformable";
import { Movable } from "./movable";
export interface TransformerContext extends Transformable {
    getGestureForOneMovable(movable: Movable): Gesture;
    getGestureForTwoMovables(movable1: Movable, movable2: Movable): Gesture;
}
