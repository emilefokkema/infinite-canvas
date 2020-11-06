import { ConvexPolygon } from "../../areas/polygons/convex-polygon";
import { Instruction } from "../../instructions/instruction";
import { Transformation } from "../../transformation";
export interface CoordinateSystems {
    withUserTransformation(transformation: Transformation): CoordinateSystems;
    withScreenTransformation(screenTransformation: Transformation, inverseScreenTransformation: Transformation): CoordinateSystems;
    setTransformationToTransformInfiniteCanvasContext(context: CanvasRenderingContext2D, infiniteCanvasContextTransformation: Transformation): void;
    executeInTransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void;
    executeInUntransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void;
    setCanvasContextTransformation(context: CanvasRenderingContext2D): void;
    rebaseFromScreenContextToInfiniteCanvasContext(infiniteCanvasContextTransformation: Transformation, polygon: ConvexPolygon): ConvexPolygon;
    readonly userTransformation: Transformation;
    readonly infiniteCanvasContextBase: Transformation;
    readonly inverseInfiniteCanvasContextBase: Transformation;
}
