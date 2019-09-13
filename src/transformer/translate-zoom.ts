import { Transformation } from "../transformation";
import { TransformerContext } from "./transformer-context";
import { Movable } from "./movable";
import { TwoAnchorGesture } from "./two-anchor-gesture";

export class TranslateZoom extends TwoAnchorGesture{
    constructor(
        movable1: Movable,
        movable2: Movable,
        context: TransformerContext
    ){
        super(movable1, movable2, context);
    }
    protected setTransformation(): void{
        this.context.transformation = this.initialTransformation.before(Transformation.translateZoom(
            this.point1.initial.x,
            this.point1.initial.y,
            this.point2.initial.x,
            this.point2.initial.y,
            this.point1.current.x,
            this.point1.current.y,
            this.point2.current.x,
            this.point2.current.y));
    }
}