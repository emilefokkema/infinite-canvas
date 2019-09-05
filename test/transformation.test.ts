import { Transformation } from "../src/transformation"
import { Point } from "../src/point"

describe.each([
	new Transformation(2, 0, 0, 2, 2, 0),
	new Transformation(2, 0, 0, 2, 1, 0)
])("if transformation %j", (transformation) => {
	let originalPoint: Point;

	beforeEach(() => {
		originalPoint = {x: 1, y: 1};
	});

	describe("transforms a point", () => {
		let transformedPoint: Point;

		beforeEach(() => {
			transformedPoint = transformation.apply(originalPoint);
		});

		it("its inverse should transform it back", () => {
			let transformedBack: Point = transformation.inverse().apply(transformedPoint);
			expect(transformedBack.x).toBeCloseTo(originalPoint.x);
			expect(transformedBack.y).toBeCloseTo(originalPoint.y);
		});
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
			let translatedPoint: Point = zoom.apply({x:fromX, y:fromY});
			expect(translatedPoint.x).toBeCloseTo(toX);
			expect(translatedPoint.y).toBeCloseTo(toY);
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
				let newlyTransformedPoint: Point = zoom.apply(givenPoint);
				expect(newlyTransformedPoint.x).toBeCloseTo(transformedPointTranslated.x);
				expect(newlyTransformedPoint.y).toBeCloseTo(transformedPointTranslated.y);
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
		let translatedPoint: Point = translation.apply({x:x, y:y});
		expect(translatedPoint.x).toBeCloseTo(x + dx);
		expect(translatedPoint.y).toBeCloseTo(y + dy);
	});
});