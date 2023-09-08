import { beforeEach, describe, it, expect} from 'vitest'
import { Transformation } from "../src/transformation"
import { Point } from "../src/geometry/point"

function expectPointToBeTransformedTo(point: Point, transformation: Transformation, expectedPoint: Point): void{
	const actualTransformedPoint: Point = transformation.apply(point);
	expect(actualTransformedPoint.x).toBeCloseTo(expectedPoint.x);
	expect(actualTransformedPoint.y).toBeCloseTo(expectedPoint.y);
}

describe.each([
	new Transformation(2, 0, 0, 2, 2, 0),
	new Transformation(2, 0, 0, 2, 1, 0)
])("if transformation %j", (transformation) => {
	let originalPoint: Point;

	beforeEach(() => {
		originalPoint = new Point(1, 1);
	});

	describe("transforms a point", () => {
		let transformedPoint: Point;

		beforeEach(() => {
			transformedPoint = transformation.apply(originalPoint);
		});

		it("its inverse should transform it back", () => {
			expectPointToBeTransformedTo(transformedPoint, transformation.inverse(), originalPoint);
		});
	});
});

describe("a rotation", () => {
	let rotation: Transformation;

	beforeEach(() => {
		rotation = Transformation.rotation(1, 1, Math.PI / 4);
	});

	it.each([
		[{x: 0, y: 0}, {x: 1, y:  1 - Math.sqrt(2)}],
		[{x: 0, y: 2}, {x: 1 - Math.sqrt(2), y:  1}],
		[{x: 2, y: 2}, {x: 1, y:  Math.sqrt(2) + 1}],
		[{x: 2, y: 0}, {x: 1 + Math.sqrt(2), y:  1}]
	])("should rotate points", (fromPoint: Point, toPoint: Point) => {
		expectPointToBeTransformedTo(fromPoint, rotation, toPoint);
	});
});

describe("a translate, rotate, zoom transformation", () => {
	let translateRotateZoom: Transformation;
	let from1: Point;
	let from2: Point;
	let to1: Point;
	let to2: Point;
	let from3: Point;
	let to3: Point;

	beforeEach(() => {
		from1 = new Point(0, 1);
		from2 = new Point(0, 3);
		from3 = new Point(2, 3);
		to1 = new Point(0, 0);
		to2 = new Point(1, 0);
		to3 = new Point(1, -1);
		translateRotateZoom = Transformation.translateRotateZoom(from1.x, from1.y, from2.x, from2.y, to1.x, to1.y, to2.x, to2.y);
	});

	it("should transform points correctly", () => {
		expectPointToBeTransformedTo(from1, translateRotateZoom, to1);
		expectPointToBeTransformedTo(from2, translateRotateZoom, to2);
		expectPointToBeTransformedTo(from3, translateRotateZoom, to3);
	});
});

describe("a translating and zooming transformation", () => {
	let translateZoom: Transformation;
	let from1: Point;
	let from2: Point;
	let to1: Point;
	let to2: Point;

	beforeEach(() => {
		from1 = new Point(0, 1);
		from2 = new Point(0, 3);
		to1 = new Point(0, 0);
		to2 = new Point(1, 0);
		translateZoom = Transformation.translateZoom(from1.x, from1.y, from2.x, from2.y, to1.x, to1.y, to2.x, to2.y);
	});

	it("should transform points correctly", () => {
		expectPointToBeTransformedTo(from1, translateZoom, new Point(0, 0));
		expectPointToBeTransformedTo(from2, translateZoom, new Point(0, 1));
		expectPointToBeTransformedTo(new Point(2, 3), translateZoom, new Point(1, 1));
	});
});

describe("a zooming transformation", () => {
	let zoom: Transformation;
	let centerX: number;
	let centerY: number;
	let scale: number;

	beforeEach(() => {
		centerX = 1;
		centerY = 1;
		scale = 2;
		zoom = Transformation.zoom(centerX, centerY, scale);
	});

	describe.each([
			[2, 2, 3, 3],
			[0, 0, -1, -1],
			[0, 2, -1, 3],
			[2, 0, 3, -1]
	])("that is applied to point (%f,%f)", (fromX: number, fromY: number, toX: number, toY: number) => {
		it("should transform it correctly", () => {
			expectPointToBeTransformedTo(new Point(fromX, fromY), zoom, new Point(toX, toY));
		});
	});

	describe.each([
		{x: 0, y: 0},
		{x: 1, y: 1},
	])("that transforms a given point", (givenPoint: Point) => {
		let transformedPoint: Point;

		beforeEach(() => {
			transformedPoint = zoom.apply(givenPoint);
		});

		describe("and is then translated", () => {
			let translation: Transformation;
			let transformedPointTranslated: Point;

			beforeEach(() => {
				translation = Transformation.translation(3, 3);
				transformedPointTranslated = translation.apply(transformedPoint);
				zoom = zoom.before(translation);
			});

			it("should then transform the given point to the previous result, but translated", () => {
				expectPointToBeTransformedTo(givenPoint, zoom, transformedPointTranslated);
			});
		});
	});
});

describe("a translation", () => {
	let translation: Transformation;
	let dx: number;
	let dy: number;

	beforeEach(() => {
		dx = 1;
		dy = 2;
		translation = Transformation.translation(dx, dy);
	});

	it("should translate a point", () => {
		let x: number = 5;
		let y: number = 6;
		expectPointToBeTransformedTo(new Point(x, y), translation, new Point(x + dx, y + dy));
	});
});