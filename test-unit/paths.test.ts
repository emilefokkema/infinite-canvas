import { beforeEach, describe, expect, it } from 'vitest'
import {CanvasContextMock} from "./canvas-context-mock";
import {InfiniteCanvasRenderingContext2D} from "api/infinite-canvas-rendering-context-2d";
import { createInfiniteCanvasTestFixture } from './infinite-canvas-test-fixture';

describe('an infinite canvas context', () => {
	let infiniteContext: InfiniteCanvasRenderingContext2D;
	let contextMock: CanvasContextMock;

	beforeEach(() => {
		({ contextMock, infiniteContext} = createInfiniteCanvasTestFixture());
	});

    describe("that makes a path, fills it and then fills an overlapping rect", () => {

		beforeEach(() => {
			infiniteContext.fillStyle = "#f00";
			infiniteContext.beginPath();
			infiniteContext.moveTo(0, 0);
			infiniteContext.lineTo(2, 0);
			infiniteContext.lineTo(2, 2);
			infiniteContext.lineTo(0, 2);
			infiniteContext.lineTo(0, 0);
			infiniteContext.fill();
			infiniteContext.fillStyle = "#00f";
			contextMock.clear();
			infiniteContext.fillRect(1, 1, 2, 2);
		});

		it("should draw the two rectangles in the right order", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then fills the path again", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should not have forgotten the previous path", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that draws a path, fills it and then adds to the path", () => {

		beforeEach(() => {
			infiniteContext.fillStyle = "#f00";
			infiniteContext.beginPath();
			infiniteContext.moveTo(30,30);
			infiniteContext.lineTo(30,100);
			infiniteContext.lineTo(100,100);
			infiniteContext.fill();
			infiniteContext.lineTo(100,30);
		});

		describe("and then strokes the path", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should have executed the last path modification only once", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that fills a rectangle, creates a path inside it, clears a rectangle inside the first rectangle and then fills the created path", () => {

		beforeEach(() => {
			infiniteContext.fillStyle = "#f00";
			infiniteContext.fillRect(0, 0, 100, 100);
			infiniteContext.fillStyle = "#00f";
			infiniteContext.beginPath();
			infiniteContext.moveTo(50,0);
			infiniteContext.lineTo(50,50);
			infiniteContext.lineTo(0,50);
			infiniteContext.lineTo(0, 0);
			infiniteContext.closePath();
			infiniteContext.clearRect(0, 0, 75, 75);
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should have executed everything", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that makes a path, fills it, clears it completely with a clearRect, expands it and strokes it", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(1, 1);
			infiniteContext.lineTo(1, 2);
			infiniteContext.lineTo(2, 2);
			infiniteContext.fill();
			infiniteContext.clearRect(0, 0, 3, 3);
			infiniteContext.lineTo(2, 1);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should no longer fill the path", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that creates a rectangular path, fills another rectangle and then fills the created path", () => {

		beforeEach(() => {
			infiniteContext.fillStyle = "#f00";
			infiniteContext.beginPath();
			infiniteContext.rect(0,0,50,50);
			infiniteContext.fillRect(50,50,50,50);
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should have filled both rectangles", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that creates a rectangular path, strokes another rectangle and then strokes the created path", () => {

		beforeEach(() => {
			infiniteContext.strokeStyle = "#f00";
			infiniteContext.beginPath();
			infiniteContext.rect(0,0,50,50);
			infiniteContext.strokeRect(50,50,50,50);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should have stroked both rectangles", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that draws a line without calling 'moveTo'", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.lineTo(10, 10);
			infiniteContext.lineTo(20, 10);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should draw a line", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    
})