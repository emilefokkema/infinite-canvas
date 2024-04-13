import { beforeEach, describe, expect, it} from 'vitest'
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

describe('this convex polygon', () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(327.64365191449684, 144.28111917043088).normal(0.07753202577717389, -0.0775320257772023))
            .with(hp => hp.base(323.6436519144929, 140.28111917042767).normal(59.012810310875324, 59.01281031088212))
            .with(hp => hp.base(397.6692725362536, 144.2811191704305).normal(-0.0775320257772023, -0.0775320257772023))
            .with(hp => hp.base(401.66927253625676, 140.2811191704273).normal(19.012810310878535, 19.012810310878535))
            .with(hp => hp.base(382.65646222537504, 81.26830885955233).normal(-39.01281031087656, 39.01281031088013))
            .with(hp => hp.base(421.66927253625516, 120.2811191704289).normal(-39.012810310876944, -39.012810310876944)))
    })

    it('should expand to include this point without error', () => {
        convexPolygon.expandToIncludePoint(new Point(283.6436519144929, 100.28111917042767))
        expect(true).toBe(true)
    })
})

describe('this convex polygon', () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(-291.25684509421893, 78.40000915527344).normal(0.6952000122070245, 0))
            .with(hp => hp.base(-285.59999084472656, 779.2568756117971).normal(0, -1.0735999755859211))
            .with(hp => hp.base(-271.25684509421893, 52.74315490578105).normal(19.999999999999993, 20))
            .with(hp => hp.base(813.6568389907034, 52.74315490578105).normal(-0, 1084.9136840849224))
            .with(hp => hp.base(813.6568389907034, 759.2568756117971).normal(-20, -20.000000000000227))
            .with(hp => hp.base(813.6568389907034, 759.2568756117971).normal(-706.5137207060161, 0)))
    })

    it('should result in such a polygon when expanded to include this point', () => {
        const result = convexPolygon.expandToIncludePoint(new Point(100, 52.74315490578104))
        expect(result.halfPlanes.length).toBe(7)
        expect(result.vertices.length).toBe(7)
    })
})

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
                expect(halfPlanes.indexOf(vertex.leftHalfPlane) > -1).toBe(true);
                expect(halfPlanes.indexOf(vertex.rightHalfPlane) > -1).toBe(true);
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
            .with(hp => hp.base(0, 1).normal(1, -1)))],
        [new Point(0, -2), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))]
    ])("should result in the correct expansions with a point", (expandWith: Point, expectedExpansion: ConvexPolygon) => {
        expectPolygonsToBeEqual(convexPolygon.expandToIncludePoint(expandWith), expectedExpansion);
    });

    it.each([
        //intersect with a half-plane with a horizontal border
        [p(p => p.with(hp => hp.base(0, 0).normal(0, 1))), empty],

        [p(p => p.with(hp => hp.base(0, 0).normal(0, -1))), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],

        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), empty],

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
            .with(hp => hp.base(0, -1).normal(-1, 1))), empty],

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
        const intersection: Area = convexPolygon.intersectWithConvexPolygon(other);
        expectAreasToBeEqual(intersection, expectedIntersection);
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
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), empty]
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: Area = convexPolygon.intersectWithConvexPolygon(other);
        expectAreasToBeEqual(intersection, expectedIntersection);
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
        
        [p(p => p.with(hp => hp.base(0, 2).normal(0, 1))), empty],
        [p(p => p.with(hp => hp.base(0, -2).normal(0, -1))), empty],
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: Area = convexPolygon.intersectWithConvexPolygon(other);
        expectAreasToBeEqual(intersection, expectedIntersection);
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
            .with(hp => hp.base(0, 1).normal(1, 0))), empty],

        //intersect with two half-planes, vertex pointing right
        [p(p => p
            .with(hp => hp.base(0, 1).normal(-1, -1))
            .with(hp => hp.base(0, 1).normal(-1, 1))), empty],
        
        //intersect with two half-planes, vertex pointing down
        [p(p => p
            .with(hp => hp.base(0, 1).normal(-1, 1))
            .with(hp => hp.base(0, 1).normal(1, 1))), empty],
        
        //intersect with one half-plane parallel to one of the borders
        [p(p => p.with(hp => hp.base(-1, -1).normal(-1, -1))),
        p(p => p
            .with(hp => hp.base(-1, -1).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1)))]
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: Area = convexPolygon.intersectWithConvexPolygon(other);
        expectAreasToBeEqual(intersection, expectedIntersection);
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
