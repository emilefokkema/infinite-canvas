import { beforeEach, describe, expect, it} from 'vitest'
import {CanvasContextMock} from "./canvas-context-mock";
import {InfiniteCanvasRenderingContext2D} from "api/infinite-canvas-rendering-context-2d";
import { createInfiniteCanvasTestFixture } from './infinite-canvas-test-fixture';

describe('an infinite canvas context', () => {
	let infiniteContext: InfiniteCanvasRenderingContext2D;
	let contextMock: CanvasContextMock;

    beforeEach(() => {
		({contextMock, infiniteContext} = createInfiniteCanvasTestFixture());
	});

    describe("that makes a path with zero area and strokes it", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(20, 20);
			infiniteContext.lineTo(30, 30);
			infiniteContext.stroke();
		});

		describe("and then clears an area overlapping but not covering the path", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(25, 25, 30, 30);
			});

			it("should have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that makes a path, fills a rect, fills the path, begins a new path and then clears a rect containing the first drawn path", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(0, 0);
			infiniteContext.lineTo(1, 0);
			infiniteContext.lineTo(1, 1);
			infiniteContext.lineTo(0, 1);
			infiniteContext.lineTo(0, 0);
			infiniteContext.fillRect(3, 3, 1, 1);
			infiniteContext.fill();
			infiniteContext.beginPath();
			contextMock.clear();
			infiniteContext.clearRect(-1, -1, 3, 3);
		});

		it("should forget the first drawn path", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that draws a triangular path and then clears a rect outside the triangle", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(0, 0);
			infiniteContext.lineTo(4, 0);
			infiniteContext.lineTo(0, 4);
			infiniteContext.fill();
			contextMock.clear();
			infiniteContext.clearRect(3, 3, 2, 2);
		});

		it("should not have added a clearRect", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills a rect and adds a clearRect that partially covers it", () => {

		beforeEach(() => {
			infiniteContext.fillRect(50, 50, 50, 50);
			infiniteContext.clearRect(40, 40, 20, 20);
		});

		describe("and then adds a clearRect with negative width and height that covers the previous clearRect entirely", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(75, 75, -50, -50);
			});

			it("should end up with only one clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that begins path", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
		});

		describe("and then changes state and fills a rect", () => {

			beforeEach(() => {
				infiniteContext.fillStyle = "#f00";
				contextMock.clear();
				infiniteContext.fillRect(0, 0, 2, 2);
			});

			it("should have remembered the state change", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then adds a rect to the path and fills it", () => {

				beforeEach(() => {
					infiniteContext.rect(0, 2, 2, 2);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should do that using the same changed state", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then changes state, begins a new path and fills it", () => {

			beforeEach(() => {
				infiniteContext.fillStyle = "#f00";
				infiniteContext.beginPath();
				infiniteContext.rect(0, 0, 2, 2);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should have remembered the state change", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then builds it and fills it", () => {

			beforeEach(() => {
				infiniteContext.moveTo(0,0);
				infiniteContext.lineTo(3, 0);
				infiniteContext.lineTo(0, 3);
				infiniteContext.closePath();
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should have executed the new instructions", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then clears an area that is outside the drawn area", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(10, 10, 1, 1);
				});

				it("should not have done anything", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then clears a smaller area than the one that was closed and adds another instruction", () => {

				beforeEach(() => {
					infiniteContext.clearRect(0, 0, 2, 2);
					infiniteContext.strokeStyle = "#f00";
					infiniteContext.beginPath();
					infiniteContext.moveTo(0,0);
					infiniteContext.lineTo(2, 0);
					contextMock.clear();
					infiniteContext.stroke();
				});

				it("should still have executed the instructions in the completed area and should have added a clear rect instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears an area containing all previous instructions", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(-1, -1, 4, 4);
					});

					it("should have cleared a rectangle once", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});

					describe("and then draws something else", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.fillRect(0, 0, 1, 1);
						});

						it("should have cleared a rectangle once more", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});
			});
			
		});
	});

    describe("that alters its state and draws a rectangle", () => {

		beforeEach(() => {
			infiniteContext.strokeStyle = "#f00";
			infiniteContext.fillStyle = "#00f";
			contextMock.clear();
			infiniteContext.fillRect(1,1,1,1);
		});

		it("should have called the context methods", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then clears a rectangle containing the drawing", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(0, 0, 3, 3);
			});

			it("should have cleared a rectangle and nothing else", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that fills a rectangle, fills a smaller rectangle inside it and clears a rectangle containing the small one but not the big one", () => {

		beforeEach(() => {
			infiniteContext.fillRect(0, 0, 5, 5);
			infiniteContext.fillRect(2, 2, 1, 1);
			contextMock.clear();
			infiniteContext.clearRect(1, 1, 3, 3);
		});

		it("should forget all about the second rectangle", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that fills a rectangle, clears part of it and then clears a bigger part of it", () => {

		beforeEach(() => {
			infiniteContext.fillRect(0, 0, 5, 5);
			infiniteContext.clearRect(2, 2, 1, 1);
			contextMock.clear();
			infiniteContext.clearRect(1, 1, 3, 3);
		});

		it("should end up with only one clear rect instruction", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

})