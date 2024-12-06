import { beforeEach, beforeAll, describe, expect, it, vi, type Mock} from 'vitest'
import InfiniteCanvas from "src/infinite-canvas"
import { InfiniteCanvas as InfiniteCanvasInterface } from 'api/infinite-canvas';
import { InfiniteCanvasRenderingContext2D } from "api/infinite-canvas-rendering-context-2d"
import { CanvasContextMock } from "./canvas-context-mock";
import { DrawEvent, EventMap } from "api/event-map";

class MockResizeObserver implements ResizeObserver{
	public disconnect(): void {
		
	}
	public observe(): void {
		
	}
	public unobserve(): void {
		
	}
}

describe("an infinite canvas", () => {
	let infiniteCanvas: InfiniteCanvasInterface;
	let canvas: HTMLCanvasElement;
	let boundingClientRectWidth: number;
	let boundingClientRectHeight: number;
	let canvasContextMock: CanvasContextMock;

	function createMouseEvent(type: string, init: MouseEventInit): MouseEvent{
		const result = new MouseEvent(type, init);
		Object.defineProperty(result, 'offsetX', {value: result.clientX});
		Object.defineProperty(result, 'offsetY', {value: result.clientY});
		return result;
	}

	function createPointerEvent(type: string, init: PointerEventInit): PointerEvent{
		const result = new MouseEvent(type, init);
		Object.defineProperty(result, 'offsetX', {value: result.clientX});
		Object.defineProperty(result, 'offsetY', {value: result.clientY});
		Object.defineProperty(result, 'pointerId', {value: init.pointerId})
		return <PointerEvent>result;
	}

	beforeAll(() => {
		globalThis.ResizeObserver = MockResizeObserver;
	})

	beforeEach(() => {
		boundingClientRectWidth = 100;
		boundingClientRectHeight = 100;
		canvasContextMock = new CanvasContextMock();
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {cb(0);return 0;});
		canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 100;
		document.body.appendChild(canvas);
		vi.spyOn(canvas, 'getBoundingClientRect').mockImplementation(() => {
			return {
				width: boundingClientRectWidth,
				height: boundingClientRectHeight,
				x: 0,
				y: 0,
				left: 0,
				top: 0,
				right: boundingClientRectWidth,
				bottom: boundingClientRectHeight,
				toJSON(){}
			};
		})
		vi.spyOn(canvas, 'getContext').mockImplementation(() => canvasContextMock.mock)
		infiniteCanvas = new InfiniteCanvas(canvas);
		infiniteCanvas.getContext('2d').fillRect(0, 0, 10, 10)
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

	describe("that registers one event listener for both 'mouseup' capturing (using property from AddEventListenerOptions) and 'mouseup' bubbling", () => {
		let mouseupListener: Mock;

		beforeEach(() => {
			mouseupListener = vi.fn();
			infiniteCanvas.addEventListener('mouseup', mouseupListener);
			infiniteCanvas.addEventListener('mouseup', mouseupListener, {capture: true});
		});

		it("should notify the listener twice with the same event when a mouseup captures and bubbles", () => {
			const mouseup = createMouseEvent('mouseup', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(mouseup);

			expect(mouseupListener).toHaveBeenCalledTimes(2);
			const [[firstCallArg], [secondCallArg]] = mouseupListener.mock.calls;
			expect(firstCallArg).toBe(secondCallArg);
		});
	});

	describe("that registers one event listener for both 'mouseup' capturing and 'mouseup' bubbling", () => {
		let mouseupListener: Mock;

		beforeEach(() => {
			mouseupListener = vi.fn();
			infiniteCanvas.addEventListener('mouseup', mouseupListener);
			infiniteCanvas.addEventListener('mouseup', mouseupListener, true);
		});

		it("should notify the listener twice with the same event when a mouseup captures and bubbles", () => {
			const mouseup = createMouseEvent('mouseup', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(mouseup);

			expect(mouseupListener).toHaveBeenCalledTimes(2);
			const [[firstCallArg], [secondCallArg]] = mouseupListener.mock.calls;
			expect(firstCallArg).toBe(secondCallArg);
		});
	});
	
	describe("that registers one event listener for both 'mousedown' capturing and 'mousedown' bubbling", () => {
		let mousedownListener: Mock;

		beforeEach(() => {
			mousedownListener = vi.fn();
			infiniteCanvas.addEventListener('mousedown', mousedownListener);
			infiniteCanvas.addEventListener('mousedown', mousedownListener, true);
		});

		it("should notify the listener twice with the same event when a mousedown captures and bubbles", () => {
			const pointerdown = createPointerEvent('pointerdown', {clientX: 20, clientY: 20, pointerId: 0})
			const mousedown = createMouseEvent('mousedown', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(pointerdown);
			canvas.dispatchEvent(mousedown);

			expect(mousedownListener).toHaveBeenCalledTimes(2);
			const [[firstCallArg], [secondCallArg]] = mousedownListener.mock.calls;
			expect(firstCallArg).toBe(secondCallArg);
		});
	});

	describe("that registers two 'click' capturing listeners and one 'click' bubbling listener", () => {
		let otherCaptureClickListener: Mock;
		let bubbleClickListener: Mock;

		beforeEach(() => {
			otherCaptureClickListener = vi.fn();
			bubbleClickListener = vi.fn();
			infiniteCanvas.addEventListener('click', e => {
				e.stopImmediatePropagation();
			}, true);
			infiniteCanvas.addEventListener('click', otherCaptureClickListener, true);
			infiniteCanvas.addEventListener('click', bubbleClickListener);
		});

		it("should not notify either the other capturing listener or the bubbling listener", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click)

			expect(otherCaptureClickListener).not.toHaveBeenCalled();
			expect(bubbleClickListener).not.toHaveBeenCalled();
		});
	});

	describe("that registers a 'click' listener that stops immediate propagation of the native event", () => {
		let secondCanvasListener: Mock;

		beforeEach(() => {
			secondCanvasListener = vi.fn();
			infiniteCanvas.addEventListener('click', e => e.stopImmediatePropagation())
			canvas.addEventListener('click', secondCanvasListener);
		});

		it("should stop immediate propagation of the native event", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20, cancelable: true});
			canvas.dispatchEvent(click)
			expect(secondCanvasListener).not.toHaveBeenCalled();
		});
	});

	describe("that registers a 'click' listener that prevents default", () => {
		let infiniteCanvasEvent: EventMap['click'];

		beforeEach(() => {
			infiniteCanvas.addEventListener('click', e => {
				e.preventDefault();
				infiniteCanvasEvent = e;
			});
		});

		it("should prevent default on a native click event", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20, cancelable: true});
			canvas.dispatchEvent(click)
			expect(click.defaultPrevented).toBe(true);
			expect(infiniteCanvasEvent).toBeTruthy();
			expect(infiniteCanvasEvent.cancelable).toBe(true);
			expect(infiniteCanvasEvent.defaultPrevented).toBe(true);
		});
	});

	describe("that registers two 'click' bubbling listeners, the first of which stops immediate propagation", () => {
		let clickListener: Mock;

		beforeEach(() => {
			clickListener = vi.fn();
			infiniteCanvas.addEventListener('click', ev => {
				ev.stopImmediatePropagation()
			});
			infiniteCanvas.addEventListener('click', clickListener);
		});

		it("should not notify the listener when a click captures and bubbles", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);

			expect(clickListener).not.toHaveBeenCalled();
		});
	});

	describe("that registers two 'click' capturing listeners, the first of which stops immediate propagation", () => {
		let clickListener: Mock;

		beforeEach(() => {
			clickListener = vi.fn();
			infiniteCanvas.addEventListener('click', ev => {
				ev.stopImmediatePropagation()
			}, true);
			infiniteCanvas.addEventListener('click', clickListener, true);
		});

		it("should not notify the listener when a click captures and bubbles", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);

			expect(clickListener).not.toHaveBeenCalled();
		});
	});

	describe("that registers a capturing 'click' listener that stops propagation", () => {
		let bubblingClickListener: Mock;

		beforeEach(() => {
			bubblingClickListener = vi.fn();
			infiniteCanvas.addEventListener('click', ev => {ev.stopPropagation()}, true);
			infiniteCanvas.addEventListener('click', bubblingClickListener);
		});

		it("should not notify the listener when a click captures and bubbles", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);

			expect(bubblingClickListener).not.toHaveBeenCalled();
		});
	});

	describe("that registers one listener object  for capturing 'click' and another for bubbling 'click'", () => {
		let captureClickListener: Mock;
		let captureClickListenerObject: EventListenerObject;
		let bubbleClickListener: Mock;
		let bubbleClickListenerObject: EventListenerObject;
		let capturingListenerThisArg: any;
		let bubblingListenerThisArg: any;

		beforeEach(() => {
			captureClickListener = vi.fn();
			bubbleClickListener = vi.fn();
			captureClickListenerObject = {
				handleEvent(evt: Event): void {
					capturingListenerThisArg = this;
					captureClickListener(evt);
				}
			};
			bubbleClickListenerObject = {
				handleEvent(evt: Event): void {
					bubblingListenerThisArg = this;
					bubbleClickListener(evt);
				}
			};
			infiniteCanvas.addEventListener('click', captureClickListenerObject, true);
			infiniteCanvas.addEventListener('click', bubbleClickListenerObject);
		});

		it("should notify the listeners with the same event when a click captures and bubbles", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);

			expect(captureClickListener).toHaveBeenCalledTimes(1);
			expect(bubbleClickListener).toHaveBeenCalledTimes(1);
			const [[firstCallArg]] = captureClickListener.mock.calls;
			const [[secondCallArg]] = bubbleClickListener.mock.calls;
			expect(firstCallArg).toBe(secondCallArg);
			expect(capturingListenerThisArg).toBe(captureClickListenerObject);
			expect(bubblingListenerThisArg).toBe(bubbleClickListenerObject);
		});

		describe("and then the capturing listener is removed", () => {

			beforeEach(() => {
				infiniteCanvas.removeEventListener('click', captureClickListenerObject, true);
				bubbleClickListener.mockClear();
				captureClickListener.mockClear();
			});

			it("should notify only the bubbling listener when a click captures and bubbles", () => {
				const click = createMouseEvent('click', {clientX: 20, clientY: 20});
				canvas.dispatchEvent(click);

				expect(captureClickListener).toHaveBeenCalledTimes(0);
				expect(bubbleClickListener).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("that prevents default for mousedown", () => {
		let defaultPrevented: boolean;
		let nativeDefaultPrevented: boolean;

		beforeEach(() => {
			infiniteCanvas.addEventListener('mousedown', ev => ev.preventDefault(), true);
			infiniteCanvas.addEventListener('mousedown', ev => {
				defaultPrevented = ev.defaultPrevented;
				nativeDefaultPrevented = ev.nativeDefaultPrevented;
			});
			const mouseDown = createMouseEvent('mousedown', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(mouseDown);
		});

		it("should have the right values for 'defaultPrevented' and 'nativeDefaultPrevented' in the event", () => {
			expect(defaultPrevented).toBe(true);
			expect(nativeDefaultPrevented).toBe(false);
		});
	});

	describe("that registers one listener for capturing 'click' and another for bubbling 'click'", () => {
		let captureClickListener: Mock;
		let bubbleClickListener: Mock;

		beforeEach(() => {
			captureClickListener = vi.fn();
			bubbleClickListener = vi.fn();
			infiniteCanvas.addEventListener('click', captureClickListener, true);
			infiniteCanvas.addEventListener('click', bubbleClickListener);
		});

		it("should notify the listeners with the same event when a click captures and bubbles", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);

			expect(captureClickListener).toHaveBeenCalledTimes(1);
			expect(bubbleClickListener).toHaveBeenCalledTimes(1);
			const [[firstCallArg]] = captureClickListener.mock.calls;
			const [[secondCallArg]] = bubbleClickListener.mock.calls;
			expect(firstCallArg).toBe(secondCallArg);
		});

		describe("and then the capturing listener is removed", () => {

			beforeEach(() => {
				infiniteCanvas.removeEventListener('click', captureClickListener, true);
				bubbleClickListener.mockClear();
				captureClickListener.mockClear();
			});

			it("should notify only the bubbling listener when a click captures and bubbles", () => {
				const click = createMouseEvent('click', {clientX: 20, clientY: 20});
				canvas.dispatchEvent(click);

				expect(captureClickListener).toHaveBeenCalledTimes(0);
				expect(bubbleClickListener).toHaveBeenCalledTimes(1);
			});
		});

		describe("and then the capturing listener is removed using the property from EventListenerOptions", () => {

			beforeEach(() => {
				infiniteCanvas.removeEventListener('click', captureClickListener, {capture: true});
				bubbleClickListener.mockClear();
				captureClickListener.mockClear();
			});

			it("should notify only the bubbling listener when a click captures and bubbles", () => {
				const click = createMouseEvent('click', {clientX: 20, clientY: 20});
				canvas.dispatchEvent(click);

				expect(captureClickListener).toHaveBeenCalledTimes(0);
				expect(bubbleClickListener).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("that registers one event listener for both 'click' capturing and 'click' bubbling", () => {
		let clickListener: Mock;

		beforeEach(() => {
			clickListener = vi.fn();
			infiniteCanvas.addEventListener('click', clickListener);
			infiniteCanvas.addEventListener('click', clickListener, true);
		});

		it("should notify the listener twice with the same event when a click captures and bubbles", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);

			expect(clickListener).toHaveBeenCalledTimes(2);
			const [[firstCallArg], [secondCallArg]] = clickListener.mock.calls;
			expect(firstCallArg).toBe(secondCallArg);
		});

		describe("and then the listener is removed from the capturing phase", () => {

			beforeEach(() => {
				infiniteCanvas.removeEventListener('click', clickListener, true);
			});

			it("should notify the listener once when a click captures and bubbles", () => {
				const click = createMouseEvent('click', {clientX: 20, clientY: 20});
				canvas.dispatchEvent(click);

				expect(clickListener).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("that registers a bubbling listener for 'click'", () => {
		let thisArg: any;

		beforeEach(() => {
			infiniteCanvas.addEventListener('click', function(ev){
				thisArg = this;
			});
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);
		});

		it("should have notified the listener with a this that is the infinite canvas", () => {
			expect(thisArg).toBe(infiniteCanvas);
		});
	});

	describe("that registers a capturing listener for 'click'", () => {
		let thisArg: any;

		beforeEach(() => {
			infiniteCanvas.addEventListener('click', function(ev){
				thisArg = this;
			}, true);
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);
		});

		it("should have notified the listener with a this that is the infinite canvas", () => {
			expect(thisArg).toBe(infiniteCanvas);
		});
	});
	
	describe("that registers the same event listener for 'click' twice", () => {
		let clickListener: Mock;

		beforeEach(() => {
			clickListener = vi.fn();
			infiniteCanvas.addEventListener('click', clickListener);
			infiniteCanvas.addEventListener('click', clickListener);
		});

		it("should notify the listener only once when a click bubbles", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);

			expect(clickListener).toHaveBeenCalledTimes(1);
		});
	});

	describe("that registers two listeners for click", () => {
		let firstClickListener: Mock;
		let secondClickListener: Mock;

		beforeEach(() => {
			firstClickListener = vi.fn();
			secondClickListener = vi.fn();
			infiniteCanvas.addEventListener('click', firstClickListener);
			infiniteCanvas.addEventListener('click', secondClickListener);
		});

		it("should notify the listeners with the same event", () => {
			const click = createMouseEvent('click', {clientX: 20, clientY: 20});
			canvas.dispatchEvent(click);

			expect(firstClickListener).toHaveBeenCalledTimes(1);
			expect(secondClickListener).toHaveBeenCalledTimes(1);
			const [[firstListenerArg]] = firstClickListener.mock.calls;
			const [[secondListenerArg]] = secondClickListener.mock.calls;
			expect(firstListenerArg).toBe(secondListenerArg);
		});
	});

	describe('that registers an event listener for transformationstart via an event listener property', () => {
		let transformationStartListener: Mock;

		beforeEach(() => {
			transformationStartListener = vi.fn();
			infiniteCanvas.ontransformationstart = transformationStartListener;
		});

		it('should notify the listener', () => {
			const pointerdown = createPointerEvent('pointerdown', {clientX: 20, clientY: 20, button: 0, pointerId: 0});
			const mousedown = createMouseEvent('mousedown', {clientX: 20, clientY: 20, button: 0});
			const pointermove = createPointerEvent('pointermove', {clientX: 30, clientY: 20, pointerId: 0})
			const mousemove = createMouseEvent('mousemove', {clientX: 30, clientY: 20});
			canvas.dispatchEvent(pointerdown);
			canvas.dispatchEvent(mousedown);
			canvas.dispatchEvent(pointermove);
			canvas.dispatchEvent(mousemove);

			expect(transformationStartListener).toHaveBeenCalledTimes(1);
		});

		describe('and then removes the listener via the event listener property', () => {

			beforeEach(() => {
				infiniteCanvas.ontransformationstart = null;
				transformationStartListener.mockReset();
			});

			it('should no longer notify the listener', () => {
				const pointerdown = createPointerEvent('pointerdown', {clientX: 20, clientY: 20, button: 0, pointerId: 0});
				const mousedown = createMouseEvent('mousedown', {clientX: 20, clientY: 20, button: 0});
				const pointermove = createPointerEvent('pointermove', {clientX: 30, clientY: 20, pointerId: 0})
				const mousemove = createMouseEvent('mousemove', {clientX: 30, clientY: 20});
				canvas.dispatchEvent(pointerdown);
				canvas.dispatchEvent(mousedown);
				canvas.dispatchEvent(pointermove);
				canvas.dispatchEvent(mousemove);
	
				expect(transformationStartListener).not.toHaveBeenCalled();
			});
		});
	});

	describe("that registers one event listener for both 'transformationStart' capturing and 'transformationStart' bubbling", () => {
		let transformationStartListener: Mock;

		beforeEach(() => {
			transformationStartListener = vi.fn();
			infiniteCanvas.addEventListener('transformationstart', transformationStartListener, true);
			infiniteCanvas.addEventListener('transformationstart', transformationStartListener);
		});

		it("should notify the listener twice with the same event when a transformationStart captures and bubbles", () => {
			const pointerdown = createPointerEvent('pointerdown', {clientX: 20, clientY: 20, button: 0, pointerId: 0});
			const mousedown = createMouseEvent('mousedown', {clientX: 20, clientY: 20, button: 0});
			const pointermove = createPointerEvent('pointermove', {clientX: 30, clientY: 20, pointerId: 0})
			const mousemove = createMouseEvent('mousemove', {clientX: 30, clientY: 20});
			canvas.dispatchEvent(pointerdown);
			canvas.dispatchEvent(mousedown);
			canvas.dispatchEvent(pointermove);
			canvas.dispatchEvent(mousemove);

			expect(transformationStartListener).toHaveBeenCalledTimes(2);
			const [[firstCallArg], [secondCallArg]] = transformationStartListener.mock.calls;
			expect(firstCallArg).toBe(secondCallArg);
		});
	});

	describe("that registers one event listener for both 'draw' capturing and 'draw' bubbling", () => {
		let drawListener: Mock;

		beforeEach(() => {
			drawListener = vi.fn();
			infiniteCanvas.addEventListener('draw', drawListener, true);
			infiniteCanvas.addEventListener('draw', drawListener);
		});

		it("should notify the listener twice with the same event when a draw captures and bubbles", () => {
			const pointerdown = createPointerEvent('pointerdown', {clientX: 20, clientY: 20, button: 0, pointerId: 0})
			const mousedown = createMouseEvent('mousedown', {clientX: 20, clientY: 20, button: 0});
			const pointermove = createPointerEvent('pointermove', {clientX: 30, clientY: 20, pointerId: 0})
			const mousemove = createMouseEvent('mousemove', {clientX: 30, clientY: 20});
			canvas.dispatchEvent(pointerdown);
			canvas.dispatchEvent(mousedown);
			canvas.dispatchEvent(pointermove);
			canvas.dispatchEvent(mousemove);

			expect(drawListener).toHaveBeenCalledTimes(2);
			const [[firstCallArg], [secondCallArg]] = drawListener.mock.calls;
			expect(firstCallArg).toBe(secondCallArg);
		});
	});

	describe("that registers a listener to 'draw'", () => {
		let drawCallbackSpy: Mock<(ev: DrawEvent) => void>;

		beforeEach(() => {
			
			drawCallbackSpy = vi.fn();
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
							const touch1 = {identifier: 0, clientX:0, clientY: 0, target: canvas} as unknown as Touch;
							const touch2 = {identifier: 1, clientX:10, clientY: 0, target: canvas} as unknown as Touch;
							const pointerdown1 = createPointerEvent('pointerdown', {clientX:0, clientY: 0, pointerId: 0});
							const touchStart1 = new TouchEvent('touchstart', {changedTouches: [touch1], targetTouches: [touch1], cancelable: true})
							canvas.dispatchEvent(pointerdown1);
							canvas.dispatchEvent(touchStart1);
							const pointerdown2 = createPointerEvent('pointerdown', {clientX:10, clientY: 0, pointerId: 1});
							const touchStart2 = new TouchEvent('touchstart', {changedTouches: [touch2], targetTouches: [touch1, touch2], cancelable: true})
							canvas.dispatchEvent(pointerdown2);
							canvas.dispatchEvent(touchStart2);
							const pointer2move = createPointerEvent('pointermove', {clientX:10, clientY: 10, pointerId: 1})
							const touch2Changed = {identifier: 1, clientX:10, clientY: 10, target: canvas} as unknown as Touch;
							const touchMove = new TouchEvent('touchmove', {changedTouches: [touch2Changed]});
							canvas.dispatchEvent(pointer2move);
							canvas.dispatchEvent(touchMove);
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
							const pointerdown = createPointerEvent('pointerdown', {clientX: originalX, clientY:10, button: 1, pointerId: 0})
							const mousedown = createMouseEvent('mousedown', {clientX: originalX, clientY:10, button: 1});
							const pointermove = createPointerEvent('pointermove', {clientX: subsequentX, clientY: 10, button: 1, pointerId: 0})
							const mousemove = createMouseEvent('mousemove', {clientX: subsequentX, clientY: 10, button: 1});
							canvas.dispatchEvent(pointerdown)
							canvas.dispatchEvent(mousedown);
							canvas.dispatchEvent(pointermove);
							canvas.dispatchEvent(mousemove);
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
					const pointerdown = createPointerEvent('pointerdown', {clientX: 10, clientY:10, button: 0, pointerId: 0});
					const mousedown = createMouseEvent('mousedown', {clientX: 10, clientY:10, button: 0});
					const pointermove = createPointerEvent('pointermove', {clientX: 20, clientY: 10, button: 0, pointerId: 0})
					const mousemove = createMouseEvent('mousemove', {clientX: 20, clientY: 10, button: 0});
					canvas.dispatchEvent(pointerdown);
					canvas.dispatchEvent(mousedown);
					canvas.dispatchEvent(pointermove);
					canvas.dispatchEvent(mousemove);
				});

				it("should have called the listener", () => {
					expect(drawCallbackSpy).toHaveBeenCalled();
				});
			});
		});

		describe("with 'once'  true", () => {

			beforeEach(() => {
				infiniteCanvas.addEventListener("draw", (e) => {
					drawCallbackSpy(e);
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
