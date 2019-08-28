import InfiniteCanvas from "../src/infinite-canvas"
import { InfiniteCanvasRenderingContext2D } from "../src/infinite-context/infinite-canvas-rendering-context-2d"

describe("an infinite canvas", () => {
	let infiniteCanvas: InfiniteCanvas;
	let canvas: HTMLCanvasElement;

	beforeEach(() => {
		canvas = undefined;
		infiniteCanvas = new InfiniteCanvas(canvas);
	});

	it("should exist", () => {
		expect(infiniteCanvas).toBeTruthy();
	});

	describe("that is asked for a context", () => {
		let context: InfiniteCanvasRenderingContext2D;

		beforeEach(() => {
			context = infiniteCanvas.getContext();
		});

		it("should have returned a context", () => {
			expect(context).toBeTruthy();
		});

		it("should not return a different context on another call", () => {
			const resultOfOtherCall: InfiniteCanvasRenderingContext2D = infiniteCanvas.getContext();
			expect(resultOfOtherCall).toBe(context);
		});
	});
});