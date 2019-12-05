import { InfiniteCanvas } from "../src/infinite-canvas"
import { InfiniteCanvasRenderingContext2D } from "../src/infinite-context/infinite-canvas-rendering-context-2d"
import { CanvasContextMock } from "./canvas-context-mock";

describe("an infinite canvas", () => {
	let infiniteCanvas: InfiniteCanvas;
	let canvas: any;
	let canvasContextMock: CanvasContextMock;
	let mouseDownListener: (ev: any) => any;
	let mouseMoveListener: (ev: any) => any;

	beforeEach(() => {
		jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {cb(0);return 0;});
		canvasContextMock = new CanvasContextMock();
		canvas = {
			width:100,
			height: 100,
			getBoundingClientRect(){return {left: 0, top: 0};},
			getContext(): any{return canvasContextMock.mock;},
			addEventListener(type: string, listener: (this: HTMLCanvasElement, ev: any) => any): void{
				if(type === "mousedown"){
					mouseDownListener = listener;
				}else if(type === "mousemove"){
					mouseMoveListener = listener;
				}
			}
		};
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

	describe("that registers a listener to 'draw'", () => {
		let drawCallbackSpy: jest.Mock;

		beforeEach(() => {
			
			drawCallbackSpy = jest.fn();
		});

		describe("with 'once' not true", () => {

			beforeEach(() => {
				infiniteCanvas.addEventListener("draw", () => {
					drawCallbackSpy();
				});
			});

			describe("and then draws on the canvas", () => {
				let context: InfiniteCanvasRenderingContext2D;

				beforeEach(() => {
					context = infiniteCanvas.getContext();
					context.fillRect(0, 0, 1, 1);
				});

				it("should have called the listener", () => {
					expect(drawCallbackSpy).toHaveBeenCalled();
				});

				describe("and then draws on the canvas again", () => {

					beforeEach(() => {
						drawCallbackSpy.mockClear();
						context.fillRect(0, 0, 1, 1);
					});

					it("should have called the listener again", () => {
						expect(drawCallbackSpy).toHaveBeenCalled();
					});
				});
			});

			describe("and then pans the canvas", () => {

				beforeEach(() => {
					mouseDownListener({clientX: 10, clientY: 10, preventDefault(){}});
					mouseMoveListener({clientX: 20, clientY: 10, preventDefault(){}})
				});

				it("should have called the listener", () => {
					expect(drawCallbackSpy).toHaveBeenCalled();
				});
			});
		});

		describe("with 'once'  true", () => {

			beforeEach(() => {
				infiniteCanvas.addEventListener("draw", () => {
					drawCallbackSpy();
				}, {once: true});
			});

			describe("and then draws on the canvas", () => {
				let context: InfiniteCanvasRenderingContext2D;

				beforeEach(() => {
					context = infiniteCanvas.getContext();
					context.fillRect(0, 0, 1, 1);
				});

				it("should have called the listener", () => {
					expect(drawCallbackSpy).toHaveBeenCalled();
				});

				describe("and then draws on the canvas again", () => {

					beforeEach(() => {
						drawCallbackSpy.mockClear();
						context.fillRect(0, 0, 1, 1);
					});

					it("should not have called the listener again", () => {
						expect(drawCallbackSpy).not.toHaveBeenCalled();
					});
				});
			});
		});
	});
});