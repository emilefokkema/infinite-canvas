import { InfiniteCanvasViewBox } from "../src/infinite-canvas-viewbox"
import { InfiniteContext } from "../src/infinite-context/infinite-context";
import { ViewBox } from "../src/viewbox";
import { CanvasContextMock } from "./canvas-context-mock";

describe("an infinite canvas context", () => {
	let width: number;
	let height: number;
	let infiniteContext: InfiniteContext;
	let contextMock: CanvasContextMock;

	beforeEach(() => {
		width = 200;
		height = 200;
		contextMock = new CanvasContextMock();
		const context: any = contextMock.mock;
		let viewbox: ViewBox = new InfiniteCanvasViewBox(width, height, context);
		infiniteContext = new InfiniteContext(undefined, viewbox);
	});

	describe("whose state is changed", () => {

		beforeEach(() => {
			infiniteContext.fillStyle = "#f00";
		});

		describe("and then draws something", () => {

			beforeEach(() => {
				infiniteContext.fillRect(0, 0, 20, 20);
			});

			it("should have modified the context correctly", () => {
				expect(contextMock.getLog()).toEqual( [
				'context.clearRect(0,0,200,200)',
				'context.setLineDash([])',
				'context.fillStyle = "#f00"',
				'context.strokeStyle = "#000"',
				'context.beginPath()',
				'context.moveTo(0,0)',
				'context.lineTo(20,0)',
				'context.lineTo(20,20)',
				'context.lineTo(0,20)',
				'context.lineTo(0,0)',
				'context.fill()' ])
			});
		});
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
			expect(contextMock.getLog()).toEqual([
			'context.clearRect(0,0,200,200)',
			'context.setLineDash([])',
			'context.fillStyle = "#f00"',
			'context.strokeStyle = "#000"',
			'context.beginPath()',
			'context.moveTo(1,1)',
			'context.lineTo(3,1)',
			'context.lineTo(3,3)',
			'context.lineTo(1,3)',
			'context.lineTo(1,1)',
			'context.fill()' ])
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
				expect(contextMock.getLog()).toEqual( [
				'context.clearRect(0,0,200,200)',
				'context.setLineDash([])',
				'context.fillStyle = "#f00"',
				'context.strokeStyle = "#000"',
				'context.beginPath()',
				'context.moveTo(1,1)',
				'context.lineTo(3,1)',
				'context.lineTo(3,3)',
				'context.lineTo(1,3)',
				'context.lineTo(1,1)',
				'context.fill()',
				'context.fillStyle = "#00f"',
				'context.beginPath()',
				'context.moveTo(5,1)',
				'context.lineTo(7,1)',
				'context.lineTo(7,3)',
				'context.lineTo(5,3)',
				'context.lineTo(5,1)',
				'context.fill()',
				'context.fillStyle = "#f00"',
				'context.beginPath()',
				'context.moveTo(9,1)',
				'context.lineTo(11,1)',
				'context.lineTo(11,3)',
				'context.lineTo(9,3)',
				'context.lineTo(9,1)',
				'context.fill()' ])
			});

			describe("and who then clears a rect containing the second drawing", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(5, 1, 2, 2);
				});

				it("should only have set the remaining state", () => {
					expect(contextMock.getLog()).toEqual([
					'context.clearRect(0,0,200,200)',
					'context.setLineDash([])',
					'context.fillStyle = "#f00"',
					'context.strokeStyle = "#000"',
					'context.beginPath()',
					'context.moveTo(1,1)',
					'context.lineTo(3,1)',
					'context.lineTo(3,3)',
					'context.lineTo(1,3)',
					'context.lineTo(1,1)',
					'context.fill()',
					'context.beginPath()',
					'context.moveTo(9,1)',
					'context.lineTo(11,1)',
					'context.lineTo(11,3)',
					'context.lineTo(9,3)',
					'context.lineTo(9,1)',
					'context.fill()' ])
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
				expect(contextMock.getLog()).toEqual([
				'context.clearRect(0,0,200,200)',
				'context.setLineDash([])',
				'context.fillStyle = "#f00"',
				'context.strokeStyle = "#000"',
				'context.beginPath()',
				'context.moveTo(1,1)',
				'context.lineTo(3,1)',
				'context.lineTo(3,3)',
				'context.lineTo(1,3)',
				'context.lineTo(1,1)',
				'context.fill()',
				'context.save()',
				'context.setTransform(1,0,0,1,0,0)',
				'context.clearRect(2,0,4,4)',
				'context.restore()',
				'context.fillStyle = "#00f"',
				'context.beginPath()',
				'context.moveTo(3,1)',
				'context.lineTo(4,1)',
				'context.lineTo(4,2)',
				'context.lineTo(3,2)',
				'context.lineTo(3,1)',
				'context.fill()' ])
			});
		});

		describe("and which then clears an area containing that instruction", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(0, 0, 4, 4);
			});

			it("should have cleared a rectangle", () => {
				expect(contextMock.getLog()).toEqual([ 
				'context.clearRect(0,0,200,200)'
				])
			});

			describe("and which then draws something else without changing the state", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.fillRect(1, 1, 2, 2);
				});

				it("should have cleared a rect only once more and should still use the old state", () => {
					expect(contextMock.getLog()).toEqual( [ 
					'context.clearRect(0,0,200,200)',
					'context.setLineDash([])',
					'context.fillStyle = "#f00"',
					'context.strokeStyle = "#000"',
					'context.beginPath()',
					'context.moveTo(1,1)',
					'context.lineTo(3,1)',
					'context.lineTo(3,3)',
					'context.lineTo(1,3)',
					'context.lineTo(1,1)',
					'context.fill()' ])
				});
			});

			describe("and which then draws something else", () => {

				beforeEach(() => {
					infiniteContext.fillStyle = blue;
					contextMock.clear();
					infiniteContext.fillRect(1, 1, 2, 2);
				});

				it("should have cleared a rect only once more and should not have executed the old instruction again", () => {
					expect(contextMock.getLog()).toEqual([
					'context.clearRect(0,0,200,200)',
					'context.setLineDash([])',
					'context.fillStyle = "#00f"',
					'context.strokeStyle = "#000"',
					'context.beginPath()',
					'context.moveTo(1,1)',
					'context.lineTo(3,1)',
					'context.lineTo(3,3)',
					'context.lineTo(1,3)',
					'context.lineTo(1,1)',
					'context.fill()' ])
				});
			});
		});

		describe("and which then draws something else", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fillRect(4, 1, 2, 2);
			});

			it("should not have altered the state", () => {
				expect(contextMock.getLog()).toEqual( [ 
				'context.clearRect(0,0,200,200)',
				'context.setLineDash([])',
				'context.fillStyle = "#f00"',
				'context.strokeStyle = "#000"',
				'context.beginPath()',
				'context.moveTo(1,1)',
				'context.lineTo(3,1)',
				'context.lineTo(3,3)',
				'context.lineTo(1,3)',
				'context.lineTo(1,1)',
				'context.fill()',
				'context.beginPath()',
				'context.moveTo(4,1)',
				'context.lineTo(6,1)',
				'context.lineTo(6,3)',
				'context.lineTo(4,3)',
				'context.lineTo(4,1)',
				'context.fill()' ])
			});

			describe("and which then clears the first part", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(0, 0, 3.5, 4);
				});

				it("should have remembered the state for the second part", () => {
					expect(contextMock.getLog()).toEqual([
					'context.clearRect(0,0,200,200)',
					'context.setLineDash([])',
					'context.fillStyle = "#f00"',
					'context.strokeStyle = "#000"',
					'context.beginPath()',
					'context.moveTo(4,1)',
					'context.lineTo(6,1)',
					'context.lineTo(6,3)',
					'context.lineTo(4,3)',
					'context.lineTo(4,1)',
					'context.fill()' ])
				});
			});

			describe("and which then clears the first part and part of the second", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(0, 0, 4.5, 4);
				});

				it("should have remembered the state for the second part", () => {
					expect(contextMock.getLog()).toEqual([
					'context.clearRect(0,0,200,200)',
					'context.setLineDash([])',
					'context.fillStyle = "#f00"',
					'context.strokeStyle = "#000"',
					'context.beginPath()',
					'context.moveTo(4,1)',
					'context.lineTo(6,1)',
					'context.lineTo(6,3)',
					'context.lineTo(4,3)',
					'context.lineTo(4,1)',
					'context.fill()',
					'context.save()',
					'context.setTransform(1,0,0,1,0,0)',
					'context.clearRect(0,0,4.5,4)',
					'context.restore()' ])
				});
			});
		});
	});

	describe("that begins path", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
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
				expect(contextMock.getLog()).toEqual( [ 
				'context.clearRect(0,0,200,200)',
				'context.setLineDash([])',
				'context.fillStyle = "#000"',
				'context.strokeStyle = "#000"',
				'context.beginPath()',
				'context.moveTo(0,0)',
				'context.lineTo(3,0)',
				'context.lineTo(0,3)',
				'context.closePath()',
				'context.fill()' ])
			});

			describe("and then clears an area that is outside the drawn area", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(10, 10, 1, 1);
				});

				it("should not have done anything", () => {
					expect(contextMock.getLog()).toEqual([])
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
					expect(contextMock.getLog()).toEqual([
					'context.clearRect(0,0,200,200)',
					'context.setLineDash([])',
					'context.fillStyle = "#000"',
					'context.strokeStyle = "#000"',
					'context.beginPath()',
					'context.moveTo(0,0)',
					'context.lineTo(3,0)',
					'context.lineTo(0,3)',
					'context.closePath()',
					'context.fill()',
					'context.save()',
					'context.setTransform(1,0,0,1,0,0)',
					'context.clearRect(0,0,2,2)',
					'context.restore()',
					'context.strokeStyle = "#f00"',
					'context.beginPath()',
					'context.moveTo(0,0)',
					'context.lineTo(2,0)',
					'context.stroke()' ])
				});

				describe("and then clears an area containing all previous instructions", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(-1, -1, 4, 4);
					});

					it("should have cleared a rectangle once", () => {
						expect(contextMock.getLog()).toEqual([
							'context.clearRect(0,0,200,200)' ])
					});

					describe("and then draws something else", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.fillRect(0, 0, 1, 1);
						});

						it("should have cleared a rectangle once more", () => {
							expect(contextMock.getLog()).toEqual( [
							'context.clearRect(0,0,200,200)',
							'context.setLineDash([])',
							'context.fillStyle = "#000"',
							'context.strokeStyle = "#f00"',
							'context.beginPath()',
							'context.moveTo(0,0)',
							'context.lineTo(1,0)',
							'context.lineTo(1,1)',
							'context.lineTo(0,1)',
							'context.lineTo(0,0)',
							'context.fill()' ])
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
			expect(contextMock.getLog()).toEqual( [
			'context.clearRect(0,0,200,200)',
			'context.setLineDash([])',
			'context.fillStyle = "#00f"',
			'context.strokeStyle = "#f00"',
			'context.beginPath()',
			'context.moveTo(1,1)',
			'context.lineTo(2,1)',
			'context.lineTo(2,2)',
			'context.lineTo(1,2)',
			'context.lineTo(1,1)',
			'context.fill()' ])
		});

		describe("and then clears a rectangle containing the drawing", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(0, 0, 3, 3);
			});

			it("should have cleared a rectangle and nothing else", () => {
				expect(contextMock.getLog()).toEqual([ 'context.clearRect(0,0,200,200)' ])
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
				expect(contextMock.getLog()).toEqual([
				'context.clearRect(0,0,200,200)',
				'context.setLineDash([])',
				'context.fillStyle = "#f00"',
				'context.strokeStyle = "#000"',
				'context.beginPath()',
				'context.moveTo(30,30)',
				'context.lineTo(30,100)',
				'context.lineTo(100,100)',
				'context.fill()',
				'context.lineTo(100,30)',
				'context.stroke()' ])
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
			expect(contextMock.getLog()).toEqual([
			'context.clearRect(0,0,200,200)',
			'context.setLineDash([])',
			'context.fillStyle = "#f00"',
			'context.strokeStyle = "#000"',
			'context.beginPath()',
			'context.moveTo(0,0)',
			'context.lineTo(100,0)',
			'context.lineTo(100,100)',
			'context.lineTo(0,100)',
			'context.lineTo(0,0)',
			'context.fill()',
			'context.save()',
			'context.setTransform(1,0,0,1,0,0)',
			'context.clearRect(0,0,75,75)',
			'context.restore()',
			'context.fillStyle = "#00f"',
			'context.beginPath()',
			'context.moveTo(50,0)',
			'context.lineTo(50,50)',
			'context.lineTo(0,50)',
			'context.lineTo(0,0)',
			'context.closePath()',
			'context.fill()' ])
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
			expect(contextMock.getLog()).toEqual([
			'context.clearRect(0,0,200,200)',
			'context.setLineDash([])',
			'context.fillStyle = "#000"',
			'context.strokeStyle = "#000"',
			'context.beginPath()',
			'context.moveTo(0,0)',
			'context.lineTo(5,0)',
			'context.lineTo(5,5)',
			'context.lineTo(0,5)',
			'context.lineTo(0,0)',
			'context.fill()',
			'context.save()',
			'context.setTransform(1,0,0,1,0,0)',
			'context.clearRect(1,1,3,3)',
			'context.restore()' ])
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
			expect(contextMock.getLog()).toEqual( [
			'context.clearRect(0,0,200,200)',
			'context.setLineDash([])',
			'context.fillStyle = "#000"',
			'context.strokeStyle = "#000"',
			'context.beginPath()',
			'context.moveTo(0,0)',
			'context.lineTo(5,0)',
			'context.lineTo(5,5)',
			'context.lineTo(0,5)',
			'context.lineTo(0,0)',
			'context.fill()',
			'context.save()',
			'context.setTransform(1,0,0,1,0,0)',
			'context.clearRect(1,1,3,3)',
			'context.restore()' ])
		});
	});
});
