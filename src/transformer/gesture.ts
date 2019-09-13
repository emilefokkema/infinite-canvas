import { Movable } from "./movable";

export interface Gesture{
    withMovable(movable: Movable): Gesture;
    withoutMovable(movable: Movable): Gesture;
}