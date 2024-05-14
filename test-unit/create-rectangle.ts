import { ConvexPolygon } from "../src/areas/polygons/convex-polygon";
import { HalfPlane } from "../src/areas/polygons/half-plane";
import { Point } from "../src/geometry/point";

export function createRectangle(
    x: number,
    y: number,
    width: number,
    height: number
): ConvexPolygon{
    const toRight = new Point(1, 0);
    const toLeft = new Point(-1, 0);
    const up = new Point(0, -1);
    const down = new Point(0, 1);
    return new ConvexPolygon([
        new HalfPlane(new Point(x, 0), width > 0 ? toRight: toLeft),
        new HalfPlane(new Point(x + width, 0), width > 0 ? toLeft : toRight),
        new HalfPlane(new Point(0, y), height > 0 ? down: up),
        new HalfPlane(new Point(0, y + height), height > 0 ? up: down)
    ]);
}