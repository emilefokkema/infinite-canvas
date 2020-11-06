import { CoordinateSystem } from "./coordinate-system";
import { CanvasContextSystem } from "./canvas-context-system";
import { Transformation } from "../../transformation";
import { ConvexPolygon } from "../../areas/polygons/convex-polygon";
import { Instruction } from "../../instructions/instruction";
export declare class ScreenSystem<TCanvasContextSystem extends CanvasContextSystem> extends CoordinateSystem {
    readonly canvasContextSystem: TCanvasContextSystem;
    readonly infiniteCanvasContextBase: Transformation;
    readonly inverseInfiniteCanvasContextBase: Transformation;
    constructor(base: Transformation, inverseBase: Transformation, canvasContextSystem: TCanvasContextSystem);
    get userTransformation(): Transformation;
    setTransformationToTransformInfiniteCanvasContext(context: CanvasRenderingContext2D, infiniteCanvasContextTransformation: Transformation): void;
    setCanvasContextTransformation(context: CanvasRenderingContext2D): void;
    rebaseToInfiniteCanvasContext(infiniteCanvasContextTransformation: Transformation, polygon: ConvexPolygon): ConvexPolygon;
    executeInTransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void;
    executeInUntransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void;
}
