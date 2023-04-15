import {describe, it, expect, beforeEach } from '@jest/globals';
import { Point } from '../src/geometry/point';
import { getPointInFrontInDirection } from '../src/geometry/get-point-in-front-in-direction';

describe('given a shape that contains these vertices', () => {
    let shapeVertices: Point[];

    beforeEach(() => {
        shapeVertices = [
            new Point(0, 0),
            new Point(1, 0),
            new Point(0, 1),
            new Point(1, 1)
        ]
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
        const result: Point = getPointInFrontInDirection(shapeVertices, point, direction);
        expect(result.x).toBeCloseTo(expectedPointInFront.x);
        expect(result.y).toBeCloseTo(expectedPointInFront.y);
    });
})