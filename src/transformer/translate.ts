import { Gesture } from "./gesture";
import { Transformation } from "../transformation";
import { TransformerContext } from "./transformer-context";
import { MoveSubscription } from "./move-subscription";
import { Movable } from "./movable";

export class Translate implements Gesture{
    private point: MoveSubscription;
    private initialTransformation: Transformation;
    constructor(
        movable: Movable,
        private readonly context: TransformerContext
    ){
        this.initialTransformation = context.transformation;
        this.point = movable.onMoved(() => {
            this.setTransformation();
        });
    }
    private setTransformation(): void{
        this.context.transformation = this.initialTransformation.before(this.getTranslation());
    }
    private getTranslation(): Transformation{
        return Transformation.translation(this.point.current.x - this.point.initial.x, this.point.current.y - this.point.initial.y);
    }
    public withMovable(movable: Movable): Gesture{
        return this.context.getGestureForTwoMovables(this.point.cancel(), movable);
    }
    public withoutMovable(movable: Movable): Gesture{
        return undefined;
    }
}