import { Gesture } from "./gesture";
import { Transformation } from "../transformation";
import { TransformerContext } from "./transformer-context";
import { Movable } from "./movable";
import { MoveSubscription } from "./move-subscription";
export declare abstract class TwoAnchorGesture implements Gesture {
    protected readonly context: TransformerContext;
    protected point1: MoveSubscription;
    protected point2: MoveSubscription;
    protected initialTransformation: Transformation;
    constructor(movable1: Movable, movable2: Movable, context: TransformerContext);
    protected abstract setTransformation(): void;
    withMovable(movable: Movable): Gesture;
    withoutMovable(movable: Movable): Gesture;
}
