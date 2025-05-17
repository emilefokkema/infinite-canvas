import { beforeEach, describe, it, expect} from 'vitest'
import { Ray } from "src/areas/line/ray";
import { r, p, ls, l } from "./builders";
import { Point } from "src/geometry/point";
import { Area } from "src/areas/area";
import { expectAreasToBeEqual } from "./expectations";
import { LineSegment } from "src/areas/line/line-segment";
import { empty } from "src/areas/empty";

describe("a ray", () => {
    let ray: Ray;

    beforeEach(() => {
        ray = r(r => r.base(0, 0).direction(1, 0));
    });

    it.each([
        [new Point(-1, 0), r(r => r.base(-1, 0).direction(1, 0))],
        [new Point(0, 0), r(r => r.base(0, 0).direction(1, 0))],
        [new Point(1, 0), r(r => r.base(0, 0).direction(1, 0))],
        [new Point(1, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(1, 1).normal(0, -1))
            .with(hp => hp.base(1, 1).normal(1, -1)))],
        [new Point(-1, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(-1, 1).normal(0, -1))
            .with(hp => hp.base(-1, 1).normal(1, 1)))],
        [new Point(-1, -1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(-1, -1).normal(0, 1))
            .with(hp => hp.base(-1, -1).normal(1, -1)))],
        [new Point(1, -1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(1, -1).normal(0, 1))
            .with(hp => hp.base(1, -1).normal(1, 1)))]
    ])("should result in the correct expansions with a point", (point: Point, expectedExpansion: Area) => {
        expectAreasToBeEqual(ray.expandToIncludePoint(point), expectedExpansion);
    });

    it.each([
        [ls(ls => ls.from(-1, -1).to(-1, 1)), false, empty],
        [ls(ls => ls.from(-2, 0).to(-1, 0)), false, empty],
        [ls(ls => ls.from(-1, 0).to(0, 0)), false, empty],
        [ls(ls => ls.from(-1, 0).to(1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [ls(ls => ls.from(0, 0).to(1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [ls(ls => ls.from(1, 0).to(2, 0)), true, ls(ls => ls.from(1, 0).to(2, 0))]
    ])("should intersect the right line segments", (lineSegment: LineSegment, expectedToIntersect: boolean, expectedIntersection: Area) => {
        expect(ray.intersectsLineSegment(lineSegment)).toBe(expectedToIntersect);
        expectAreasToBeEqual(ray.intersectWithLineSegment(lineSegment), expectedIntersection);
    });

    it.each([
        [r(r => r.base(-1, 0).direction(-1, 0)), false, empty],
        [r(r => r.base(0, 0).direction(-1, 0)), false, empty],
        [r(r => r.base(0, 1).direction(-1, 0)), false, empty],
        [r(r => r.base(1, 1).direction(-1, 0)), false, empty],
        [r(r => r.base(1, 0).direction(-1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [r(r => r.base(1, 0).direction(1, 0)), true, r(r => r.base(1, 0).direction(1, 0))],
        [r(r => r.base(-1, 0).direction(1, 0)), true, r(r => r.base(0, 0).direction(1, 0))],
    ])("should intersect the right rays", (other: Ray, expectedToIntersect: boolean, expectedIntersection: Area) => {
        expect(ray.intersectsRay(other)).toBe(expectedToIntersect);
        expectAreasToBeEqual(ray.intersectWithRay(other), expectedIntersection);
    });

    it.each([
        [new Point(1, 0), r(r => r.base(0, 0).direction(1, 0))],
        [new Point(0, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(0, 0).normal(1, 0)))],
        [new Point(-1, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(0, 0).normal(1, 1)))],
        [new Point(0, -1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(0, 0).normal(1, 0)))],
        [new Point(-1, 0), l(l => l.base(0, 0).direction(1, 0))]
    ])("should result in the correct expansions with a point at infinity", (direction: Point, expectedExpansion: Area) => {
        expectAreasToBeEqual(ray.expandToIncludeInfinityInDirection(direction), expectedExpansion)
    });
});
