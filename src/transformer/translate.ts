import { Gesture } from "./gesture";
import { Transformation } from "../transformation";
import { TransformerContext } from "./transformer-context";
import { MoveSubscription } from "./move-subscription";
import { Anchor } from "./anchor";

export class Translate implements Gesture{
    private point: MoveSubscription;
    private initialTransformation: Transformation;
    constructor(
        private readonly anchor: Anchor,
        private readonly context: TransformerContext
    ){
        this.initialTransformation = context.transformation;
        this.point = anchor.onMoved(() => {
            this.setTransformation();
        }, true);
    }
    private setTransformation(): void{
        this.context.transformation = this.initialTransformation.before(this.getTranslation());
    }
    private getTranslation(): Transformation{
        return Transformation.translation(this.point.current.x - this.point.initial.x, this.point.current.y - this.point.initial.y);
    }
    public withAnchor(anchor: Anchor): Gesture{
        if(anchor === this.anchor){
            return this;
        }
        return this.context.getGestureForTwoAnchors(this.point.cancel(), anchor);
    }
    public withoutAnchor(anchor: Anchor): Gesture{
        this.point.cancel();
        return undefined;
    }
}