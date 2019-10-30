import { InfiniteCanvasViewBox } from "../src/infinite-canvas-viewbox"
import { InfiniteContext } from "../src/infinite-context/infinite-context";
import { ViewBox } from "../src/interfaces/viewbox";
import { CanvasContextMock } from "./canvas-context-mock";
import { Transformation } from "../src/transformation";

describe("an infinite canvas context", () => {
	let width: number;
	let height: number;
	let infiniteContext: InfiniteContext;
	let contextMock: CanvasContextMock;
	let viewbox: ViewBox;

	beforeEach(() => {
		width = 200;
		height = 200;
		contextMock = new CanvasContextMock();
		const context: any = contextMock.mock;
		viewbox = new InfiniteCanvasViewBox(width, height, context);
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
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
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

	describe("that adds a drawing that depends on the transformation", () => {

		beforeEach(() => {
			infiniteContext.setLineDash([1, 1]);
			infiniteContext.lineDashOffset = 1;
		});

		describe("and then draws using a non-identity transformation", () => {

			beforeEach(() => {
				viewbox.transformation = new Transformation(2,0,0,2,0,0);
				contextMock.clear();
				infiniteContext.strokeRect(0,0,10,10);
			});

			it("should have set the transformed version of the state", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("that fills a rect, begins a new path, translates and then clears a rect", () => {

		beforeEach(() => {
			infiniteContext.fillRect(0, 0, 5, 5);
			infiniteContext.beginPath();
			infiniteContext.translate(1, 1);
			contextMock.clear();
			infiniteContext.clearRect(1, 1, 1, 1);
		});

		it("should add a clearRect with the right arguments", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that is translated", () => {

		beforeEach(() => {
			infiniteContext.translate(2, 0);
		});

		describe("and then draws a rectangle", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fillRect(0, 0, 1, 1);
			});

			it("should have called setTransform on the context", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then clears a rectangle partly covering the place where the rectangle was drawn", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(0.5, 0, 3, 3);
				});

				it("should have added an instruction to clear a rect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then adds a rectangular path and fills it", () => {

			beforeEach(() => {
				infiniteContext.beginPath();
				infiniteContext.rect(0, 0, 1, 1);
				infiniteContext.fill();
			});

			describe("and then clears a rectangle partly covering the place where the rectangle was drawn", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(0.5, 0, 3, 3);
				});

				it("should have added an instruction to clear a rect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then the viewbox is transformed and it draws a rectangle", () => {

			beforeEach(() => {
				viewbox.transformation = Transformation.scale(2);
				contextMock.clear();
				infiniteContext.fillRect(0, 0, 1, 1);
			});

			it("should have called setTransform on the context with the right transformation", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
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
