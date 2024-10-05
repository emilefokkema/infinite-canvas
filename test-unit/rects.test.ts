import { beforeEach, describe, expect, it} from 'vitest'
import {CanvasContextMock} from "./canvas-context-mock";
import {InfiniteCanvasRenderingContext2D} from "../src/api-surface/infinite-canvas-rendering-context-2d";
import { createInfiniteCanvasTestFixture } from './infinite-canvas-test-fixture';

describe('an infinite canvas context', () => {
	let infiniteContext: InfiniteCanvasRenderingContext2D;
	let contextMock: CanvasContextMock;

    beforeEach(() => {
		({contextMock, infiniteContext} = createInfiniteCanvasTestFixture());
	});

    describe("that fills a rect with finite width and positive infinite height", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(20, 20, 30, Infinity);
		});

		it("should fill a rect that extends to outside of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills a rect with finite width and negative infinite height", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(20, 20, 30, -Infinity);
		});

		it("should fill a rect that extends to outside of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that begins a path", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
		});

		it("should get an error if it tries to add a rect with x and y that do not determine a direction", () => {
			expect(() => {
				infiniteContext.rect(-Infinity, -Infinity, Infinity, Infinity);
			}).toThrow();
		});

		it("should get an error if it tries to add a round rect with x and y that do not determine a direction", () => {
			expect(() => {
				infiniteContext.roundRect(-Infinity, -Infinity, Infinity, Infinity, 2);
			}).toThrow();
		});

		describe("and then adds a rect that has no area", () => {

			beforeEach(() => {
				infiniteContext.rect(-Infinity, 100, 100, 100);
			});

			describe("and then adds a line to a finite point and strokes it", () => {

				beforeEach(() => {
					infiniteContext.lineTo(100, 100);
					contextMock.clear();
					infiniteContext.stroke();
				});

				it("should have drawn a ray from the position of the rect without area", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

    describe("that fills a rect with only a top edge", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(-Infinity, 100, Infinity, Infinity);
		});

		it("should fill a rect that fills the bottom half of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills a rect with only a right edge", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(100, -Infinity, -Infinity, Infinity);
		});

		it("should fill a rect that fills the left half of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});
    
    describe("that fills a rect without top edge with positive infinite height and a finite width", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(20, -Infinity, 30, Infinity);
		});

		it("should fill a rect that extends to the top and bottom of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills a rect without bottom edge with negative infinite height and a finite width", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(20, Infinity, 30, -Infinity);
		});

		it("should fill a rect that extends to the top and bottom of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills a rect without left edge with positive infinite width and a finite height", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(-Infinity, 20, Infinity, 30);
		});

		it("should fill a rect that extends to the left and right of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills a rect without right edge with negative infinite width and a finite height", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(Infinity, 20, -Infinity, 30);
		});

		it("should fill a rect that extends to the left and right of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills a rect with positive infinite width and a finite height", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(20, 20, Infinity, 30);
		});

		it("should fill a rect that extends to outside of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills the entire plane", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(-Infinity, -Infinity, Infinity, Infinity);
		});

		it("should fill the entire viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe('and then clears the entire plane', () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(-Infinity, -Infinity, Infinity, Infinity)
			})

			it("should have cleared the plane", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		})
	});

    describe("that fills a rect with negative infinite width and a finite height", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(20, 20, -Infinity, 30);
		});

		it("should fill a rect that extends to outside of the viewbox", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe.each([
			[10, 10, 40, 40],
			[10, 10, -40, 40],
			[10, 10, Infinity, 40],
			[10, 10, -Infinity, 40],
			[10, 10, 40, Infinity],
			[10, 10, -40, Infinity],
			[10, 10, Infinity, Infinity],
			[10, 10, -Infinity, Infinity],

			[10, 60, 40, -40],
			[10, 60, -40, -40],
			[10, 60, Infinity, -40],
			[10, 60, -Infinity, -40],
			[10, 60, 40, -Infinity],
			[10, 60, -40, -Infinity],
			[10, 60, Infinity, -Infinity],
			[10, 60, -Infinity, -Infinity],
		])("and then clears a rect that intersects the rectangle",(x: number, y: number, w: number, h: number) => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(x, y, w, h);
			});

			it("should add a clear rect", () => {
				const log: string = contextMock.getLog().join(";");
				expect(log.match(/context\.transform\([^)]+\);context\.clearRect\([^)]+\);context\.restore()/)).toBeTruthy();
			});
		});

		describe.each([
			[30, 10, 40, 40],
			[30, 10, 40, Infinity],
			[30, 10, 40, -Infinity],
			[30, 10, 40, -40],
			[30, 10, Infinity, Infinity],
			[30, 10, Infinity, -Infinity],
			[30, 10, Infinity, 40],
			[30, 10, Infinity, -40],
			[30, 10, -Infinity, -Infinity],
			[30, 10, -Infinity, -10],

			[10, 10, 40, -40],
			[10, 10, 40, -Infinity],
			[10, 10, Infinity, -Infinity],
			[10, 10, Infinity, -40],
			[10, 10, -Infinity, -Infinity],
			[10, 10, -Infinity, -40],

			[10, 60, 40, Infinity],
			[10, 60, Infinity, Infinity],
			[10, 60, -Infinity, Infinity],
			[10, 60, Infinity, 10],
			[10, 60, -Infinity, 10],
		])("and then clears a rect that does not intersect the rectangle",(x: number, y: number, w: number, h: number) => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(x, y, w, h);
			});

			it("should do nothing", () => {
				expect(contextMock.getLog()).toEqual([]);
			});
		});
	});

    describe("that fills a rect without area", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.fillRect(-Infinity, 50, 50, 50);
		});

		it("should do nothing", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that strokes a rect without area", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.strokeRect(-Infinity, 50, 50, 50);
		});

		it("should do nothing", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that strokes the entire plane", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.strokeRect(-Infinity, -Infinity, Infinity, Infinity);
		});

		it("should do nothing", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});
})