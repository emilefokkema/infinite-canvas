import { TransformationRepresentation } from "../api-surface/transformation-representation";
import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Point } from "../geometry/point";
import { ViewboxInfinityProvider } from "../interfaces/viewbox-infinity-provider";
import { Transformation } from "../transformation";

export interface CanvasRectangle extends ViewboxInfinityProvider {
    viewboxWidth: number;
    viewboxHeight: number;
    polygon: ConvexPolygon;
    readonly infiniteCanvasContextBase: Transformation;
    readonly inverseInfiniteCanvasContextBase: Transformation;
    readonly transformation: Transformation;
    setTransformation(transformation: TransformationRepresentation): void;
    measure(): void;
    getCSSPosition(clientX: number, clientY: number): Point;
    getTransformationForInstruction(toTransformation: TransformationRepresentation): Transformation;
    translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: TransformationRepresentation): Transformation;
    getInitialTransformation(): Transformation;
    getBitmapTransformationToInfiniteCanvasContext(): Transformation;
    getBitmapTransformationToTransformedInfiniteCanvasContext(): Transformation;
    addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number): void;
}
