import { Rectangle } from "../src/rectangle";
import { Transformation } from "../src/transformation";
import { Point } from "../src/point";

describe("a rectangle", () => {
    let rectangle: Rectangle;

    beforeEach(() => {
        rectangle = new Rectangle(1, 1, 2, 2);
    });

    it.each([
        [{x:0,y:0}, 0, 3, 0, 3],
        [{x:4,y:0}, 1, 4, 0, 3],
        [{x:0,y:4}, 0, 3, 1, 4],
        [{x:4,y:4}, 1, 4, 1, 4]
    ])("should be expandable to include a point", (
        pointToInclude: Point,
        expectedLeft: number,
        expectedRight: number,
        expectedTop: number,
        expectedBottom: number) => {
            const newRectangle: Rectangle = rectangle.expandToInclude(pointToInclude);
            expect(newRectangle.left).toBe(expectedLeft);
            expect(newRectangle.right).toBe(expectedRight);
            expect(newRectangle.top).toBe(expectedTop);
            expect(newRectangle.bottom).toBe(expectedBottom);
    });

    it.each([
        [new Rectangle(0, 0, 1, 1), 0, 3, 0, 3],
        [new Rectangle(3, 0, 1, 1), 1, 4, 0, 3],
        [new Rectangle(0, 3, 1, 1), 0, 3, 1, 4],
        [new Rectangle(3, 3, 1, 1), 1, 4, 1, 4]
    ])("should be expandable to include a rectangle", (
        rectangleToInclude: Rectangle,
        expectedLeft: number,
        expectedRight: number,
        expectedTop: number,
        expectedBottom: number) => {
            const newRectangle = rectangle.expandToInclude(rectangleToInclude);
            expect(newRectangle.left).toBe(expectedLeft);
            expect(newRectangle.right).toBe(expectedRight);
            expect(newRectangle.top).toBe(expectedTop);
            expect(newRectangle.bottom).toBe(expectedBottom);
    });

    it("should contain another rectangle", () => {
        const other: Rectangle = new Rectangle(1.5, 1.5, 1, 1);
        expect(rectangle.contains(other)).toBe(true);
    });

    it("should not contain another rectangle", () => {
        const other: Rectangle = new Rectangle(0, 0, 4, 4);
        expect(rectangle.contains(other)).toBe(false);
    });

    it.each([
        new Rectangle(-3, 1, 2, 2),
        new Rectangle(4, 1, 2, 2),
        new Rectangle(1, -3, 2, 2),
        new Rectangle(1, 4, 2, 2)
    ])("should not intersect rectangle %j", (otherRectangle: Rectangle) => {
        expect(rectangle.intersects(otherRectangle)).toBe(false);
    });

    it.each([
        new Rectangle(0, 1, 2, 2),
        new Rectangle(2, 1, 2, 2),
        new Rectangle(1, 0, 2, 2),
        new Rectangle(1, 2, 2, 2)
    ])("should intersect rectangle %j", (otherRectangle: Rectangle) => {
        expect(rectangle.intersects(otherRectangle)).toBe(true);
    });

    describe("that is transformed", () => {
        const sqrt2 = Math.sqrt(2);
        const halfSqrt2 = sqrt2 / 2;
        let transformation: Transformation;
        let transformedRectangle: Rectangle;

        beforeEach(() => {
            transformation = new Transformation(halfSqrt2, halfSqrt2, -halfSqrt2, halfSqrt2, 0, 0);
            transformedRectangle = rectangle.transform(transformation);
        });

        it("should result in a new rectangle", () => {
            expect(transformedRectangle.top).toBeCloseTo(sqrt2);
            expect(transformedRectangle.bottom).toBeCloseTo(3 * sqrt2);
            expect(transformedRectangle.left).toBeCloseTo(-sqrt2);
            expect(transformedRectangle.right).toBeCloseTo(sqrt2);
        });
    });
});