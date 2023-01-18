import { MoveSubscription } from "./move-subscription";
import { Transformation } from "../transformation";
import { Anchor } from "./anchor";
import { TransformerContext } from "./transformer-context";
import { Gesture } from "./gesture";

export class Rotate implements Gesture{
    private point: MoveSubscription;
    private angularVelocity: number;
    private initialTransformation: Transformation;
    constructor(anchor: Anchor, private readonly context: TransformerContext){
        this.initialTransformation = context.transformation;
        this.angularVelocity = Math.PI / 100;
        this.point = anchor.onMoved(() => {
            this.setTransformation();
        }, false);
    }
    private setTransformation(): void{
        this.context.transformation = this.initialTransformation.before(Transformation.rotation(
            this.point.initial.x,
            this.point.initial.y,
            (this.point.initial.x - this.point.current.x) * this.angularVelocity));
    }
    public withAnchor(anchor: Anchor): Gesture{
        return this;
    }
    public withoutAnchor(anchor: Anchor): Gesture{
        this.point.cancel();
        return undefined;
    }
    public end(): void{
        this.point.cancel();
    }
}
