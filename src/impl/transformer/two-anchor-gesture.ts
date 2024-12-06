import { Gesture } from "./gesture";
import { Transformation } from "../transformation";
import { TransformerContext } from "./transformer-context";
import { MoveSubscription } from "./move-subscription";
import { Anchor } from "./anchor";

export abstract class TwoAnchorGesture implements Gesture{
    protected point1: MoveSubscription;
    protected point2: MoveSubscription;
    protected initialTransformation: Transformation;
    constructor(
        anchor1: Anchor,
        anchor2: Anchor,
        protected readonly context: TransformerContext
    ){
        this.initialTransformation = context.transformation;
        this.point1 = anchor1.onMoved(() => this.setTransformation(), this.fixesFirstAnchorOnInfiniteCanvas());
        this.point2 = anchor2.onMoved(() => this.setTransformation(), this.fixesSecondAnchorOnInfiniteCanvas());
    }
    protected abstract setTransformation(): void;
    protected abstract fixesFirstAnchorOnInfiniteCanvas(): boolean;
    protected abstract fixesSecondAnchorOnInfiniteCanvas(): boolean;
    public withAnchor(anchor: Anchor): Gesture{
        return this;
    }
    public withoutAnchor(anchor: Anchor): Gesture{
        const anchor1: Anchor = this.point1.cancel();
        const anchor2: Anchor = this.point2.cancel();
        if(anchor === anchor1){
            return this.context.getGestureForOneAnchor(anchor2);
        }
        if(anchor === anchor2){
            return this.context.getGestureForOneAnchor(anchor1);
        }
        return undefined;
    }
}