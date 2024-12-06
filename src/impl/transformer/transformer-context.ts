import { Gesture } from "./gesture";
import { Transformable } from "../transformable";
import { Anchor } from "./anchor";

export interface TransformerContext extends Transformable{
    getGestureForOneAnchor(anchor: Anchor): Gesture;
    getGestureForTwoAnchors(anchor1: Anchor, anchor2: Anchor): Gesture;
}