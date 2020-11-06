import {ScreenSystem} from "./screen-system";
import {CanvasContextSystem} from "./canvas-context-system";
import {Transformation} from "../../transformation";
import { ConvexPolygon } from "../../areas/polygons/convex-polygon";
import { Instruction } from "../../instructions/instruction";

export class CoordinateSystemStack<TScreenSystem extends ScreenSystem<TCanvasContextSystem>, TCanvasContextSystem extends CanvasContextSystem>{
    public readonly infiniteCanvasContextBase: Transformation;
    public readonly inverseInfiniteCanvasContextBase: Transformation;
    constructor(public readonly screen: TScreenSystem){
        this.infiniteCanvasContextBase = screen.infiniteCanvasContextBase.before(screen.base);
        this.inverseInfiniteCanvasContextBase = screen.inverseBase.before(screen.inverseInfiniteCanvasContextBase);
    }
    public get userTransformation(): Transformation{return this.screen.userTransformation;}
    public setTransformationToTransformInfiniteCanvasContext(context: CanvasRenderingContext2D, infiniteCanvasContextTransformation: Transformation): void{
        this.screen.setTransformationToTransformInfiniteCanvasContext(context, infiniteCanvasContextTransformation);
    }
    public setCanvasContextTransformation(context: CanvasRenderingContext2D): void{
        this.screen.setCanvasContextTransformation(context);
    }
    public rebaseFromScreenContextToInfiniteCanvasContext(infiniteCanvasContextTransformation: Transformation, polygon: ConvexPolygon): ConvexPolygon{
        return this.screen.rebaseToInfiniteCanvasContext(infiniteCanvasContextTransformation, polygon);
    }
    public executeInTransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void{
        this.screen.executeInTransformedInfiniteCanvasContext(instruction, context);
    }
    public executeInUntransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void{
        this.screen.executeInUntransformedInfiniteCanvasContext(instruction, context);
    }
}
