import { ConvexPolygon } from "../src/areas/polygons/convex-polygon";
import { Point } from "../src/geometry/point";
import { HalfPlane } from "../src/areas/polygons/half-plane";
import { LineSegment } from "../src/areas/line/line-segment";
import { Ray } from "../src/areas/line/ray";
import { Line } from "../src/areas/line/line";

class PolygonBuilder{
    private halfPlanes: HalfPlane[] = [];
    public build(): ConvexPolygon{
        return new ConvexPolygon(this.halfPlanes);
    }
    public with(halfPlaneBuilder: (builder: HalfPlaneBuilder) => HalfPlaneBuilder): PolygonBuilder{
        this.halfPlanes.push(hp(halfPlaneBuilder));
        return this;
    }
}
class HalfPlaneBuilder{
    private _base: Point;
    private normalTowardInterior: Point;
    public build(): HalfPlane{
        return new HalfPlane(this._base, this.normalTowardInterior);
    }
    public base(x: number, y: number): HalfPlaneBuilder{
        this._base = new Point(x, y);
        return this;
    }
    public normal(x: number, y: number): HalfPlaneBuilder{
        this.normalTowardInterior = new Point(x, y);
        return this;
    }
}
class LineSegmentBuilder{
    private point1: Point;
    private point2: Point;
    public build(): LineSegment{
        return new LineSegment(this.point1, this.point2);
    }
    public from(x: number, y: number): LineSegmentBuilder{
        this.point1 = new Point(x, y);
        return this;
    }
    public to(x: number, y: number): LineSegmentBuilder{
        this.point2 = new Point(x, y);
        return this;
    }
}
class RayBuilder{
    private _base: Point;
    private _direction: Point;
    public build(): Ray{
        return new Ray(this._base, this._direction);
    }
    public base(x: number, y: number): RayBuilder{
        this._base = new Point(x, y);
        return this;
    }
    public direction(x: number, y: number): RayBuilder{
        this._direction = new Point(x, y);
        return this;
    }
}
class LineBuilder{
    private _base: Point;
    private _direction: Point;
    public build(): Line{
        return new Line(this._base, this._direction);
    }
    public base(x: number, y: number): LineBuilder{
        this._base = new Point(x, y);
        return this;
    }
    public direction(x: number, y: number): LineBuilder{
        this._direction = new Point(x, y);
        return this;
    }
}
function hp(builder: (builder: HalfPlaneBuilder) => HalfPlaneBuilder): HalfPlane{
    return builder(new HalfPlaneBuilder()).build();
}
function p(builder: (builder: PolygonBuilder) => PolygonBuilder): ConvexPolygon{
    return builder(new PolygonBuilder()).build();
}
function ls(builder: (builder: LineSegmentBuilder) => LineSegmentBuilder){
    return builder(new LineSegmentBuilder()).build();
}
function r(builder: (builder: RayBuilder) => RayBuilder): Ray{
    return builder(new RayBuilder()).build();
}
function l(builder: (builder: LineBuilder) => LineBuilder): Line{
    return builder(new LineBuilder()).build();
}
export {hp, p, ls, r, l};

