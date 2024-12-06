import { Transformation } from "../transformation";
import { TransformerContext } from "./transformer-context";
import { TwoAnchorGesture } from "./two-anchor-gesture";
import { Anchor } from "./anchor";

export class TranslateZoom extends TwoAnchorGesture{
    constructor(
        anchor1: Anchor,
        anchor2: Anchor,
        context: TransformerContext
    ){
        super(anchor1, anchor2, context);
    }
    protected fixesFirstAnchorOnInfiniteCanvas(): boolean{return true;}
    protected fixesSecondAnchorOnInfiniteCanvas(): boolean{return false;}
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