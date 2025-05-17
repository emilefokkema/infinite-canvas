import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Point } from "../geometry/point";
import { CoordinateSystem } from "./coordinate-system";
import { CanvasMeasurement } from "./canvas-measurement";
import { Transformation } from "../transformation";
import { TransformationRepresentation } from "api/transformation-representation";
import { Units } from "api/units";

export interface CanvasRectangle{
    readonly viewboxWidth: number;
    readonly viewboxHeight: number;
    readonly polygon: ConvexPolygon;
    readonly userTransformation: Transformation;
    readonly infiniteCanvasContext: CoordinateSystem;
    readonly initialBitmapTransformation: Transformation;
    addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number, counterclockwise: boolean): void;
    getCSSPosition(clientX: number, clientY: number): Point;
    getTransformationForInstruction(infiniteCanvasContextTransformation: TransformationRepresentation): Transformation;
    translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: TransformationRepresentation): Transformation;
    getBitmapTransformationToTransformedInfiniteCanvasContext(): Transformation;
    getBitmapTransformationToInfiniteCanvasContext(): Transformation;
    withMeasurement(measurement: CanvasMeasurement): CanvasRectangle
    withTransformation(transformation: TransformationRepresentation): CanvasRectangle
    withUnits(units: Units): CanvasRectangle
}