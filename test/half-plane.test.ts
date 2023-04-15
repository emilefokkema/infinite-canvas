import {describe, it, expect, beforeEach } from '@jest/globals';
import { HalfPlane } from "../src/areas/polygons/half-plane";
import { Point } from "../src/geometry/point";
import { PolygonVertex } from "../src/areas/polygons/polygon-vertex";

describe("a half plane", () => {
    let halfPlane: HalfPlane;

    beforeEach(() => {
        const normalTowardInterior: Point = new Point(1, -1);
        const base: Point = new Point(3, 2);
        halfPlane = new HalfPlane(base, normalTowardInterior);
    });

    it.each([
        [new Point(3, 4), -Math.sqrt(2)],
        [new Point(2, 2), -Math.sqrt(2) / 2],
        [new Point(5, 2), Math.sqrt(2)]
    ])("should return the correct distances from the edge", (point: Point, expectedDistance: number) => {
        expect(halfPlane.getDistanceFromEdge(point)).toBeCloseTo(expectedDistance);
    });
});

describe("two half planes with normals pointing in opposite directions", () => {
    let halfPlane1: HalfPlane;
    let halfPlane2: HalfPlane;

    beforeEach(() => {
        halfPlane1 = new HalfPlane(new Point(0, 1), new Point(0, -1));
        halfPlane2 = new HalfPlane(new Point(0, 0), new Point(0, 1));
    });

    it("should not contain each other", () => {
        expect(halfPlane1.isContainedByHalfPlane(halfPlane2)).toBe(false);
        expect(halfPlane2.isContainedByHalfPlane(halfPlane1)).toBe(false);
    });
});

describe.each([
    [new HalfPlane(new Point(0, 1), new Point(0, -1)), new HalfPlane(new Point(1, 0), new Point(1, 1)), new Point(0, 1)],
    [new HalfPlane(new Point(0, 1), new Point(0, -2)), new HalfPlane(new Point(1, 0), new Point(3, 3)), new Point(0, 1)],
    [new HalfPlane(new Point(0, 1), new Point(0, -2)), new HalfPlane(new Point(1, 0), new Point(-1, -1)), new Point(0, 1)],
    [new HalfPlane(new Point(0, 1), new Point(0, -1)), new HalfPlane(new Point(1, 0), new Point(-1, 1)), new Point(2, 1)],
    [new HalfPlane(new Point(0, 1), new Point(0, -1)), new HalfPlane(new Point(2, 0), new Point(-2, 2)), new Point(3, 1)],
    [new HalfPlane(new Point(0, 1), new Point(0, -1)), new HalfPlane(new Point(1.5, 0), new Point(-1, 0.5)), new Point(2, 1)],
    [new HalfPlane(new Point(0, 1), new Point(0, -1)), new HalfPlane(new Point(1, 0), new Point(-1, 0)), new Point(1, 1)]
])("two half planes", (one: HalfPlane, other: HalfPlane, expectedIntersection: Point) => {

    it("should have the right intersection", () => {
        const intersection: PolygonVertex = one.getIntersectionWith(other);
        expect(intersection.point.x).toBeCloseTo(expectedIntersection.x);
        expect(intersection.point.y).toBeCloseTo(expectedIntersection.y);
    });
});