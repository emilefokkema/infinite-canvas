import { InfiniteCanvas } from "../src/infinite-canvas"
import { InfiniteCanvasRenderingContext2D } from "../src/infinite-context/infinite-canvas-rendering-context-2d"
import { CanvasContextMock } from "./canvas-context-mock";

describe("an infinite canvas", () => {
	let infiniteCanvas: InfiniteCanvas;
	let canvas: any;
	let canvasContextMock: CanvasContextMock;
	let mouseDownListener: (ev: any) => any;
	let mouseMoveListener: (ev: any) => any;
	let touchStartListener: (ev: any) => any;
	let touchMoveListener: (ev: any) => any;
	let boundingClientRectWidth: number;
	let boundingClientRectHeight: number;

	beforeEach(() => {
		boundingClientRectWidth = 100;
		boundingClientRectHeight = 100;
		jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {cb(0);return 0;});
		canvasContextMock = new CanvasContextMock();
		canvas = {
			width:100,
			height: 100,
			getBoundingClientRect(){return {left: 0, top: 0, width: boundingClientRectWidth, height: boundingClientRectHeight};},
			getContext(): any{return canvasContextMock.mock;},
			addEventListener(type: string, listener: (this: HTMLCanvasElement, ev: any) => any): void{
				if(type === "mousedown"){
					mouseDownListener = listener;
				}else if(type === "mousemove"){
					mouseMoveListener = listener;
				}else if(type === 'touchstart'){
					touchStartListener = listener;
				}else if(type === 'touchmove'){
					touchMoveListener = listener;
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
				infiniteCanvas.addEventListener("draw", (e) => {
					drawCallbackSpy(e);
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

				describe('and then the canvas changes size in css pixels', () => {

					beforeEach(() => {
						boundingClientRectWidth = 50;
					});

					describe('and then a rotate-zoom happens', () => {

						beforeEach(() => {
							drawCallbackSpy.mockClear();
							const touch1 = {identifier: 0, clientX:0, clientY: 0};
							const touch2 = {identifier: 1, clientX:10, clientY: 0};
							touchStartListener({targetTouches: [touch1, touch2], preventDefault(){}, cancelable: true});
							touch2.clientY = 10;
							touchMoveListener({changedTouches: [touch2]});
						});

						it('should have drawn using this inverse transformation', () => {
							const [{inverseTransformation: {a, b, c, d}}] = drawCallbackSpy.mock.calls[0];
							expect(a).toBeCloseTo(0.5);
							expect(b).toBeCloseTo(0.5);
							expect(c).toBeCloseTo(-1);
							expect(d).toBeCloseTo(1);
						});
					});

					describe('and then a rotation happens', () => {

						beforeEach(() => {
							drawCallbackSpy.mockClear();
							const originalX = 10;
							const subsequentX = originalX + 25; // A horizontal difference of 25 leads to a rotation of 45 degrees, cf src/transformer/rotate.ts
							mouseDownListener({clientX: originalX, clientY: 10, preventDefault(){}, button: 1});
							mouseMoveListener({clientX: subsequentX, clientY: 10, preventDefault(){}, button: 1})
						});
	
						it('should have drawn using an inverse transformation that corresponds to a scaling followed by a rotation', () => {
							const [{inverseTransformation: {a, b, c, d}}] = drawCallbackSpy.mock.calls[0];
							const halfSqrt2 = Math.sqrt(2) / 2;
							const quarterSqrt2 = Math.sqrt(2) / 4;
							expect(a).toBeCloseTo(quarterSqrt2);
							expect(b).toBeCloseTo(-quarterSqrt2);
							expect(c).toBeCloseTo(halfSqrt2);
							expect(d).toBeCloseTo(halfSqrt2);
						});
					})
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