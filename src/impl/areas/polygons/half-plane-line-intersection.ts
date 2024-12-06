import { Point } from "../../geometry/point";
import { HalfPlane } from "./half-plane";

export interface HalfPlaneLineIntersection{
    point: Point;
    halfPlane: HalfPlane;
}