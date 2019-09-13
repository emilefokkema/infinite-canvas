import { Gesture } from "./gesture";
import { Transformation } from "../transformation";
import { TransformerContext } from "./transformer-context";
import { Movable } from "./movable";
import { MoveSubscription } from "./move-subscription";

export abstract class TwoAnchorGesture implements Gesture{
    protected point1: MoveSubscription;
    protected point2: MoveSubscription;
    protected initialTransformation: Transformation;
    constructor(
        movable1: Movable,
        movable2: Movable,
        protected readonly context: TransformerContext
    ){
        this.initialTransformation = context.transformation;
        this.point1 = movable1.onMoved(() => this.setTransformation());
        this.point2 = movable2.onMoved(() => this.setTransformation());
    }
    protected abstract setTransformation(): void;
    public withMovable(movable: Movable): Gesture{
        return undefined;
    }
    public withoutMovable(movable: Movable): Gesture{
        const movable1: Movable = this.point1.cancel();
        const movable2: Movable = this.point2.cancel();
        if(movable === movable1){
            return this.context.getGestureForOneMovable(movable2);
        }
        if(movable === movable2){
            return this.context.getGestureForOneMovable(movable1);
        }
        return undefined;
    }
}