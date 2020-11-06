import { ScreenSystem } from "./screen-system";
import { CanvasContextSystem } from "./canvas-context-system";
import { Transformation } from "../../transformation";
import { ConvexPolygon } from "../../areas/polygons/convex-polygon";
import { Instruction } from "../../instructions/instruction";
export declare class CoordinateSystemStack<TScreenSystem extends ScreenSystem<TCanvasContextSystem>, TCanvasContextSystem extends CanvasContextSystem> {
    readonly screen: TScreenSystem;
    readonly infiniteCanvasContextBase: Transformation;
    readonly inverseInfiniteCanvasContextBase: Transformation;
    constructor(screen: TScreenSystem);
    get userTransformation(): Transformation;
    setTransformationToTransformInfiniteCanvasContext(context: CanvasRenderingContext2D, infiniteCanvasContextTransformation: Transformation): void;
    setCanvasContextTransformation(context: CanvasRenderingContext2D): void;
    rebaseFromScreenContextToInfiniteCanvasContext(infiniteCanvasContextTransformation: Transformation, polygon: ConvexPolygon): ConvexPolygon;
    executeInTransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void;
    executeInUntransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void;
}
