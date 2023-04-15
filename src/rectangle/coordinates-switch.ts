import { CanvasMeasurement } from "./canvas-measurement";
import { Units } from "../api-surface/units";
import { Transformation } from "../transformation";
import { CoordinateSystem } from "./coordinate-system";

export interface CoordinatesSwitch {
    readonly userTransformation: Transformation;
    readonly infiniteCanvasContext: CoordinateSystem;
    readonly initialBitmapTransformation: Transformation;
    setUserTransformation(userTransformation: Transformation): void;
    useUnits(units: Units): void
    setCanvasMeasurement(measurement: CanvasMeasurement): void;
    getBitmapTransformationToInfiniteCanvasContext(): Transformation;
    getBitmapTransformationToTransformedInfiniteCanvasContext(): Transformation;
    getInitialTransformationForTransformedInfiniteCanvasContext(infiniteCanvasContextTransformation: Transformation): Transformation;
    translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: Transformation): Transformation;
}