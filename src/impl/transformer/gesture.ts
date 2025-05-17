import { Anchor } from "./anchor";

export interface Gesture{
    withAnchor(anchor: Anchor): Gesture;
    withoutAnchor(anchor: Anchor): Gesture;
}