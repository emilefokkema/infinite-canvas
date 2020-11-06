import {CoordinateSystem} from "./coordinate-system";
import {CanvasContextSystem} from "./canvas-context-system";
import {Transformation} from "../../transformation";
import { ConvexPolygon } from "../../areas/polygons/convex-polygon";
import { Instruction } from "../../instructions/instruction";

export class ScreenSystem<TCanvasContextSystem extends CanvasContextSystem> extends CoordinateSystem{
    public readonly infiniteCanvasContextBase: Transformation;
    public readonly inverseInfiniteCanvasContextBase: Transformation;
    constructor(base: Transformation, inverseBase: Transformation, public readonly canvasContextSystem: TCanvasContextSystem){
        super(base, inverseBase);
        this.infiniteCanvasContextBase = canvasContextSystem.infiniteCanvasContextBase.before(canvasContextSystem.base);
        this.inverseInfiniteCanvasContextBase = canvasContextSystem.inverseBase.before(canvasContextSystem.inverseInfiniteCanvasContextBase);
    }
    public get userTransformation(): Transformation{return this.canvasContextSystem.userTransformation;}
    
    public setTransformationToTransformInfiniteCanvasContext(context: CanvasRenderingContext2D, infiniteCanvasContextTransformation: Transformation): void{
        const representedInfiniteCanvasContextTransformation: Transformation =
            this.canvasContextSystem.representInfiniteCanvasContextTransformation(infiniteCanvasContextTransformation).before(this.canvasContextSystem.base);
        const {a, b, c, d, e, f} = representedInfiniteCanvasContextTransformation;
        context.setTransform(a, b, c, d, e, f);
    }
    public setCanvasContextTransformation(context: CanvasRenderingContext2D): void{
        if(this.canvasContextSystem.base.equals(Transformation.identity)){
            return;
        }
        const {a, b, c, d, e, f} = this.canvasContextSystem.base;
        context.setTransform(a, b, c, d, e, f);
    }
    public rebaseToInfiniteCanvasContext(infiniteCanvasContextTransformation: Transformation, polygon: ConvexPolygon): ConvexPolygon{
        const transformedInfiniteCanvasContextBase: Transformation = infiniteCanvasContextTransformation.before(this.infiniteCanvasContextBase);
        return polygon.transform(transformedInfiniteCanvasContextBase.inverse());
    }
    public executeInTransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void{
        this.canvasContextSystem.executeInTransformedInfiniteCanvasContext(instruction, context);
    }
    public executeInUntransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void{
        const {a, b, c, d, e, f} = this.infiniteCanvasContextBase;
        context.save();
        context.setTransform(a, b, c, d, e, f);
        instruction(context, this.userTransformation);
        context.restore();
    }
}
