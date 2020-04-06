import { LineSegment } from "../src/areas/line/line-segment";
import { ls, p, r } from "./builders";
import { empty } from "../src/areas/empty";
import { expectAreasToBeEqual } from "./expectations";
import { Area } from "../src/areas/area";
import { Point } from "../src/geometry/point";

describe("a line segment", () => {
    let lineSegment: LineSegment;

    beforeEach(() => {
        lineSegment = ls(ls => ls.from(0, 0).to(3, 0));
    });

    it.each([
        [ls(ls => ls.from(-1, 0).to(4, 0)), true, ls(ls => ls.from(0, 0).to(3, 0))],
        [ls(ls => ls.from(4, 0).to(-1, 0)), true, ls(ls => ls.from(0, 0).to(3, 0))],
        [ls(ls => ls.from(1, 0).to(2, 0)), true, ls(ls => ls.from(1, 0).to(2, 0))],
        [ls(ls => ls.from(2, 0).to(1, 0)), true, ls(ls => ls.from(1, 0).to(2, 0))],
        [ls(ls => ls.from(-1, 0).to(1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [ls(ls => ls.from(1, 0).to(-1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [ls(ls => ls.from(2, 0).to(4, 0)), true, ls(ls => ls.from(2, 0).to(3, 0))],
        [ls(ls => ls.from(4, 0).to(2, 0)), true, ls(ls => ls.from(2, 0).to(3, 0))],
        [ls(ls => ls.from(4, 0).to(5, 0)), false, empty],
        [ls(ls => ls.from(5, 0).to(4, 0)), false, empty],
        [ls(ls => ls.from(-2, 0).to(-1, 0)), false, empty],
        [ls(ls => ls.from(-1, 0).to(-2, 0)), false, empty],
        [ls(ls => ls.from(1, -1).to(1, 1)), false, empty],
        [ls(ls => ls.from(1, 1).to(1, -1)), false, empty],
        [ls(ls => ls.from(-1, -1).to(-1, 1)), false, empty],
        [ls(ls => ls.from(-1, 1).to(-1, -1)), false, empty],
        [ls(ls => ls.from(4, -1).to(4, 1)), false, empty],
        [ls(ls => ls.from(4, 1).to(4, -1)), false, empty],
        [ls(ls => ls.from(-1, 0).to(0, 0)), false, empty],
        [ls(ls => ls.from(0, 0).to(-1, 0)), false, empty],
        [ls(ls => ls.from(3, 0).to(4, 0)), false, empty],
        [ls(ls => ls.from(4, 0).to(3, 0)), false, empty]
    ])("should intersect the right line segments", (other: LineSegment, expectedToIntersect: boolean, expectedIntersection: Area) => {
        expect(lineSegment.intersectsLineSegment(other)).toBe(expectedToIntersect);
        expectAreasToBeEqual(lineSegment.intersectWithLineSegment(other), expectedIntersection);
    });

    it.each([
        [ls(ls => ls.from(-1, 0).to(4, 0)), true],
        [ls(ls => ls.from(4, 0).to(-1, 0)), true],
        [ls(ls => ls.from(-1, 0).to(3, 0)), true],
        [ls(ls => ls.from(3, 0).to(-1, 0)), true],
        [ls(ls => ls.from(-1, 0).to(2, 0)), false],
        [ls(ls => ls.from(2, 0).to(-1, 0)), false],
        [ls(ls => ls.from(0, -1).to(0, 1)), false],
        [ls(ls => ls.from(0, 1).to(0, -1)), false]
    ])("should be contained by the right line segments", (other: LineSegment, expectedToBeContained: boolean) => {
        expect(lineSegment.isContainedByLineSegment(other)).toBe(expectedToBeContained);
    });

    it.each([
        [new Point(-1, 0), ls(ls => ls.from(-1, 0).to(3, 0))],
        [new Point(0, 0), ls(ls => ls.from(0, 0).to(3, 0))],
        [new Point(1, 0), ls(ls => ls.from(0, 0).to(3, 0))],
        [new Point(3, 0), ls(ls => ls.from(0, 0).to(3, 0))],
        [new Point(4, 0), ls(ls => ls.from(0, 0).to(4, 0))],
        [new Point(0, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(0, 1).normal(-1, -3)))]
    ])("should result in the correct expansions with a point", (point: Point, expectedExpansion: Area) => {
        expectAreasToBeEqual(lineSegment.expandToIncludePoint(point), expectedExpansion);
    });

    it.each([
        [new Point(0, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(3, 0).normal(-1, 0))
            .with(hp => hp.base(0, 0).normal(0, 1)))],
        [new Point(0, -1), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(3, 0).normal(-1, 0))
            .with(hp => hp.base(0, 0).normal(0, -1)))],
        [new Point(1, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(3, 0).normal(-1, 1))
            .with(hp => hp.base(0, 0).normal(0, 1)))],
        [new Point(1, 0), r(r => r.base(0, 0).direction(1, 0))],
        [new Point(-1, 0), r(r => r.base(3, 0).direction(-1, 0))]
    ])("should result in the correct expansions with a point at infinity", (direction: Point, expectedExpansion: Area) => {
        expectAreasToBeEqual(lineSegment.expandToIncludeInfinityInDirection(direction), expectedExpansion)
    });
});