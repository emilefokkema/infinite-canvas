import { Instruction } from "../../instructions/instruction";
import {Transformation} from "../../transformation";
import {CoordinateSystem} from "./coordinate-system";

export class CanvasContextSystem extends CoordinateSystem{
    constructor(base: Transformation, inverseBase: Transformation, public readonly infiniteCanvasContext: CoordinateSystem){
        super(base, inverseBase);
    }
    public get userTransformation(): Transformation{return this.infiniteCanvasContext.base;}
    public get infiniteCanvasContextBase(): Transformation{return this.infiniteCanvasContext.base;}
    public get inverseInfiniteCanvasContextBase(): Transformation{return this.infiniteCanvasContext.inverseBase;}
    public representInfiniteCanvasContextTransformation(infiniteCanvasContextTransformation: Transformation): Transformation{
        return this.infiniteCanvasContext.inverseRepresentTransformation(infiniteCanvasContextTransformation);
    }
    public executeInTransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void{
        const {a, b, c, d, e, f} = this.infiniteCanvasContextBase;
        context.save();
        context.transform(a, b, c, d, e, f);
        instruction(context, this.userTransformation);
        context.restore();
    }
}
