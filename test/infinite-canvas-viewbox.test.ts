import {InfiniteCanvasViewBox} from "../src/infinite-canvas-viewbox"
import {InfiniteContext} from "../src/infinite-context/infinite-context";
import {ViewBox} from "../src/interfaces/viewbox";
import {CanvasContextMock} from "./canvas-context-mock";
import {Transformation} from "../src/transformation";
import {DrawingLock} from "../src/drawing-lock";
import {InfiniteCanvasRenderingContext2D} from "../src/infinite-context/infinite-canvas-rendering-context-2d";
import {HTMLCanvasRectangle} from "../src/rectangle/html-canvas-rectangle";
import {MockCanvasMeasurementProvider} from "./mock-canvas-measurement-provider";
import {InfiniteCanvasConfig} from "../src/config/infinite-canvas-config";
import {InfiniteCanvasUnits} from "../src/infinite-canvas-units";

describe("an infinite canvas context", () => {
	let width: number;
	let height: number;
	let infiniteContext: InfiniteCanvasRenderingContext2D;
	let contextMock: CanvasContextMock;
	let viewbox: ViewBox;
	let getDrawingLockSpy: jest.Mock;
	let releaseDrawingLockSpy: jest.SpyInstance;
	let latestDrawingInstruction: () => void;
	let executeLatestDrawingInstruction: () => void;
	let isTransforming: boolean;
	let measurementProvider: MockCanvasMeasurementProvider;
	let config: Partial<InfiniteCanvasConfig>;

	beforeEach(() => {
		config = {};
		width = 200;
		height = 200;
		isTransforming = false;
		measurementProvider = new MockCanvasMeasurementProvider(width, height);
		executeLatestDrawingInstruction = () => {latestDrawingInstruction();};
		const drawingLock: DrawingLock = {release(){}};
		releaseDrawingLockSpy = jest.spyOn(drawingLock, 'release');
		const getDrawingLock: () => DrawingLock = () => drawingLock;
		getDrawingLockSpy = jest.fn().mockReturnValue(drawingLock);

		contextMock = new CanvasContextMock();
		const context: any = contextMock.mock;
		viewbox = new InfiniteCanvasViewBox(
			new HTMLCanvasRectangle(measurementProvider, config),
			context,
			{
				provideDrawingIteration(draw: () => void): void {
					latestDrawingInstruction = draw; executeLatestDrawingInstruction();
				}
			},
			getDrawingLockSpy,
			() => isTransforming);
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

	describe("that makes a path consisting of two subpaths", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(10, 10, 100, 100);
			infiniteContext.rect(30, 30, 30, 30);
		});

		describe("and the fills it using a fill rule", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fill("evenodd");
			});

			it("should take the fill rule into account", () => {
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
			infiniteContext.fill();
			infiniteContext.restore();
			contextMock.clear();
			infiniteContext.fillRect(0, 0, 1, 1);
		});

		it("should end up with an equal number of saves and restores", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
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

	describe("fills a rect, begins a path, clips it and then fills it", () => {

		beforeEach(() => {
			infiniteContext.fillStyle = "#f00";
			infiniteContext.fillRect(0, 0, 100, 100);
			infiniteContext.beginPath();
			infiniteContext.moveTo(10,10);
			infiniteContext.lineTo(10,90);
			infiniteContext.lineTo(90,90);
			infiniteContext.lineTo(90,10);
			infiniteContext.clip();
			infiniteContext.fillStyle = "#0f0";
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should have added an instruction to clip", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then reduces the path's area, clips again and fills a rect", () => {

			beforeEach(() => {
				infiniteContext.lineTo(70,30);
				infiniteContext.clip();
				infiniteContext.fillStyle = "#00f";
				contextMock.clear();
				infiniteContext.fillRect(0,0,100,100);
			});

			it("should have added a filled rectangle after the clip", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then reduces the path's area again and fills it", () => {

				beforeEach(() => {
					infiniteContext.lineTo(50,90);
					infiniteContext.fillStyle = "#ff0";
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should have recreated the path and filled it", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

	describe("that clips with a rect, fills a rect, clips with another rect and then fills two rects", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(1, 1, 8, 8);
			infiniteContext.clip();
			infiniteContext.fillRect(0, 5, 2, 2);
			infiniteContext.beginPath();
			infiniteContext.rect(2, 2, 6, 6);
			infiniteContext.clip();
			infiniteContext.fillRect(7, 5, 2, 2);
			contextMock.clear();
			infiniteContext.fillRect(5, 5, 1, 2);
		});

		it("should contain two clipping instructions", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then removes the second filled rectangle by clearing a rect", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(6.5, 4.5, 2, 3);
			});

			it("should still contain two clipping instructions", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then removes the first filled rectangle by clearing a rect", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(0.5, 4.5, 2, 3);
				});

				it("should still contain two clipping instructions", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

	describe("that saves state, makes a rect and clips it", () => {

		beforeEach(() => {
			infiniteContext.save();
			infiniteContext.beginPath();
			infiniteContext.rect(2, 2, 3, 3);
			infiniteContext.clip();
		});

		describe("and then makes a new rectangular path partly overlapping the clipped area and fills it", () => {

			beforeEach(() => {
				infiniteContext.beginPath();
				infiniteContext.moveTo(0, 0);
				infiniteContext.lineTo(6, 0);
				infiniteContext.lineTo(6, 3);
				infiniteContext.lineTo(0, 3);
				infiniteContext.lineTo(0, 0);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should contain the clipping instruction", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then restores state and fills a rect outside the clipped area", () => {

				beforeEach(() => {
					infiniteContext.restore();
					contextMock.clear();
					infiniteContext.fillRect(7, 0, 1, 1);
				});

				it("should still contain the clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect that contains that partial overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 3);
					});

					it("should forget about the filled rect inside the clipped area, not contain a clipping instruction and not add a clearRect", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then restores state and begins a path outside the clipped area and fills it", () => {

				beforeEach(() => {
					infiniteContext.restore();
					infiniteContext.beginPath();
					infiniteContext.rect(7, 0, 1, 1);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should still contain the clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect that contains that partial overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 3);
					});

					it("should forget about the filled rect inside the clipped area, not contain a clipping instruction and not add a clearRect", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then clears a rect that contains that partial overlap", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(1, 1, 5, 3);
				});

				it("should forget about the filled rect and not add a clearRect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then once again fills the path", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fill();
					});

					it("should contain the clipping instruction again", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then fills a rect partly overlapping the clipped area", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fillRect(0, 0, 6, 3);
					});

					it("should contain the clipping instruction again", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});

		describe("and then fills a rect partly overlapping the clipped area", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fillRect(0, 0, 6, 3);
			});

			it("should contain the clipping instruction", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then fills another rect partly overlapping the clipped area", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.fillRect(0, 4, 6, 2);
				});

				it("should still contain only one clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect containing the second overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 3.5, 5, 3);
					});

					it("should still contain one clipping instruction", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect containing the first overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 2.5);
					});

					it("should still contain one clipping instruction", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then restores state and fills a rect outside the clipped area", () => {

				beforeEach(() => {
					infiniteContext.restore();
					contextMock.clear();
					infiniteContext.fillRect(7, 0, 1, 1);
				});

				it("should still contain the clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect that contains that partial overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 3);
					});

					it("should forget about the filled rect inside the clipped area, not contain a clipping instruction and not add a clearRect", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then restores state and begins a path outside the clipped area and fills it", () => {

				beforeEach(() => {
					infiniteContext.restore();
					infiniteContext.beginPath();
					infiniteContext.rect(7, 0, 1, 1);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should still contain the clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect that contains that partial overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 3);
					});

					it("should forget about the filled rect inside the clipped area, not contain a clipping instruction and not add a clearRect", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then clears a rect that contains that partial overlap", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(1, 1, 5, 3);
				});

				it("should forget about the filled rect and not add a clearRect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then once more fills a rect partly overlapping the clipped area", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fillRect(0, 0, 6, 3);
					});

					it("should still contain the clipping instruction", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then makes a new rectangular path partly overlapping the clipped area and fills it", () => {

					beforeEach(() => {
						infiniteContext.beginPath();
						infiniteContext.moveTo(0, 0);
						infiniteContext.lineTo(6, 0);
						infiniteContext.lineTo(6, 3);
						infiniteContext.lineTo(0, 3);
						infiniteContext.lineTo(0, 0);
						contextMock.clear();
						infiniteContext.fill();
					});

					it("should still contain the clipping instruction", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});
	});

	describe.each([
		[
			"linear gradient",
			"fills",
			(context: InfiniteCanvasRenderingContext2D) => context.createLinearGradient(10, 0, 10, 30),
			(context: InfiniteCanvasRenderingContext2D) => context.fill(),
			(context: InfiniteCanvasRenderingContext2D, x: number, y: number, w:number, h:number) => context.fillRect(x, y, w, h),
			(context: InfiniteCanvasRenderingContext2D, fillStrokeStyle: CanvasGradient | CanvasPattern) => {context.fillStyle = fillStrokeStyle}
		],
		[
			"linear gradient",
			"strokes",
			(context: InfiniteCanvasRenderingContext2D) => context.createLinearGradient(10, 0, 10, 30),
			(context: InfiniteCanvasRenderingContext2D) => context.stroke(),
			(context: InfiniteCanvasRenderingContext2D, x: number, y: number, w:number, h:number) => context.strokeRect(x, y, w, h),
			(context: InfiniteCanvasRenderingContext2D, fillStrokeStyle: CanvasGradient | CanvasPattern) => {context.strokeStyle = fillStrokeStyle}
		],
		[
			"radial gradient",
			"fills",
			(context: InfiniteCanvasRenderingContext2D) => context.createRadialGradient(0, 0, 1, 5, 5, 5),
			(context: InfiniteCanvasRenderingContext2D) => context.fill(),
			(context: InfiniteCanvasRenderingContext2D, x: number, y: number, w:number, h:number) => context.fillRect(x, y, w, h),
			(context: InfiniteCanvasRenderingContext2D, fillStrokeStyle: CanvasGradient | CanvasPattern) => {context.fillStyle = fillStrokeStyle}
		],
		[
			"radial gradient",
			"strokes",
			(context: InfiniteCanvasRenderingContext2D) => context.createRadialGradient(0, 0, 1, 5, 5, 5),
			(context: InfiniteCanvasRenderingContext2D) => context.stroke(),
			(context: InfiniteCanvasRenderingContext2D, x: number, y: number, w:number, h:number) => context.strokeRect(x, y, w, h),
			(context: InfiniteCanvasRenderingContext2D, fillStrokeStyle: CanvasGradient | CanvasPattern) => {context.strokeStyle = fillStrokeStyle}
		]
	])(`that creates a %s`, (
		fillStrokeStyleName: string,
		drawingVerb: string,
		createFillStrokeStyle: (context: InfiniteCanvasRenderingContext2D) => CanvasGradient | CanvasPattern,
		drawPath: (context: InfiniteCanvasRenderingContext2D) => void,
		drawRect: (context: InfiniteCanvasRenderingContext2D, x: number, y: number, w:number, h:number) => void,
		setFillStrokeStyle:(context: InfiniteCanvasRenderingContext2D, fillStrokeStyle: CanvasGradient | CanvasPattern) => void) => {
		let fillStrokeStyle: CanvasGradient | CanvasPattern;

		beforeEach(() => {
			fillStrokeStyle = createFillStrokeStyle(infiniteContext);
		});

		describe("and then creates a path", () => {

			beforeEach(() => {
				infiniteContext.beginPath();
				infiniteContext.moveTo(1, 1);
				infiniteContext.lineTo(1, 2);
				infiniteContext.lineTo(2, 2);
				infiniteContext.lineTo(2, 1);
			});

			describe(`and then ${drawingVerb} using the ${fillStrokeStyleName}`, () => {

				beforeEach(() => {
					setFillStrokeStyle(infiniteContext, fillStrokeStyle);
					contextMock.clear();
					drawPath(infiniteContext);
				});

				it(`should have created a ${fillStrokeStyleName}`, () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears the drawing", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(0, 0, 3, 3);
					});

					it(`should no longer create a ${fillStrokeStyleName}`, () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});

					describe(`and then ${drawingVerb} the path again`, () => {

						beforeEach(() => {
							contextMock.clear();
							drawPath(infiniteContext);
						});

						it(`should create a ${fillStrokeStyleName} again`, () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});
			});
		});

		describe(`and then draws without using the ${fillStrokeStyleName}`, () => {

			beforeEach(() => {
				contextMock.clear();
				drawRect(infiniteContext, 0, 0, 10, 10)
			});

			it(`should not have created a ${fillStrokeStyleName}`, () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe(`and then ${drawingVerb} using the ${fillStrokeStyleName}`, () => {

				beforeEach(() => {
					setFillStrokeStyle(infiniteContext, fillStrokeStyle);
					contextMock.clear();
					drawRect(infiniteContext, 30, 0, 10, 10)
				});

				it(`should have created a ${fillStrokeStyleName}`, () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe(`and then ${drawingVerb} again using the same ${fillStrokeStyleName}`, () => {

					beforeEach(() => {
						contextMock.clear();
						drawRect(infiniteContext, 50, 0, 10, 10);
					});

					it(`should still have created only one ${fillStrokeStyleName}`, () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});

					describe(`and then clears both drawings with the ${fillStrokeStyleName}`, () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.clearRect(25, -1, 50, 12);
						});

						it(`should not have created a ${fillStrokeStyleName}`, () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});

					describe(`and then clears one drawing with the ${fillStrokeStyleName}`, () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.clearRect(15, -1, 30, 12);
						});

						it(`should still have created only one ${fillStrokeStyleName}`, () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});

						describe(`and then clears the other drawing with the ${fillStrokeStyleName}`, () => {

							beforeEach(() => {
								contextMock.clear();
								infiniteContext.clearRect(45, -1, 20, 12);
							});

							it(`should not have created a ${fillStrokeStyleName}`, () => {
								expect(contextMock.getLog()).toMatchSnapshot();
							});

							describe(`and then draws again using the ${fillStrokeStyleName}`, () => {

								beforeEach(() => {
									contextMock.clear();
									drawRect(infiniteContext, 30, 0, 10, 10)
								});

								it(`should have created a ${fillStrokeStyleName}`, () => {
									expect(contextMock.getLog()).toMatchSnapshot();
								});
							});
						});
					});
				});
			});
		});
	});

	describe("that creates image data", () => {
		let width: number;
		let height: number;
		let returnImageBitmap: (bitmap: ImageBitmap) => void;
		let createImageBitmapSpy: jest.SpyInstance;
		let imageData: ImageData;

		beforeEach(() => {
			width = 10;
			height = 10;
			const imageBitmapPromise: Promise<ImageBitmap> = new Promise((res, rej) => {
				returnImageBitmap = res;
			});
			createImageBitmapSpy = jest.spyOn(window, 'createImageBitmap').mockImplementation(() => imageBitmapPromise);
			const array: Uint8ClampedArray = new Uint8ClampedArray(4 * width * height);
			imageData = {data: array, height: height, width: width};
		});

		afterEach(() => {
			createImageBitmapSpy.mockRestore();
		});

		describe("and then puts it on the context", () => {
			let x: number;
			let y: number;

			beforeEach(() => {
				executeLatestDrawingInstruction = () => {};
				x = 10;
				y = 10;
				infiniteContext.putImageData(imageData, x, y);
			});

			it("should have gotten a drawing lock", () => {
				expect(getDrawingLockSpy).toHaveBeenCalledTimes(1);
			});
	
			it("should have asked for an image bitmap", () => {
				const createImageBitmapLatestArgs = createImageBitmapSpy.mock.calls[0];
				const imageData: ImageData = createImageBitmapLatestArgs[0];
				expect(imageData.width).toBe(width);
				expect(imageData.height).toBe(height);
				expect(imageData.data.length).toBe(4 * width * height);
			});
	
			describe("and then the bitmap is ready", () => {
	
				beforeEach(() => {
					returnImageBitmap({height: height, width: width, close(){}});
				});
	
				it("should have released the lock", () => {
					expect(releaseDrawingLockSpy).toHaveBeenCalledTimes(1);
				});
	
				describe("and then drawing is executed", () => {
	
					beforeEach(() => {
						latestDrawingInstruction();
					});
	
					it("should have filled a rect using a pattern created from the bitmap", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});

					describe("and then part of the drawing is cleared", () => {

						beforeEach(() => {
							executeLatestDrawingInstruction = () => latestDrawingInstruction();
							contextMock.clear();
							infiniteContext.clearRect(5, 5, 10, 10);
						});

						it("should have added a clearRect", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});

					describe("and then the entire drawing is cleared", () => {

						beforeEach(() => {
							executeLatestDrawingInstruction = () => latestDrawingInstruction();
							contextMock.clear();
							infiniteContext.clearRect(5, 5, 20, 20);
						});

						it("should have forgotten everything", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});
			});
		});

		describe("and then puts part of it on the context", () => {
			let x: number;
			let y: number;
			let dirtyX: number;
			let dirtyY: number;
			let dirtyWidth: number;
			let dirtyHeight: number;

			beforeEach(() => {
				executeLatestDrawingInstruction = () => {};
				x = 10;
				y = 10;
				dirtyX = 1;
				dirtyY = 1;
				dirtyWidth = 8;
				dirtyHeight = 8;
				infiniteContext.putImageData(imageData, x, y, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
			});

			it("should have gotten a drawing lock", () => {
				expect(getDrawingLockSpy).toHaveBeenCalledTimes(1);
			});
	
			it("should have asked for an image bitmap", () => {
				expect(createImageBitmapSpy).toHaveBeenCalledTimes(1);
				const createImageBitmapLatestArgs = createImageBitmapSpy.mock.calls[0];
				const imageData: ImageData = createImageBitmapLatestArgs[0];
				expect(imageData.width).toBe(dirtyWidth);
				expect(imageData.height).toBe(dirtyHeight);
				expect(imageData.data.length).toBe(4 * dirtyWidth * dirtyHeight);
			});

			describe("and then the bitmap is ready", () => {
	
				beforeEach(() => {
					returnImageBitmap({height: dirtyHeight, width: dirtyWidth, close(){}});
				});
	
				it("should have released the lock", () => {
					expect(releaseDrawingLockSpy).toHaveBeenCalledTimes(1);
				});
	
				describe("and then drawing is executed", () => {
	
					beforeEach(() => {
						latestDrawingInstruction();
					});
	
					it("should have filled a rect using a pattern created from the bitmap", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});
	});

	describe("that creates a pattern", () => {
		let pattern: CanvasPattern;

		beforeEach(() => {
			const imageBitmap: ImageBitmap = {width:1, height: 1, close(){}};
			pattern = infiniteContext.createPattern(imageBitmap, 'repeat');
		});

		describe("and then uses it to fill a rect", () => {

			beforeEach(() => {
				infiniteContext.fillStyle = pattern;
				contextMock.clear();
				infiniteContext.fillRect(0, 0, 1, 1);
			});

			it("should wrap the fill command in a transform", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("that clips and then puts image data", () => {
		let clipX: number;
		let clipY: number;
		let clipWidth: number;
		let clipHeight: number;
		let imageDataWidth: number;
		let imageDataHeight: number;
		let createImageBitmapSpy: jest.SpyInstance;

		beforeEach((done) => {
			imageDataWidth = 100;
			imageDataHeight = 100;
			clipX = 10;
			clipY = 10;
			clipWidth = 10;
			clipHeight = 10;
			let resolveImageBitmap: (bitmap: ImageBitmap | PromiseLike<ImageBitmap>) => void;
			const imageBitmap: ImageBitmap = {width: imageDataWidth, height: imageDataHeight, close(){}};
			createImageBitmapSpy = jest.spyOn(window, 'createImageBitmap').mockImplementation(() => new Promise((res) => {resolveImageBitmap = res;}));
			const array: Uint8ClampedArray = new Uint8ClampedArray(4 * width * height);
			const imageData: ImageData = {data: array, height: height, width: width};
			infiniteContext.putImageData(imageData, 0, 0);
			resolveImageBitmap(imageBitmap);
			setTimeout(() => {
				contextMock.clear();
				executeLatestDrawingInstruction();
				done();
			}, 0);
		});

		describe("and then clears an area covering the clipped area but not the image", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(clipX - 1, clipY - 1, clipWidth + 2, clipHeight + 2);
			});

			it("should not forget about the image and add a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		afterEach(() => {
			createImageBitmapSpy.mockRestore();
		});

	});

	describe("that clips and then draws an image", () => {
		let clipX: number;
		let clipY: number;
		let clipWidth: number;
		let clipHeight: number;

		beforeEach(() => {
			clipX = 10;
			clipY = 10;
			clipWidth = 10;
			clipHeight = 10;
			let image: CanvasImageSource = {width: 100, height: 100, close(){}};
			infiniteContext.beginPath();
			infiniteContext.rect(clipX, clipY, clipWidth, clipHeight);
			infiniteContext.clip();
			infiniteContext.drawImage(image, 0, 0);
		});

		describe("and then clears an area covering the clipped area but not the image", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(clipX - 1, clipY - 1, clipWidth + 2, clipHeight + 2);
			});

			it("should forget about the image and not add a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("that uses an image", () => {
		let image: CanvasImageSource;
		let imageWidth: number;
		let imageHeight: number;

		beforeEach(() => {
			imageWidth = 100;
			imageHeight = 100;
			image = {width: imageWidth, height: imageHeight, close(){}};
		});

		describe("and draws it using three arguments", () => {
			let x: number;
			let y: number;
			
			beforeEach(() => {
				x = 10;
				y = 10;
				contextMock.clear();
				infiniteContext.drawImage(image, x, y);
			});

			it("should call the context using three arguments", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then clears the rectangle where the image was drawn", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(x-1, y-1, imageWidth+2, imageHeight+2);
				});

				it("should no longer draw the image", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and draws it using five arguments", () => {
			let x: number;
			let y: number;
			let width: number;
			let height: number;
			
			beforeEach(() => {
				x = 10;
				y = 10;
				width = 40;
				height = 40;
				contextMock.clear();
				infiniteContext.drawImage(image, x, y, width, height);
			});

			it("should call the context using five arguments", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then clears the rectangle where the image was drawn", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(x-1, y-1, width+2, height+2);
				});

				it("should no longer draw the image", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and draws it using nine arguments", () => {
			let x: number;
			let y: number;
			let width: number;
			let height: number;
			
			beforeEach(() => {
				x = 10;
				y = 10;
				width = 40;
				height = 40;
				contextMock.clear();
				infiniteContext.drawImage(image, 10, 10, 80, 80, x, y, width, height);
			});

			it("should call the context using nine arguments", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then clears the rectangle where the image was drawn", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(x-1, y-1, width+2, height+2);
				});

				it("should no longer draw the image", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

	describe("that takes text", () => {
		let x: number;
		let y: number;
		let width: number;
		let height: number;
		let text: string;

		beforeEach(() => {
			text = "Some text";
			width = 200;
			height = 20;
			jest.spyOn(contextMock.mock, "measureText").mockImplementation(()=> ({
				actualBoundingBoxRight: width,
				actualBoundingBoxLeft: 0,
				actualBoundingBoxAscent: 0,
				actualBoundingBoxDescent: height
			}));
			x = 100;
			y = 100;
		});

		describe("and fills it", () => {

			beforeEach(() => {
				infiniteContext.fillText(text, x, y);
			});

			it("should contain the instruction to transform and fill text", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and clears it", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(x-1, y-1, width+2, height+2);
				});

				it("should forget the instructions", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and strokes it", () => {

			beforeEach(() => {
				infiniteContext.strokeText(text, x, y);
			});

			it("should contain the instruction to transform and stroke text", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and clears it", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(x-1, y-1, width+2, height+2);
				});

				it("should forget the instructions", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

	describe("that makes a rect, strokes it and then strokes text", () => {

		beforeEach(() => {
			jest.spyOn(contextMock.mock, "measureText").mockImplementation(()=> ({
				actualBoundingBoxRight: 20,
				actualBoundingBoxLeft: 0,
				actualBoundingBoxAscent: 0,
				actualBoundingBoxDescent: 10
			}));
			viewbox.transformation = new Transformation(2, 0, 0, 2, 0, 0);
			infiniteContext.beginPath();
			infiniteContext.rect(0, 0, 5, 5);
			infiniteContext.stroke();
			contextMock.clear();
			infiniteContext.strokeText("text", 10, 10);
		});

		it("should set the line width twice", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that sets a line width, makes a rect, strokes it and then strokes text", () => {

		beforeEach(() => {
			jest.spyOn(contextMock.mock, "measureText").mockImplementation(()=> ({
				actualBoundingBoxRight: 20,
				actualBoundingBoxLeft: 0,
				actualBoundingBoxAscent: 0,
				actualBoundingBoxDescent: 10
			}));
			viewbox.transformation = new Transformation(2, 0, 0, 2, 0, 0);
			infiniteContext.lineWidth = 2;
			infiniteContext.beginPath();
			infiniteContext.rect(0, 0, 5, 5);
			infiniteContext.stroke();
			contextMock.clear();
			infiniteContext.strokeText("text", 10, 10);
		});

		it("should set the line width twice", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that translates and draws this shape using a line dash", () => {

		beforeEach(() => {
			infiniteContext.translate(20, 20);
			infiniteContext.setLineDash([2, 2]);
			infiniteContext.beginPath();
			infiniteContext.moveTo(250, 50);
			infiniteContext.lineToInfinityInDirection(1, 0);
			infiniteContext.lineTo(100, 100);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should make sure the length of the drawn path is a multiple of the line dash period", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that sets a nonzero line dash and fills a rect", () => {

		beforeEach(() => {
			viewbox.transformation = new Transformation(2, 0, 0, 2, 0, 0);
			infiniteContext.setLineDash([1, 1]);
			contextMock.clear();
			infiniteContext.fillRect(1, 1, 1, 1);
		});

		it("should set the correct line dash", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then sets a pattern as fill style and fills another rect", () => {

			beforeEach(() => {
				const imageBitmap: ImageBitmap = {width:1, height: 1, close(){}};
				infiniteContext.fillStyle = infiniteContext.createPattern(imageBitmap, 'repeat');
				contextMock.clear();
				infiniteContext.fillRect(5, 1, 1, 1);
			});

			it("should set the correct line dash again", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then sets the fill style to something other than a pattern and fills a third rect", () => {

				beforeEach(() => {
					infiniteContext.fillStyle = "#000";
					contextMock.clear();
					infiniteContext.fillRect(9, 1, 1, 1);
				});

				it("should set the correct line dash again", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears the rect that was filled with a pattern", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(4, 0, 3, 3);
					});

					it("should set the line dash one fewer time", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});
	});

	describe("that makes a path, saves state, clips, fills a rect and then strokes the path", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(10, 10, 50, 50);
			infiniteContext.save();
			infiniteContext.clip();
			infiniteContext.fillRect(-1, -1, 2, 2);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should set the clipped path before stroking", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that uses shadow styles", () => {

		beforeEach(() => {
			infiniteContext.fillStyle ="#f00";
			infiniteContext.shadowColor = "#000";
			infiniteContext.shadowOffsetX = 10;
			infiniteContext.shadowOffsetY = 10;
			infiniteContext.fillRect(30, 30, 100, 100);
		});

		it("should use shadow styles", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then transforms", () => {

			beforeEach(() => {
				contextMock.clear();
				viewbox.transformation = Transformation.scale(0.5).before(new Transformation(0, 1, -1, 0, 0, 0)).before(Transformation.translation(10, 10));
			});

			it("should transform the shadow offsets together", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
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

	describe("that draws an arc", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.arc(30, 30, 30, 0, 2 * Math.PI);
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should draw an arc", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that draws an ellipse", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.ellipse(50, 50, 100, 40, 0, 0, Math.PI);
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should draw an ellipse", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe('that draws a bezier curve', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.translate(20, 20)
			infiniteContext.moveTo(0, 0);
			infiniteContext.bezierCurveTo(20, 0, 20, 20, 40, 20);
			infiniteContext.lineTo(40, 40);
			infiniteContext.lineTo(0, 40);
			infiniteContext.fill();
		});

		it("should draw a bezier curve", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe('that draws a bezier curve', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(50, 0);
			infiniteContext.bezierCurveTo(100, 50, 0, 50, 50, 0);
			infiniteContext.fill();
		});

		it("should draw a bezier curve", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe('and then clears a rect that does not overlap the bezier curve', () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.save();
				infiniteContext.transform(1, 1, 1, -1, 50, 75);
				infiniteContext.clearRect(0, 0, 100, 100);
				infiniteContext.restore();
			});

			it("should not do anything else", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe('and then clears a rect that partially covers the bezier curve', () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(0, 30, 100, 100);
			});

			it("should add a clearRect command", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe('and then clear a rect that fully covers the bezier curve', () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(20, -5, 60, 60);
			});

			it("should no longer draw a bezier curve", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("that draws a quadratic curve", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(20, 20);
			infiniteContext.lineTo(40, 20);
			infiniteContext.translate(40, 20);
			infiniteContext.quadraticCurveTo(20, 0, 20, 20);
			infiniteContext.lineTo(20, 60);
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should draw a quadratic curve", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that draws a quadratic curve", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(10, 10);
			infiniteContext.quadraticCurveTo(60, 60, 110, 10);
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should draw a quadratic curve", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then clears a rect that does not cover the quadratic curve", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(5, 5, 110, 25);
			});

			it("should still draw a quadratic curve", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then clears a rect that covers the quadratic curve", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(5, 5, 110, 35);
			});

			it("should no longer draw a quadratic curve", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("that draws a line", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(10, 10);
			infiniteContext.lineTo(10, 20);
		});

		describe("and then draws a line to infinity in the opposite direction and fills the path", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(0, -1);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should not have drawn more lines than necessary", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line to infinity in the same direction and fills the path", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(0, 1);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should not have drawn more lines than necessary", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line to infinity in a different direction and fills the path", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(1, 0);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should have filled the right shape", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("that translates", () => {

		beforeEach(() => {
			infiniteContext.translate(30, 60);
		});

		describe("and then rotates", () => {

			beforeEach(() => {
				infiniteContext.transform(0, 1, -1, 0, 0, 0);
			});

			describe("and then draws a line to inifinity", () => {

				beforeEach(() => {
					infiniteContext.beginPath();
					infiniteContext.moveTo(30, 30);
					infiniteContext.lineToInfinityInDirection(1, 0);
					contextMock.clear();
					infiniteContext.stroke();
				});
		
				it("should draw a line to the right border of the viewbox", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then draws a line to inifinity", () => {

			beforeEach(() => {
				infiniteContext.beginPath();
				infiniteContext.moveTo(30, 30);
				infiniteContext.lineToInfinityInDirection(1, 0);
				contextMock.clear();
				infiniteContext.stroke();
			});
	
			it("should draw a line to the right border of the viewbox", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("draws a line to infinity", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(30, 30);
			infiniteContext.lineToInfinityInDirection(1, 0);
		});

		describe("and then strokes the ray and clears an infinite rectangle partially overlapping the ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(40, 20, Infinity, 20);
			});

			it("should clear a rectangle extending to the edge of the viewbox", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then the viewbox transformation translates", () => {

				beforeEach(() => {
					contextMock.clear();
					viewbox.transformation = new Transformation(1, 0, 0, 1, -10, 0);
				});

				it("should clear a rectangle extending to the edge of the viewbox", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then the viewbox transformation scales", () => {

				beforeEach(() => {
					contextMock.clear();
					viewbox.transformation = new Transformation(2, 0, 0, 2, 0, 0);
				});

				it("should clear a rectangle extending to the edge of the viewbox", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then strokes the ray and clears a rect overlapping the entire ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(20, 20, Infinity, 20);
			});

			it("should forget about the drawn path and not add a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then strokes the ray and clears a rect overlapping the ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(0, 0, 60, 60);
			});

			it("should have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then strokes the ray and clears a rect overlapping the ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(300, 0, 60, 60);
			});

			it("should have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then strokes the ray and clears a rect not overlapping the ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(0, 40, 60, 60);
			});

			it("should not have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line to the opposite point at infinity and strokes", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(-1, 0);
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should still have drawn only a ray", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line to another point at infinity", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(0, 1);
			});

			describe("and then fills the path and clears a rect overlapping the drawn area", () => {

				beforeEach(() => {
					infiniteContext.fill();
					contextMock.clear();
					infiniteContext.clearRect(40, 40, 60, 60);
				});

				it("should add a clearRect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then fills the path and clears a rect not overlapping the drawn area", () => {

				beforeEach(() => {
					infiniteContext.fill();
					contextMock.clear();
					infiniteContext.clearRect(-40, -40, 60, 60);
				});

				it("should not add a clearRect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then draws a line back and fills", () => {

				beforeEach(() => {
					infiniteContext.lineTo(60, 60);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should draw a path that ends coming from the correct direction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then fills", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.fill();
				});
	
				it("should create a path that covers the correct section of the view box", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then draws a line to a third point at infinity (not in the same half plane) and then fills", () => {

				beforeEach(() => {
					infiniteContext.lineToInfinityInDirection(-1, -1);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should draw the correct path", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears the entire plane", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(-Infinity, -Infinity, Infinity, Infinity);
					});

					it("should clear everything", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears the entire plane differently", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(Infinity, Infinity, -Infinity, -Infinity);
					});

					it("should clear everything", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with infinite width, infinite height and no left", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(-Infinity, 50, Infinity, Infinity);
					});

					it("should clear a rect extending to the left and right and bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with negative infinite width, infinite height and no right", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(Infinity, 50, -Infinity, Infinity);
					});

					it("should clear a rect extending to the left and right and bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with infinite width, infinite height and no top", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, -Infinity, Infinity, Infinity);
					});

					it("should clear a rect extending to the top and bottom and right of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with infinite width, negative infinite height and no bottom", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, Infinity, Infinity, -Infinity);
					});

					it("should clear a rect extending to the top and bottom and right of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite width, infinite height and no top", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, -Infinity, 50, Infinity);
					});

					it("should clear a rect extending to the top and bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with positive infinite width and positive infinite height", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, Infinity, Infinity);
					});

					it("should clear a rect extending to the right and to the bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite width but located at positive infinity vertically", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, Infinity, 50, 50);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with infinite height but located infinitely far down", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, Infinity, 50, Infinity);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite width but located at negative infinity vertically", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, -Infinity, 50, 50);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite height but located at positive infinity horizontally", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(Infinity, 50, 50, 50);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite height but located at negative infinity horizontally", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(-Infinity, 50, 50, 50);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with positive infinite width", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, Infinity, 50);
					});

					it("should clear a rectangle extending to the right side of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with negative infinite width", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, -Infinity, 50);
					});

					it("should clear a rectangle extending to the left side of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with positive infinite height", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, 50, Infinity);
					});

					it("should clear a rectangle extending to the bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with negative infinite height", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, 50, -Infinity);
					});

					it("should clear a rectangle extending to the top of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});

		describe("and then strokes the path", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should draw a line to the right border of the viewbox", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line back from infinity to a point and then strokes", () => {

			beforeEach(() => {
				infiniteContext.lineTo(30, 60);
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should draw the right line back to the point", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
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

	describe("that transforms, begins a path, draws line from a point to infinity, rotates, draws a line to infinity and strokes", () => {

		beforeEach(() => {
			infiniteContext.translate(50, 50);
			infiniteContext.transform(1, 1, 0, 1, 0, 0);
			infiniteContext.beginPath();
			infiniteContext.moveTo(0, 0);
			infiniteContext.lineToInfinityInDirection(1, 1);
			infiniteContext.rotate(Math.PI/8);
			infiniteContext.lineToInfinityInDirection(1, 1);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that translates, begins a path, moves to infinity, and then lines to a point", () => {

		beforeEach(() => {
			infiniteContext.translate(0, 100);
			infiniteContext.beginPath();
			infiniteContext.moveToInfinityInDirection(1, 0);
			infiniteContext.lineTo(100, 100);
		});

		describe("and then lines to a different point", () => {

			beforeEach(() => {
				infiniteContext.lineTo(100, 200);
			});

			describe("and then strokes", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.stroke();
				});
	
				it("should move to and line to the correct points", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then strokes", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should move to and line to the correct points", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("that begins a path and moves to infinity", () => {

		beforeEach(() =>{
			infiniteContext.beginPath();
			infiniteContext.moveToInfinityInDirection(1, 0);
		});

		describe("and then adds a line to another point at infinity", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(0, 1);
			});

			describe("and then adds a line to a third point at infinity that is not in the same half plane", () => {

				beforeEach(() => {
					infiniteContext.lineToInfinityInDirection(-1, -1);
				});

				describe("and then fills", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fill();
					});

					it("should draw a path around the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then adds a line to a finite point", () => {

				beforeEach(() => {
					infiniteContext.lineTo(100, 100);
				});

				describe("and then fills", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fill();
					});

					it("should have drawn the right path", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then fills", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should do nothing", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then adds a line to a finite point", () => {

			beforeEach(() => {
				infiniteContext.lineTo(50, 100);
			});

			describe("and then strokes the line using a line dash", () => {

				beforeEach(() => {
					infiniteContext.setLineDash([3, 2]);
					contextMock.clear();
					infiniteContext.stroke();
				});

				it("should draw a line whose length is a multiple of the line dash period", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then adds a line to the opposite point at infinity", () => {

				beforeEach(() => {
					infiniteContext.lineToInfinityInDirection(-1, 0);
				});

				describe("and then strokes", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.stroke();
					});

					it("should have added a moveTo", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then adds a line to a different point at infinity", () => {

				beforeEach(() => {
					infiniteContext.lineToInfinityInDirection(0, 1);
				});

				describe("and then strokes the path using a line dash", () => {

					beforeEach(() => {
						infiniteContext.setLineDash([3, 2]);
						contextMock.clear();
						infiniteContext.stroke();
					});

					it("should draw a path whose length is a multiple of the line dash period", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then adds a line to yet a different point at infinity", () => {

					beforeEach(() => {
						infiniteContext.lineToInfinityInDirection(-1, -1);
					});

					describe("and then strokes", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.stroke();
						});
	
						it("should draw the correct path", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				describe("and then adds a line to a finite point", () => {

					beforeEach(() => {
						infiniteContext.lineTo(50, 150);
					});

					describe("and then strokes", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.stroke();
						});
	
						it("should have drawn the correct path", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				describe("and then strokes", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.stroke();
					});

					it("should begin a path with a move to and then draw a line around a corner of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then adds a line to a different finite point", () => {

				beforeEach(() => {
					infiniteContext.lineTo(100, 200);
				});

				describe("and then adds a line back to the first point at infinity", () => {

					beforeEach(() => {
						infiniteContext.lineToInfinityInDirection(1, 0);
					});

					describe("and then strokes", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.stroke();
						});

						it("should add a moveTo", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				describe("and then adds a line to the point at infinity opposite the starting point", () => {

					beforeEach(() => {
						infiniteContext.lineToInfinityInDirection(-1, 0);
					});

					describe("and then adds a new subpath that is closable and closes it", () => {

						beforeEach(() => {
							infiniteContext.moveTo(150, 0);
							infiniteContext.lineTo(100, 0);
							infiniteContext.lineTo(100, 50);
							infiniteContext.closePath();
						});

						describe("and then strokes", () => {

							beforeEach(() => {
								contextMock.clear();
								infiniteContext.stroke();
							});

							it("should close the second subpath but not the first", () => {
								expect(contextMock.getLog()).toMatchSnapshot();
							});
						});
					});

					describe("and then closes the path and strokes", () => {

						beforeEach(() => {
							infiniteContext.closePath();
							contextMock.clear();
							infiniteContext.stroke();
						});

						it("should have stroked but not closed the path", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
          
          describe("and then transforms and adds a line back to the original point at infinity", () => {
            
            beforeEach(() => {
              infiniteContext.transform(0, 1, 1, 0, 0, 0);
              infiniteContext.lineToInfinityInDirection(0, 1);
            });
            
            describe("and then fills", () => {
              
              beforeEach(() => {
                contextMock.clear();
                infiniteContext.fill();
              });
              
              it("should do nothing", () => {
                expect(contextMock.getLog()).toMatchSnapshot();
              })
            })
          })

					describe("and then adds a line back to the original point at infinity", () => {

						beforeEach(() => {
							infiniteContext.lineToInfinityInDirection(1, 0);
						});

						describe("and then fills", () => {

							beforeEach(() => {
								contextMock.clear();
								infiniteContext.fill();
							});

							it("should do nothing", () => {
								expect(contextMock.getLog()).toMatchSnapshot();
							});
						});
					});

					describe("and then fills", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.fill();
						});

						it("should do nothing", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				describe("and then strokes", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.stroke();
					});

					describe("and then adds a line to another finite point", () => {

						beforeEach(() => {
							infiniteContext.lineTo(100, 300);
						});

						describe("and then strokes", () => {

							beforeEach(() => {
								contextMock.clear();
								infiniteContext.stroke();
							});

							it("should have created two paths", () => {
								expect(contextMock.getLog()).toMatchSnapshot();
							});
						});
					});

					it("should begin with a moveTo and a lineTo", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then strokes", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.stroke();
				});

				describe("and then lines to a different finite point", () => {

					beforeEach(() => {
						infiniteContext.lineTo(100, 200);
					});

					describe("and then strokes", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.stroke();
						});

						it("should have created two paths", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				it("should have added a moveTo", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

	describe("that creates a rect that extends to infinity and strokes it", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(50, 50, Infinity, 50);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should have taken the current line width into account", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then changes the line width and strokes the rectangle again", () => {

			beforeEach(() => {
				infiniteContext.lineWidth = 4;
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should have taken a different line width into account this time", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("that strokes a rect that extends to infinity", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.strokeRect(50, 50, Infinity, 50);
		});

		it("should have taken the current line width into account", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then changes the line width and strokes another rect that extends to infinity", () => {

			beforeEach(() => {
				infiniteContext.lineWidth = 4;
				contextMock.clear();
				infiniteContext.strokeRect(50, 50, Infinity, 50);
			});

			it("should have taken a different line width into account for the second rectangle", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
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

	describe("that strokes a path using a line dash", () => {

		beforeEach(() => {
			infiniteContext.setLineDash([3, 2]);
			infiniteContext.beginPath();
			infiniteContext.moveTo(100, -50);
			infiniteContext.lineToInfinityInDirection(0, -1);
			infiniteContext.lineTo(50, 100);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should draw a path whose length is a multiple of the line dash period", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

	describe("that makes a path extending to infinity and fills it", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveToInfinityInDirection(0, -1);
			infiniteContext.lineTo(100, 100);
			infiniteContext.lineToInfinityInDirection(-1, 0);
			infiniteContext.fill();
		});

		describe("and then strokes it", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should take the line width into account for the stroked path", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

	describe("whose canvas has a non-identity screen transformation", () => {

		beforeEach(() => {
			measurementProvider.measurement = {
				screenWidth: 500,
				screenHeight: 1000,
				viewboxWidth: 300,
				viewboxHeight: 300,
				left: 0,
				top: 0
			};
		});

		describe('and that uses canvas units', () => {

			beforeEach(() => {
				config.units = InfiniteCanvasUnits.CANVAS;
			});

			describe('and then draws a square', () => {

				beforeEach(() => {
					infiniteContext.fillRect(0, 0, 20, 20);
				});

				it("should not have applied an initial transformation", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe('and then rotates', () => {
					let counterClockwiseRotation: Transformation;

					beforeEach(() => {
						counterClockwiseRotation = new Transformation(0, -1, 1, 0, 0, 0).before(Transformation.translation(0, 20));
						contextMock.clear();
						viewbox.transformation = counterClockwiseRotation;
					});

					it("should have applied an initial transformation that makes the square appear with the same distortion, only rotated", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});

					describe('and then resizes the canvas to exacerbate the distortion', () => {

						beforeEach(() => {
							measurementProvider.measurement = {
								screenWidth: 1000,
								screenHeight: 1000,
								viewboxWidth: 300,
								viewboxHeight: 300,
								left: 0,
								top: 0
							};
						});

						describe('and then draws again', () => {

							beforeEach(() => {
								contextMock.clear();
								infiniteContext.fillRect(5, 5, 10, 10);
							});

							it("should have applied an initial transformation that makes the drawing appear more distorted", () => {
								expect(contextMock.getLog()).toMatchSnapshot();
							});

							describe('and then rotates again', () => {

								beforeEach(() => {
									contextMock.clear();
									viewbox.transformation = viewbox.transformation.before(counterClockwiseRotation);
								});

								it("should have applied an initial transformation that makes the drawing appear with the same distortion, but rotated", () => {
									const log: string[] = contextMock.getLog();
									expect(contextMock.getLog()).toMatchSnapshot();
								});
							});
						});
					});
				});
			});
		});

		describe('that uses CSS units', () => {

			beforeEach(() => {
				config.units = InfiniteCanvasUnits.CSS;
			});

			describe('and then draws a square', () => {

				beforeEach(() => {
					infiniteContext.fillRect(0, 0, 20, 20);
				});

				it("should have applied an initial transformation that is the inverse of the screen transformation", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe('and then rotates', () => {
					let counterClockwiseRotation: Transformation;

					beforeEach(() => {
						counterClockwiseRotation = new Transformation(0, -1, 1, 0, 0, 0).before(Transformation.translation(0, 20));
						contextMock.clear();
						viewbox.transformation = counterClockwiseRotation;
					});

					it("should have applied the same initial transformation", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});
	});
})
