import {describe, it, expect, beforeEach } from '@jest/globals';
import { ConvexPolygon } from "../src/areas/polygons/convex-polygon";
import { HalfPlane } from "../src/areas/polygons/half-plane";
import { Point } from "../src/geometry/point";
import { PolygonVertex } from "../src/areas/polygons/polygon-vertex";
import { Area } from "../src/areas/area";
import { plane } from "../src/areas/plane";
import { Transformation } from "../src/transformation";
import { empty } from "../src/areas/empty";
import { LineSegment } from "../src/areas/line/line-segment";
import { p, ls, hp, r, l } from "./builders";
import { expectPolygonsToBeEqual, expectAreasToBeEqual } from "./expectations";
import { Ray } from "../src/areas/line/ray";
import { Line } from "../src/areas/line/line";

describe("this other convex polygon", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(-141.056193662169, -228.2245820892264).normal(1.6150955140898589, -0))
            .with(hp => hp.base(-141.056193662169, -228.2245820892264).normal(0, 1.6150955140898589))
            .with(hp => hp.base(828.0011147917512, 740.8327263646938).normal(0, -1.6150955140899441))
            .with(hp => hp.base(828.0011147917513, -228.2245820892264).normal(-328.2245820892264, 0)));
    });

    it("should result in an expansion without duplicate vertices", () => {
        const expansion: ConvexPolygon = convexPolygon.expandToIncludePoint(new Point(100, 740.8327263646939));
        const distinctVertices: Point[] = [];
        for(let vertex of expansion.vertices){
            if(!distinctVertices.find(p => p.equals(vertex.point))){
                distinctVertices.push(vertex.point);
            }
        }
        expect(expansion.vertices.length === distinctVertices.length).toBe(true);
    });
});

describe("this convex polygon", () => {
    let convexPolygon: ConvexPolygon;
    let halfPlane: HalfPlane;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(-402.1340461764957, -361.10791810591667).normal(1.7993598633201486, 0.5432587720044353))
            .with(hp => hp.base(-402.1340461764957, -361.10791810591667).normal(-0.5432587720044353, 1.7993598633201486))
            .with(hp => hp.base(-25.303718781786813, 341.67767249145567).normal(0.5432587720043784, -1.7993598633200918))
            .with(hp => hp.base(-25.303718781786813, 341.67767249145567).normal(-291.67767249145567, -162.97763160132547)));
        halfPlane = hp(hp => hp.base(256.30589115559, -162.3131805520412).normal(-503.9908530434968, -206.30589115559002));
    });

    it("should expand to a convex polygon that fits within these bounds", () => {
        const expansion: ConvexPolygon = convexPolygon.expandToIncludePoint(new Point(50, 341.67767249145567));
        expect(expansion.vertices.find(v => v.point.x < -570 || v.point.x > 260)).toBeFalsy();
        expect(expansion.vertices.find(v => v.point.y < -370 || v.point.y > 350)).toBeFalsy();
    });
});
describe("a rectangle", () => {
    let rectangle: ConvexPolygon;

    beforeEach(() => {
        rectangle = ConvexPolygon.createRectangle(0, 0, 1, 1);
    });

    describe("when it is expanded to include a point", () => {
        let expansion: ConvexPolygon;

        beforeEach(() => {
            expansion = rectangle.expandToIncludePoint(new Point(2, 0));
        });

        it("should result in an expansion all of whose vertices refer to two of its half planes", () => {
            const halfPlanes: HalfPlane[] = expansion.halfPlanes;
            const vertices: PolygonVertex[] = expansion.vertices;
            for(let vertex of vertices){
                expect(halfPlanes.indexOf(vertex.halfPlane1) > -1).toBe(true);
                expect(halfPlanes.indexOf(vertex.halfPlane2) > -1).toBe(true);
            }
        });
    });

    it.each([[ConvexPolygon.createRectangle(2, 2, 1, 1), p(p => p
        .with(hp => hp.base(0, 0).normal(0, 1))
        .with(hp => hp.base(0, 0).normal(1, 0))
        .with(hp => hp.base(3, 3).normal(0, -1))
        .with(hp => hp.base(3, 3).normal(-1, 0))
        .with(hp => hp.base(1, 0).normal(-1, 1))
        .with(hp => hp.base(0, 1).normal(1, -1)))]])('should be joined to other areas in the right way', (areaToJoin: Area, expectedResult: Area) => {
            const result = rectangle.join(areaToJoin);
            expectAreasToBeEqual(result, expectedResult)
    })

    it.each([
        [new Point(0, 1), new Point(0, 1), new Point(0, 1)],
        [new Point(0, 1), new Point(0, -1), new Point(0, 0)],
        [new Point(0, 1), new Point(-1, 0), new Point(0, 1)],
        [new Point(0, 1), new Point(1, 0), new Point(1, 1)],
        [new Point(0, 1), new Point(1, -1), new Point(1, 0)],
        [new Point(0, 1), new Point(1, 1), new Point(0.5, 1.5)],
        [new Point(0.5, 1.5), new Point(1, 1), new Point(0.5, 1.5)],
        [new Point(1.5, 1.5), new Point(1, 1), new Point(1.5, 1.5)],
        [new Point(0, 1), new Point(-1, -1), new Point(-0.5, 0.5)],
        [new Point(1, 2), new Point(1, 1), new Point(1, 2)],
        [new Point(1, 2), new Point(1, 0), new Point(1, 2)],
        [new Point(1, 2), new Point(1, -1), new Point(2, 1)]
    ])("should have the correct points in front in different directions", (point: Point, direction: Point, expectedPointInFront: Point) => {
        const result: Point = rectangle.getPointInFrontInDirection(point, direction);
        expect(result.x).toBeCloseTo(expectedPointInFront.x);
        expect(result.y).toBeCloseTo(expectedPointInFront.y);
    });

    it("should be transformed the right way", () => {
        const transformed: ConvexPolygon = rectangle.transform(new Transformation(1, 1, 0, 1, 0, 0));
        expectPolygonsToBeEqual(transformed, p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(0, 0).normal(-1, 1))
            .with(hp => hp.base(1, 2).normal(-1, 0))
            .with(hp => hp.base(1, 2).normal(1, -1))));
    });

    it.each([
        [new Point(0, 1), false],
        [new Point(-1, 0), false],
        [new Point(1, 1), false],
        [new Point(-1, 1), false],
        [new Point(1, 0), false],
        [new Point(1, -1), false],
        [new Point(-1, -1), false],
        [new Point(0, -1), false]
    ])("should contain infinity in the right directions", (direction: Point, expectedToContainInfinityInDirection: boolean) => {
        expect(rectangle.containsInfinityInDirection(direction)).toBe(expectedToContainInfinityInDirection);
    });

    it.each([
        [l(l => l.base(0, -1).direction(1, 0)), false, empty],
        [l(l => l.base(0, -1).direction(-1, 0)), false, empty],
        [l(l => l.base(0, 0).direction(1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [l(l => l.base(0, 0).direction(-1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [l(l => l.base(-1, 0).direction(1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [l(l => l.base(-1, 0).direction(-1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [l(l => l.base(2, 0).direction(-1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [l(l => l.base(2, 0).direction(1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [l(l => l.base(0.5, 0).direction(1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [l(l => l.base(0.5, 0).direction(-1, 0)), true, ls(ls => ls.from(0, 0).to(1, 0))],
        [l(l => l.base(0.5, 0.5).direction(1, 0)), true, ls(ls => ls.from(0, 0.5).to(1, 0.5))],
        [l(l => l.base(0.5, 0.5).direction(-1, 0)), true, ls(ls => ls.from(0, 0.5).to(1, 0.5))],
        [l(l => l.base(-2, 0.5).direction(1, 0)), true, ls(ls => ls.from(0, 0.5).to(1, 0.5))],
        [l(l => l.base(-2, 0.5).direction(-1, 0)), true, ls(ls => ls.from(0, 0.5).to(1, 0.5))],
        [l(l => l.base(-1, 0).direction(1, 1)), false, empty],
    ])("should intersect the right lines", (line: Line, expectedToIntersect: boolean, expectedIntersection: Area) => {
        expect(line.intersectsConvexPolygon(rectangle)).toBe(expectedToIntersect);
        expectAreasToBeEqual(line.intersectWithConvexPolygon(rectangle), expectedIntersection);
    });

    it.each([
        [ls(ls => ls.from(0, -1).to(1, -1)), empty],
        [ls(ls => ls.from(-1, 0.5).to(2, 0.5)), ls(ls => ls.from(0, 0.5).to(1, 0.5))],
        [ls(ls => ls.from(0, 0).to(1, 0)), ls(ls => ls.from(0, 0).to(1, 0))],
        [ls(ls => ls.from(0, 0).to(1, 1)), ls(ls => ls.from(0, 0).to(1, 1))],
        [ls(ls => ls.from(0.25, 0.5).to(0.75, 0.5)), ls(ls => ls.from(0.25, 0.5).to(0.75, 0.5))],
        [ls(ls => ls.from(-2, 0.5).to(-1, 0.5)), empty],
        [ls(ls => ls.from(-0.5, 0.5).to(0.5, 0.5)), ls(ls => ls.from(0, 0.5).to(0.5, 0.5))],
        [ls(ls => ls.from(-1, 0).to(0, 1)), empty],
    ])("should lead to the correct intersections with line segments", (lineSegment: LineSegment, expectedIntersection: Area) => {
        expectAreasToBeEqual(lineSegment.intersectWithConvexPolygon(rectangle), expectedIntersection);
    });

    it.each([
        [r(r => r.base(0, -1).direction(1, 0)), empty],
        [r(r => r.base(-1, 0.5).direction(1, 0)), ls(ls => ls.from(0, 0.5).to(1, 0.5))],
        [r(r => r.base(2, 0.5).direction(-1, 0)), ls(ls => ls.from(0, 0.5).to(1, 0.5))],
        [r(r => r.base(0, 0).direction(1, 0)), ls(ls => ls.from(0, 0).to(1, 0))],
        [r(r => r.base(0, 0).direction(1, 1)), ls(ls => ls.from(0, 0).to(1, 1))],
        [r(r => r.base(0.5, 0.5).direction(1, 0)), ls(ls => ls.from(0.5, 0.5).to(1, 0.5))],
        [r(r => r.base(0.5, 0.5).direction(-1, 0)), ls(ls => ls.from(0, 0.5).to(0.5, 0.5))],
        [r(r => r.base(0.5, 0.5).direction(1, 1)), ls(ls => ls.from(0.5, 0.5).to(1, 1))],
        [r(r => r.base(-1, 0.5).direction(-1, 0)), empty],
        [r(r => r.base(-1, 0).direction(1, 1)), empty],
    ])("should lead to the correct intersections with rays", (ray: Ray, expectedIntersection: Area) => {
        expectAreasToBeEqual(ray.intersectWithConvexPolygon(rectangle), expectedIntersection);
    });

    it.each([
        [ls(ls => ls.from(0, -1).to(1, -1)), false],
        [ls(ls => ls.from(-1, 0.5).to(2, 0.5)), true],
        [ls(ls => ls.from(0, 0).to(1, 0)), true],
        [ls(ls => ls.from(0, 0).to(1, 1)), true],
        [ls(ls => ls.from(0.25, 0.5).to(0.75, 0.5)), true],
        [ls(ls => ls.from(-2, 0.5).to(-1, 0.5)), false],
        [ls(ls => ls.from(-0.5, 0.5).to(0.5, 0.5)), true],
        [ls(ls => ls.from(-1, 0).to(0, 1)), false],
        [ls(ls => ls.from(-1, 0).to(0, 0)), false],
        [ls(ls => ls.from(-1, 0).to(0.5, 0)), true],
    ])("should intersect the right line segments", (lineSegment: LineSegment, expectedToIntersect: boolean) => {
        expect(lineSegment.intersectsConvexPolygon(rectangle)).toBe(expectedToIntersect);
    });

    it.each([
        [r(r => r.base(0, 0).direction(1, 0)), true],
        [r(r => r.base(0, 0).direction(-1, 0)), false],
        [r(r => r.base(0.5, 0).direction(-1, 0)), true],
        [r(r => r.base(0.5, 0).direction(1, 0)), true],
        [r(r => r.base(1, 0).direction(1, 0)), false],
        [r(r => r.base(1, 0).direction(-1, 0)), true],
        [r(r => r.base(-1, 0).direction(1, 2)), false],
        [r(r => r.base(-1, 0).direction(1, 1)), false],
        [r(r => r.base(-1, 0).direction(2, 1)), true],
    ])("should intersect the right rays", (ray: Ray, expectedToIntersect: boolean) => {
        expect(ray.intersectsConvexPolygon(rectangle)).toBe(expectedToIntersect);
    });

    it.each([
        [new Point(0, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(1, 0).normal(-1, 0)))],
        [new Point(1, 1), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(1, 0).normal(-1, 1))
            .with(hp => hp.base(0, 1).normal(1, -1)))]
    ])("should result in the correct expansions with infinity in a direction", (directionOfInfinity: Point, expectedExpansion: ConvexPolygon) => {
        expectAreasToBeEqual(rectangle.expandToIncludeInfinityInDirection(directionOfInfinity), expectedExpansion);
    });
});

describe("a convex polygon with one half plane", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p.with(hp => hp.base(0, -2).normal(0, 1)));
    });

    it.each([
        [hp(b => b.base(0, -1).normal(0, 1)), false],
        [hp(b => b.base(0, -1).normal(0, -1)), false],
        [hp(b => b.base(0, -2).normal(0, 1)), true],
        [hp(b => b.base(0, -2).normal(0, -1)), false],
        [hp(b => b.base(0, -3).normal(0, 1)), true],
        [hp(b => b.base(0, -3).normal(0, -1)), false],
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [ls(ls => ls.from(0, -3).to(0, 3)), ls(ls => ls.from(0, -2).to(0, 3))],
        [ls(ls => ls.from(0, -3).to(0, -6)), empty],
        [ls(ls => ls.from(0, -3).to(1, -6)), empty],
        [ls(ls => ls.from(0, -3).to(1, -3)), empty],
        [ls(ls => ls.from(0, -2).to(1, -2)), ls(ls => ls.from(0, -2).to(1, -2))],
        [ls(ls => ls.from(0, 1).to(1, 1)), ls(ls => ls.from(0, 1).to(1, 1))],
        [ls(ls => ls.from(0, 1).to(1, 2)), ls(ls => ls.from(0, 1).to(1, 2))],
    ])("should lead to the correct intersections with line segments", (lineSegment: LineSegment, expectedIntersection: Area) => {
        expectAreasToBeEqual(lineSegment.intersectWithConvexPolygon(convexPolygon), expectedIntersection);
    });

    it.each([
        [r(r => r.base(0, -3).direction(1, 0)), empty],
        [r(r => r.base(0, -2).direction(1, 0)), r(r => r.base(0, -2).direction(1, 0))],
        [r(r => r.base(0, -2).direction(-1, 0)), r(r => r.base(0, -2).direction(-1, 0))],
        [r(r => r.base(0, 0).direction(1, 0)), r(r => r.base(0, 0).direction(1, 0))],
        [r(r => r.base(0, 0).direction(-1, 0)), r(r => r.base(0, 0).direction(-1, 0))],
        [r(r => r.base(0, 0).direction(0, -1)), ls(ls => ls.from(0, 0).to(0, -2))],
        [r(r => r.base(0, 0).direction(0, 1)), r(r => r.base(0, 0).direction(0, 1))],
        [r(r => r.base(0, -3).direction(0, 1)), r(r => r.base(0, -2).direction(0, 1))],
        [r(r => r.base(0, -2).direction(0, -1)), empty],
    ])("should lead to the correct intersections with rays", (ray: Ray, expectedIntersection: Area) => {
        expectAreasToBeEqual(ray.intersectWithConvexPolygon(convexPolygon), expectedIntersection);
    });

    it.each([
        [l(l => l.base(0, -1).direction(1, 0)), true, l(l => l.base(0, -1).direction(1, 0))],
        [l(l => l.base(0, -3).direction(1, 0)), false, empty],
        [l(l => l.base(0, -2).direction(1, 0)), true, l(l => l.base(0, -2).direction(1, 0))],
        [l(l => l.base(0, -2).direction(-1, 0)), true, l(l => l.base(0, -2).direction(1, 0))],
        [l(l => l.base(0, -2).direction(0, 1)), true, r(r => r.base(0, -2).direction(0, 1))],
        [l(l => l.base(0, -2).direction(0, -1)), true, r(r => r.base(0, -2).direction(0, 1))],
        [l(l => l.base(0, -3).direction(0, 1)), true, r(r => r.base(0, -2).direction(0, 1))],
        [l(l => l.base(0, -3).direction(0, -1)), true, r(r => r.base(0, -2).direction(0, 1))],
        [l(l => l.base(0, -1).direction(0, 1)), true, r(r => r.base(0, -2).direction(0, 1))],
        [l(l => l.base(0, -1).direction(0, -1)), true, r(r => r.base(0, -2).direction(0, 1))],
    ])("should intersect the right lines", (line: Line, expectedToIntersect: boolean, expectedIntersection: Area) => {
        expect(line.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
        expectAreasToBeEqual(line.intersectWithConvexPolygon(convexPolygon), expectedIntersection);
    });

    it.each([
        [ls(ls => ls.from(0, -3).to(0, 3)), true],
        [ls(ls => ls.from(0, -3).to(0, -6)), false],
        [ls(ls => ls.from(0, -3).to(1, -6)), false],
        [ls(ls => ls.from(0, -3).to(1, -3)), false],
        [ls(ls => ls.from(0, -2).to(1, -2)), true],
        [ls(ls => ls.from(0, -2).to(1, -3)), false],
        [ls(ls => ls.from(0, -2).to(1, 3)), true],
        [ls(ls => ls.from(0, 1).to(1, 1)), true],
        [ls(ls => ls.from(0, 1).to(1, 2)), true],
    ])("should intersect the right line segments", (lineSegment: LineSegment, expectedToIntersect: boolean) => {
        expect(lineSegment.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
    });

    it.each([
        [r(r => r.base(0, 0).direction(1, 0)), true],
        [r(r => r.base(0, 0).direction(1, -1)), true],
        [r(r => r.base(0, 0).direction(1, 1)), true],
        [r(r => r.base(0, -2).direction(1, 0)), true],
        [r(r => r.base(0, -2).direction(1, -1)), false],
        [r(r => r.base(0, -2).direction(1, 1)), true],
        [r(r => r.base(0, -3).direction(1, 0)), false],
        [r(r => r.base(0, -3).direction(-1, 0)), false],
        [r(r => r.base(0, -3).direction(-1, 1)), true],
        [r(r => r.base(0, -3).direction(-1, -1)), false],
        [r(r => r.base(0, -3).direction(1, -1)), false],
        [r(r => r.base(0, -3).direction(1, 1)), true],
    ])("should intersect the right rays", (ray: Ray, expectedToIntersect: boolean) => {
        expect(ray.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
    });

    it.each([
        [new Point(0, 1), p(p => p
            .with(hp => hp.base(0, -2).normal(0, 1)))],
        [new Point(1, 0), p(p => p
            .with(hp => hp.base(0, -2).normal(0, 1)))],
        [new Point(-1, 0), p(p => p
            .with(hp => hp.base(0, -2).normal(0, 1)))],
        [new Point(0, -1), plane],
    ])("should result in the correct expansions with infinity in a direction", (directionOfInfinity: Point, expectedExpansion: ConvexPolygon) => {
        expectAreasToBeEqual(convexPolygon.expandToIncludeInfinityInDirection(directionOfInfinity), expectedExpansion);
    });

    it.each([
        [new Point(0, 1), true],
        [new Point(-1, 0), true],
        [new Point(1, 1), true],
        [new Point(-1, 1), true],
        [new Point(1, 0), true],
        [new Point(1, -1), false],
        [new Point(-1, -1), false],
        [new Point(0, -1), false]
    ])("should contain infinity in the right directions", (direction: Point, expectedToContainInfinityInDirection: boolean) => {
        expect(convexPolygon.containsInfinityInDirection(direction)).toBe(expectedToContainInfinityInDirection);
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), p(p => p.with(hp => hp.base(0, -2).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, -3).normal(0, 1))), p(p => p.with(hp => hp.base(0, -3).normal(0, 1)))],
        [plane, plane],
        [p(p => p.with(hp => hp.base(0, -3).normal(1, 0))), plane],
    ])('should join to other areas in the right way', (areaToJoin: Area, expectedResult: Area) => {
        expectAreasToBeEqual(convexPolygon.join(areaToJoin), expectedResult)
    })
});

describe("a convex polygon with three half planes and two vertices", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))
    });

    it("should have the correct vertices", () => {
        expect(convexPolygon.vertices.length).toBe(2);
        const borderPointsLeftOfYAxis: PolygonVertex[] = convexPolygon.vertices.filter(v => v.point.x < 0);
        expect(borderPointsLeftOfYAxis.length).toBe(1);
        const pointLeftOfYAxis: PolygonVertex = borderPointsLeftOfYAxis[0];
        expect(pointLeftOfYAxis.point.x).toBeCloseTo(-1);
        expect(pointLeftOfYAxis.point.y).toBeCloseTo(-1);

        const borderPointsRightOfYAxis: PolygonVertex[] = convexPolygon.vertices.filter(v => v.point.x > 0);
        expect(borderPointsRightOfYAxis.length).toBe(1);
        const pointRightOfYAxis: PolygonVertex = borderPointsRightOfYAxis[0];
        expect(pointRightOfYAxis.point.x).toBeCloseTo(1);
        expect(pointRightOfYAxis.point.y).toBeCloseTo(-1);
    });

    it.each([
        [new Point(2, -1), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(1, -1).normal(-1, -2)))],
        [new Point(1, -1), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],
        [new Point(0, -1), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],
        [new Point(1, 0), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1)))],
        [new Point(2, 1), p(p => p
            .with(hp => hp.base(-1, -1).normal(1, -2))
            .with(hp => hp.base(-1, -1).normal(1, -1)))],
        [new Point(1, 1), p(p => p
            .with(hp => hp.base(-1, -1).normal(1, -1)))],
        [new Point(0, 1), plane],
    ])("should result in the correct expansions with infinity in a direction", (directionOfInfinity: Point, expectedExpansion: ConvexPolygon) => {
        expectAreasToBeEqual(convexPolygon.expandToIncludeInfinityInDirection(directionOfInfinity), expectedExpansion);
    });

    it.each([
        [new Point(0, 1), false],
        [new Point(-1, 0), false],
        [new Point(1, 1), false],
        [new Point(-1, 1), false],
        [new Point(1, 0), false],
        [new Point(1, -1), true],
        [new Point(-1, -1), true],
        [new Point(0, -1), true]
    ])("should contain infinity in the right directions", (direction: Point, expectedToContainInfinityInDirection: boolean) => {
        expect(convexPolygon.containsInfinityInDirection(direction)).toBe(expectedToContainInfinityInDirection);
    });

    it("should have the correct half planes", () => {
        expect(convexPolygon.halfPlanes.length).toBe(3);
    });

    it.each([
        [r(r => r.base(-1, -1).direction(-1, -1)), r(r => r.base(-1, -1).direction(-1, -1))],
        [r(r => r.base(0, 0).direction(-1, -1)), r(r => r.base(-1, -1).direction(-1, -1))],
        [r(r => r.base(-1, -1).direction(0, -1)), r(r => r.base(-1, -1).direction(0, -1))],
        [r(r => r.base(-1, -1).direction(1, 0)), ls(ls => ls.from(-1, -1).to(1, -1))],
        [r(r => r.base(-1, -1).direction(1, -1)), r(r => r.base(-1, -1).direction(1, -1))],
        [r(r => r.base(-1, -1).direction(2, -1)), ls(ls => ls.from(-1, -1).to(3, -3))],
        [r(r => r.base(1, -1).direction(-1, 0)), ls(ls => ls.from(-1, -1).to(1, -1))],
        [r(r => r.base(-1, 0).direction(0, -1)), r(r => r.base(-1, -1).direction(0, -1))],
        [r(r => r.base(0, 0).direction(0, -1)), r(r => r.base(0, -1).direction(0, -1))],
        [r(r => r.base(-1, -2).direction(0, -1)), r(r => r.base(-1, -2).direction(0, -1))],
        [r(r => r.base(-3, -2).direction(1, 0)), ls(ls => ls.from(-2, -2).to(2, -2))],
        [r(r => r.base(-2, -2).direction(1, 0)), ls(ls => ls.from(-2, -2).to(2, -2))],
        [r(r => r.base(-1, -2).direction(1, 0)), ls(ls => ls.from(-1, -2).to(2, -2))],
        [r(r => r.base(3, -2).direction(-1, 0)), ls(ls => ls.from(-2, -2).to(2, -2))],
        [r(r => r.base(-3, -1).direction(1, 0)), ls(ls => ls.from(-1, -1).to(1, -1))],
        [r(r => r.base(-3, 0).direction(1, 0)), empty],
    ])("should lead to the correct intersections with rays", (ray: Ray, expectedIntersection: Area) => {
        expectAreasToBeEqual(ray.intersectWithConvexPolygon(convexPolygon), expectedIntersection);
    });

    it.each([
        [new Point(-2, -1), p(p => p
            .with(hp => hp.base(-3, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],
        [new Point(0, -0.5), p(p => p
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1))
            .with(hp => hp.base(0, -0.5).normal(0.5, -1))
            .with(hp => hp.base(0, -0.5).normal(-0.5, -1)))],
        [new Point(0, 0), p(p => p
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1)))],
        [new Point(0, 1), p(p => p
            .with(hp => hp.base(0, 1).normal(-1, -1))
            .with(hp => hp.base(0, 1).normal(1, -1)))]
    ])("should result in the correct expansions with a point", (expandWith: Point, expectedExpansion: ConvexPolygon) => {
        expectPolygonsToBeEqual(convexPolygon.expandToIncludePoint(expandWith), expectedExpansion);
    });

    it.each([
        //intersect with a half-plane with a horizontal border
        [p(p => p.with(hp => hp.base(0, 0).normal(0, 1))), undefined],

        [p(p => p.with(hp => hp.base(0, 0).normal(0, -1))), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],

        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), undefined],

        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],

        [p(p => p.with(hp => hp.base(0, -2).normal(0, 1))), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1))
            .with(hp => hp.base(0, -2).normal(0, 1)))],

        [p(p => p.with(hp => hp.base(0, -2).normal(0, -1))), p(p => p
            .with(hp => hp.base(0, -2).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],
        //intersect with a half-plane with a vertical border
        [p(p => p
            .with(hp => hp.base(-2, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(-2, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1)))],
        
        [p(p => p
            .with(hp => hp.base(-1, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(-1, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1)))],

        [p(p => p
            .with(hp => hp.base(0, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],
        
        [p(p => p
            .with(hp => hp.base(1, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(1, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],
        
        [p(p => p
            .with(hp => hp.base(2, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(2, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],
        //two half planes, vertex directed upwards
        [p(p => p
            .with(hp => hp.base(0, -2).normal(-1, -1))
            .with(hp => hp.base(0, -2).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -2).normal(-1, -1))
            .with(hp => hp.base(0, -2).normal(1, -1)))],
        
        [p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1)))],

        [p(p => p
            .with(hp => hp.base(0, -0.5).normal(-1, -1))
            .with(hp => hp.base(0, -0.5).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -0.5).normal(-1, -1))
            .with(hp => hp.base(0, -0.5).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],

        [p(p => p
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],
        
        // two half planes, vertex directed downwards
        [p(p => p
            .with(hp => hp.base(0, -1).normal(1, 1))
            .with(hp => hp.base(0, -1).normal(-1, 1))), undefined],

        [p(p => p
            .with(hp => hp.base(0, -1.5).normal(1, 1))
            .with(hp => hp.base(0, -1.5).normal(-1, 1))),
        p(p => p
            .with(hp => hp.base(0, -1.5).normal(1, 1))
            .with(hp => hp.base(0, -1.5).normal(-1, 1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],

        [p(p => p
            .with(hp => hp.base(0, -2).normal(1, 1))
            .with(hp => hp.base(0, -2).normal(-1, 1))),
        p(p => p
            .with(hp => hp.base(0, -2).normal(1, 1))
            .with(hp => hp.base(0, -2).normal(-1, 1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],

        [p(p => p
            .with(hp => hp.base(0, -3).normal(1, 1))
            .with(hp => hp.base(0, -3).normal(-1, 1))),
        p(p => p
            .with(hp => hp.base(0, -3).normal(1, 1))
            .with(hp => hp.base(0, -3).normal(-1, 1))
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))]
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: ConvexPolygon = convexPolygon.intersectWithConvexPolygon(other);
        if(!expectedIntersection){
            expect(intersection).toBeUndefined();
        }else{
            expectPolygonsToBeEqual(intersection, expectedIntersection);
        }
    });

    it.each([
        [hp(b => b.base(-2, -2).normal(1, -1)), true],
        [hp(b => b.base(-3, -2).normal(1, -1)), true],
        [hp(b => b.base(-1, -2).normal(1, -1)), false],
        [hp(b => b.base(0, -1).normal(0, -1)), true],
        [hp(b => b.base(0, -1).normal(0, 1)), false],
        [hp(b => b.base(0, 1).normal(0, -1)), true],
        [hp(b => b.base(0, 1).normal(0, 1)), false],
        [hp(b => b.base(0, -2).normal(0, -1)), false],
        [hp(b => b.base(0, -2).normal(0, 1)), false],
        [hp(b => b.base(-2, 0).normal(1, 0)), false],
        [hp(b => b.base(-2, 0).normal(-1, 0)), false],
        [hp(b => b.base(-1, 0).normal(1, 0)), false],
        [hp(b => b.base(-1, 0).normal(-1, 0)), false],
        [hp(b => b.base(0, 0).normal(1, 0)), false],
        [hp(b => b.base(0, 0).normal(-1, 0)), false],
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, 0).normal(0, 1))), false],
        [p(p => p.with(hp => hp.base(0, 0).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), false],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, -2).normal(0, 1))), true],
        [p(p => p.with(hp => hp.base(0, -2).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(-1, 1)).with(hp => hp.base(0, 0).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, -1).normal(-1, 1)).with(hp => hp.base(0, -1).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, -1.5).normal(-1, 1)).with(hp => hp.base(0, -1.5).normal(1, 1))), true],
        [p(p => p.with(hp => hp.base(0, -2).normal(-1, 1)).with(hp => hp.base(0, -2).normal(1, 1))), true],
        [p(p => p.with(hp => hp.base(0, -3).normal(-1, 1)).with(hp => hp.base(0, -3).normal(1, 1))), true],
        [p(p => p.with(hp => hp.base(-2, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(-2, 0).normal(-1, 0))), true],
        [p(p => p.with(hp => hp.base(-1, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(-1, 0).normal(-1, 0))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(-1, 0))), true],
        [p(p => p.with(hp => hp.base(1, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(1, 0).normal(-1, 0))), true],
        [p(p => p.with(hp => hp.base(2, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(2, 0).normal(-1, 0))), true],
    ])("should intersect the right convex polygons", (otherConvexPolygon: ConvexPolygon, expectedToIntersect: boolean) => {
        expect(convexPolygon.intersectsConvexPolygon(otherConvexPolygon)).toBe(expectedToIntersect);
        expect(otherConvexPolygon.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
    });

    it.each([
        [p(p => p.with(hp => hp.base(2, -1).normal(1, -1)).with(hp => hp.base(2, -1).normal(-1, -1))), p(p => p.with(hp => hp.base(2, -1).normal(-1, -1)).with(hp => hp.base(0, -1).normal(0, -1)).with(hp => hp.base(-1, -1).normal(1, -1)))],
        [p(p => p.with(hp => hp.base(0, -2).normal(1, -1)).with(hp => hp.base(0, -2).normal(-1, -2))), p(p => p.with(hp => hp.base(-1, -1).normal(1, -1)).with(hp => hp.base(0, -1).normal(0, -1)).with(hp => hp.base(1, -1).normal(-1, -2)))],
        [p(p => p.with(hp => hp.base(3, -2).normal(-1, 0)).with(hp => hp.base(3, -2).normal(0, -1))), p(p => p.with(hp => hp.base(0, -1).normal(0, -1)).with(hp => hp.base(1, -1).normal(-1, -2)).with(hp => hp.base(3, -2).normal(-1, -1)))],
        [p(p => p.with(hp => hp.base(0, 1).normal(0, 1))), plane]
    ])('should join to other areas in the right way', (areaToJoin: Area, expectedResult: Area) => {
        const result = convexPolygon.join(areaToJoin)
        expectAreasToBeEqual(result, expectedResult)
    })
});

describe("a convex polygon with three half planes and three vertices", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(-1, 0).normal(1, -1))
            .with(hp => hp.base(1, 0).normal(-1, -1)))
    });

    it.each([
        [hp(hp => hp.base(0, 2).normal(0, -1)), true],
        [hp(hp => hp.base(0, -2).normal(0, 1)), true]
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });
});

describe("a convex polygon with only one half plane", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p.with(hp => hp.base(0, 0).normal(0, 1)));
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, 1).normal(0, -1))), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)).with(hp => hp.base(0, 1).normal(0, -1)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, 1).normal(0, 1))), p(p => p.with(hp => hp.base(0, 1).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, 0).normal(1, 0))), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)).with(hp => hp.base(0, 0).normal(1, 0)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), undefined]
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: ConvexPolygon = convexPolygon.intersectWithConvexPolygon(other);
        if(!expectedIntersection){
            expect(intersection).toBeUndefined();
        }else{
            expectPolygonsToBeEqual(intersection, expectedIntersection);
        }
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, 1).normal(0, 1))), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), p(p => p.with(hp => hp.base(0, -1).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(1, 1))), plane]
    ])('should join to other areas in the right way', (areaToJoin: Area, expectedResult: Area) => {
        const result = convexPolygon.join(areaToJoin)
        expectAreasToBeEqual(result, expectedResult)
    })
});

describe("a convex polygon with two half planes and no vertices", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(0, 1).normal(0, -1))
            .with(hp => hp.base(0, -1).normal(0, 1)));
    });

    it("should have no vertices", () => {
        expect(convexPolygon.vertices.length).toBe(0);
    });

    it.each([
        [new Point(0, 1), false],
        [new Point(-1, 0), true],
        [new Point(1, 1), false],
        [new Point(-1, 1), false],
        [new Point(1, 0), true],
        [new Point(1, -1), false],
        [new Point(-1, -1), false],
        [new Point(0, -1), false]
    ])("should contain infinity in the right directions", (direction: Point, expectedToContainInfinityInDirection: boolean) => {
        expect(convexPolygon.containsInfinityInDirection(direction)).toBe(expectedToContainInfinityInDirection);
    });

    it.each([
        [hp(hp => hp.base(0, 2).normal(0, -1)), true],
        [hp(hp => hp.base(0, 2).normal(0, 1)), false],
        [hp(hp => hp.base(0, -2).normal(0, 1)), true],
        [hp(hp => hp.base(0, -2).normal(0, -1)), false]
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))),
        p(p => p
            .with(hp => hp.base(0, 1).normal(0, -1))
            .with(hp => hp.base(0, -1).normal(0, 1))
            .with(hp => hp.base(0, 0).normal(1, 0)))],
        
        [p(p => p.with(hp => hp.base(0, 2).normal(0, 1))), undefined],
        [p(p => p.with(hp => hp.base(0, -2).normal(0, -1))), undefined],
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: ConvexPolygon = convexPolygon.intersectWithConvexPolygon(other);
        if(!expectedIntersection){
            expect(intersection).toBeUndefined();
        }else{
            expectPolygonsToBeEqual(intersection, expectedIntersection);
        }
    });
});

describe("a convex polygon with two parallel half planes and two vertices", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(0, -1).normal(0, 1))
            .with(hp => hp.base(0, 1).normal(0, -1))
            .with(hp => hp.base(-1, 0).normal(1, 0)));
    });

    it.each([
        [new Point(0, 1), false],
        [new Point(-1, 0), false],
        [new Point(1, 1), false],
        [new Point(-1, 1), false],
        [new Point(1, 0), true],
        [new Point(1, -1), false],
        [new Point(-1, -1), false],
        [new Point(0, -1), false]
    ])("should contain infinity in the right directions", (direction: Point, expectedToContainInfinityInDirection: boolean) => {
        expect(convexPolygon.containsInfinityInDirection(direction)).toBe(expectedToContainInfinityInDirection);
    });
});

describe("a convex polygon with two half planes and one vertex", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p.with(hp => hp.base(0, 0).normal(-1, -1)).with(hp => hp.base(0, 0).normal(1, -1)));
    });

    it.each([
        [new Point(-1, 0), p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(-1, 0).normal(1, -1))
            .with(hp => hp.base(0, 0).normal(-1, -1)))]
    ])("should result in the correct expansions with a point", (expandWith: Point, expectedExpansion: ConvexPolygon) => {
        expectPolygonsToBeEqual(convexPolygon.expandToIncludePoint(expandWith), expectedExpansion);
    });

    it.each([
        //intersect with a half-plane with a vertical border
        [p(p => p.with(hp => hp.base(0, 1).normal(1, 0))), p(p => p
                                                            .with(hp => hp.base(0, 0).normal(-1, -1))
                                                            .with(hp => hp.base(0, 1).normal(1, 0)))],
        [p(p => p.with(hp => hp.base(-1, 1).normal(1, 0))), p(p => p
                                                                .with(hp => hp.base(0, 0).normal(-1, -1))
                                                                .with(hp => hp.base(-1, 1).normal(1, 0))
                                                                .with(hp => hp.base(0, 0).normal(1, -1)))],
        [p(p => p.with(hp => hp.base(1, 1).normal(1, 0))), p(p => p
                                                            .with(hp => hp.base(0, 0).normal(-1, -1))
                                                            .with(hp => hp.base(1, 1).normal(1, 0)))],

        //intersect with a half-plane with a horizontal border
        [p(p => p.with(hp => hp.base(0, 1).normal(0, -1))), p(p => p
                                                            .with(hp => hp.base(0, 0).normal(-1, -1))
                                                            .with(hp => hp.base(0, 0).normal(1, -1)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), p(p => p
                                                                .with(hp => hp.base(0, 0).normal(-1, -1))
                                                                .with(hp => hp.base(0, -1).normal(0, -1))
                                                                .with(hp => hp.base(0, 0).normal(1, -1)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), p(p => p
                                                                    .with(hp => hp.base(0, 0).normal(-1, -1))
                                                                    .with(hp => hp.base(0, -1).normal(0, 1))
                                                                    .with(hp => hp.base(0, 0).normal(1, -1)))],
        //intersect with two half-planes, vertex pointing upwards
        [p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1)))],

        //intersect with two half-planes forming a 'top-right' corner
        [p(p => p
            .with(hp => hp.base(0, 1).normal(0, -1))
            .with(hp => hp.base(0, 1).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(0, 1).normal(-1, 0)))],

        [p(p => p
            .with(hp => hp.base(3, -1).normal(0, -1))
            .with(hp => hp.base(3, -1).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(3, -1).normal(0, -1))
            .with(hp => hp.base(3, -1).normal(-1, 0)))],

        [p(p => p
            .with(hp => hp.base(1, -1).normal(0, -1))
            .with(hp => hp.base(1, -1).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(1, -1).normal(0, -1))
            .with(hp => hp.base(1, -1).normal(-1, 0)))],

        //intersect with two half-planes forming a 'bottom-left' corner
        [p(p => p
            .with(hp => hp.base(0, 1).normal(0, 1))
            .with(hp => hp.base(0, 1).normal(1, 0))), undefined],

        //intersect with two half-planes, vertex pointing right
        [p(p => p
            .with(hp => hp.base(0, 1).normal(-1, -1))
            .with(hp => hp.base(0, 1).normal(-1, 1))), undefined],
        
        //intersect with two half-planes, vertex pointing down
        [p(p => p
            .with(hp => hp.base(0, 1).normal(-1, 1))
            .with(hp => hp.base(0, 1).normal(1, 1))), undefined],
        
        //intersect with one half-plane parallel to one of the borders
        [p(p => p.with(hp => hp.base(-1, -1).normal(-1, -1))),
        p(p => p
            .with(hp => hp.base(-1, -1).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1)))]
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: ConvexPolygon = convexPolygon.intersectWithConvexPolygon(other);
        if(!expectedIntersection){
            expect(intersection).toBeUndefined();
        }else{
            expectPolygonsToBeEqual(intersection, expectedIntersection);
        }
    });

    it.each([
        [hp(b => b.base(0, 1).normal(0, -1)), true],
        [hp(b => b.base(0, 1).normal(0, 1)), false],
        [hp(b => b.base(0, 0).normal(0, -1)), true],
        [hp(b => b.base(0, 0).normal(0, 1)), false],
        [hp(b => b.base(-1, 0).normal(1, 0)), false],
        [hp(b => b.base(-1, 0).normal(-1, 0)), false],
        [hp(b => b.base(0, 0).normal(1, 0)), false],
        [hp(b => b.base(0, 0).normal(-1, 0)), false],
        [hp(b => b.base(1, 0).normal(1, -1)), false],
        [hp(b => b.base(1, 0).normal(-1, 1)), false],
        [hp(b => b.base(1, 0).normal(1, 1)), false],
        [hp(b => b.base(1, 0).normal(-1, -1)), true],
        [hp(b => b.base(-1, 0).normal(-1, -1)), false],
        [hp(b => b.base(-1, 0).normal(1, 1)), false],
        [hp(b => b.base(-1, 0).normal(1, -1)), true],
        [hp(b => b.base(-1, 0).normal(-1, 1)), false],
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, 0).normal(-1, 1)).with(hp => hp.base(0, 0).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, 1).normal(-1, 1)).with(hp => hp.base(0, 1).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, -1).normal(-1, 1)).with(hp => hp.base(0, -1).normal(1, 1))), true],
        [p(p => p.with(hp => hp.base(2, -1).normal(-1, 1)).with(hp => hp.base(2, -1).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(2, -2).normal(-1, 1)).with(hp => hp.base(2, -2).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, 0).normal(-1, -1)).with(hp => hp.base(0, 0).normal(1, -1))), true],
        [p(p => p.with(hp => hp.base(2, 0).normal(-1, -1)).with(hp => hp.base(2, 0).normal(1, -1))), true],
        [p(p => p.with(hp => hp.base(0, 2).normal(-1, -1)).with(hp => hp.base(0, 2).normal(1, -1))), true],
        [p(p => p.with(hp => hp.base(0, -2).normal(-1, -1)).with(hp => hp.base(0, -2).normal(1, -1))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(0, 1))), false],
        [p(p => p.with(hp => hp.base(0, 0).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), true],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, 1).normal(0, 1))), false],
        [p(p => p.with(hp => hp.base(0, 1).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(1, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(-1, 0).normal(1, 0))), true],
    ])("should intersect the right convex polygons", (otherConvexPolygon: ConvexPolygon, expectedToIntersect: boolean) => {
        expect(convexPolygon.intersectsConvexPolygon(otherConvexPolygon)).toBe(expectedToIntersect);
        expect(otherConvexPolygon.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
    });
});
