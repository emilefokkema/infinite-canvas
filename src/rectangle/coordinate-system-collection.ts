import { Transformation } from "../transformation";
import { CoordinateSystem } from "./coordinate-system";

export interface CoordinateSystemCollection {
    readonly userCoordinates: CoordinateSystem;
    readonly infiniteCanvasContext: CoordinateSystem;
    readonly canvasBitmap: CoordinateSystem;
    readonly initialBitmapTransformation: Transformation;
    readonly icContextFromCanvasBitmap: CoordinateSystem;
    readonly userCoordinatesInsideCanvasBitmap: CoordinateSystem;
    setUserTransformation(userTransformation: Transformation): void;
    setCanvasBitmapDistortion(canvasBitmapDistortion: Transformation): void;
}