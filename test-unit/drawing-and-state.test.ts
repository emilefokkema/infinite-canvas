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

    describe("whose state is changed and who draws something", () => {
		let red: string;
		let blue: string;

		beforeEach(() => {
			red = "#f00";
			blue = "#00f";
			infiniteContext.fillStyle = red;
			infiniteContext.fillRect(1, 1, 2, 2);
		});

		it("should have modified the context correctly", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and who changes state, draws something, changes state back and draws something again", () => {

			beforeEach(() => {
				infiniteContext.fillStyle = blue;
				infiniteContext.fillRect(5, 1, 2, 2);
				infiniteContext.fillStyle = red;
				contextMock.clear();
				infiniteContext.fillRect(9, 1, 2, 2);
			});

			it("should have set a new state three times", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and who then clears a rect containing the second drawing", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(5, 1, 2, 2);
				});

				it("should only have set the remaining state", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and which then changes the state and clears part of the drawing and draws something else", () => {

			beforeEach(() => {
				infiniteContext.fillStyle = blue;
				infiniteContext.clearRect(2, 0, 4, 4);
				contextMock.clear();
				infiniteContext.fillRect(3, 1, 1, 1);
			});

			it("should have drawn using the state from before the clearing", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and which then clears an area containing that instruction", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(0, 0, 4, 4);
			});

			it("should have cleared a rectangle", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and which then draws something else without changing the state", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.fillRect(1, 1, 2, 2);
				});

				it("should have cleared a rect only once more and should still use the old state", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and which then draws something else", () => {

				beforeEach(() => {
					infiniteContext.fillStyle = blue;
					contextMock.clear();
					infiniteContext.fillRect(1, 1, 2, 2);
				});

				it("should have cleared a rect only once more and should not have executed the old instruction again", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and which then draws something else", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fillRect(4, 1, 2, 2);
			});

			it("should not have altered the state", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and which then clears the first part", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(0, 0, 3.5, 4);
				});

				it("should have remembered the state for the second part", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and which then clears the first part and part of the second", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(0, 0, 4.5, 4);
				});

				it("should have remembered the state for the second part", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

    describe("that saves state, begins a path, restores state and fills a rect", () => {

		beforeEach(() => {
			infiniteContext.save();
			infiniteContext.beginPath();
			infiniteContext.moveTo(1, 1);
			infiniteContext.restore();
			contextMock.clear();
			infiniteContext.fillRect(0, 0, 1, 1);
		});

		it("should end up with an equal number of saves and restores", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that saves, creates a path, fills two rects, restores and strokes", () => {

		beforeEach(() => {
			infiniteContext.save();
			infiniteContext.translate(1, 1);
			infiniteContext.beginPath();
			infiniteContext.rect(0, 0, 1, 1);
			infiniteContext.save();
			infiniteContext.fillRect(0, 0, 1, 1);
			infiniteContext.fillRect(0, 0, 1, 1);
			infiniteContext.restore();
			infiniteContext.stroke();
			infiniteContext.restore();
			contextMock.clear();
			infiniteContext.fillRect(0, 0, 1, 1)
		});

		it("should have the same number of saves and restores", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that saves, begins a path, begins another path, fills it, restores and then fills a rect", () => {

		beforeEach(() => {
			infiniteContext.save();
			infiniteContext.beginPath();
			infiniteContext.moveTo(0, 0);
			infiniteContext.beginPath();
			infiniteContext.moveTo(0, 0);
			infiniteContext.lineTo(2, 0);
			infiniteContext.lineTo(2, 2);
			infiniteContext.fill();
			infiniteContext.restore();
			contextMock.clear();
			infiniteContext.fillRect(0, 0, 1, 1);
		});

		it("should end up with an equal number of saves and restores", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that does this", () => {

		beforeEach(() => {
			infiniteContext.save();
			infiniteContext.fillStyle = '#f00';
			infiniteContext.translate(10, 10);
			infiniteContext.fillRect(0, 0, 25, 25);
			infiniteContext.restore();
			infiniteContext.save();
			infiniteContext.fillStyle = '#f00';
			infiniteContext.translate(60, 10);
			contextMock.clear();
			infiniteContext.fillRect(0, 0, 25, 25);
		});

		it("should have done this", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that draws a path, transforms and then strokes", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(10, 10, 100, 100);
			infiniteContext.lineWidth = 6;
			infiniteContext.transform(.2, 0, 0, 1, 0, 0);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should have kept that order", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that draws a square by translating", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.translate(1, 0);
			infiniteContext.moveTo(0,0);
			infiniteContext.translate(0, 1);
			infiniteContext.lineTo(0,0);
			infiniteContext.translate(-1,0);
			infiniteContext.lineTo(0,0);
			infiniteContext.translate(0, -1);
			infiniteContext.lineTo(0,0);
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should have called transform before each move", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then partly clears the drawn square", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(0.5, 0, 2, 2);
			});

			it("should have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then fully clears the drawn square", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(-1, -1, 3, 3);
			});

			it("should not have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe('that saves and fills a rect', () => {

		beforeEach(() => {
			infiniteContext.save();
			infiniteContext.fillRect(10, 10, 20, 20)
		});

		it("should call restore() after drawing", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	})

    describe("saves, changes state, begins drawing a path", () => {

		beforeEach(() => {
			infiniteContext.fillStyle = "#f00";
			infiniteContext.save();
			infiniteContext.fillStyle = "#00f";
			infiniteContext.beginPath();
			infiniteContext.rect(0, 0, 10, 10);
			
		});

		describe("and then restores to the previous state, fills a rect and then fills the path", () => {

			beforeEach(() => {
				infiniteContext.restore();
				infiniteContext.fillRect(10, 10, 20, 20);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should end up with an equal number of saves and restores", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then fills a rect, restores to the previous state and then fills the path", () => {

			beforeEach(() => {
				infiniteContext.fillRect(10, 10, 20, 20);
				infiniteContext.restore();
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should end up with an equal number of saves and restores", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});


})