import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Transformation } from "../transformation";

export interface RectangleMeasurement{
    screenWidth: number;
    screenHeight: number;
    viewboxWidth: number;
    viewboxHeight: number;
    polygon: ConvexPolygon;
    screenTransformation: Transformation;
    inverseScreenTransformation: Transformation;
}