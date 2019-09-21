import { InfiniteCanvasViewBox } from "../src/infinite-canvas-viewbox"
import { InfiniteContext } from "../src/infinite-context/infinite-context";
import { ViewBox } from "../src/viewbox";

describe("an infinite canvas context", () => {
	let width: number;
	let height: number;
	let infiniteContext: InfiniteContext;
	let moveToSpy: jest.SpyInstance;
	let lineToSpy: jest.SpyInstance;
	let closePathSpy: jest.SpyInstance;
	let setFillStyleSpy: jest.SpyInstance;
	let setStrokeStyleSpy: jest.SpyInstance;
	let clearRectSpy: jest.SpyInstance;
	let fillSpy: jest.SpyInstance;

	beforeEach(() => {
		const context: any = {
			set fillStyle(value: any){},
			set strokeStyle(value: any){},
			setLineDash(){},
			clearRect(){},
			fillRect(){},
			beginPath(){},
			moveTo(){},
			lineTo(){},
			closePath(){},
			fill(){},
			save(){},
			setTransform(){},
			restore(){},
			stroke(){}
		};
		moveToSpy = jest.spyOn(context, "moveTo");
		lineToSpy = jest.spyOn(context, "lineTo");
		closePathSpy = jest.spyOn(context, "closePath");
		setFillStyleSpy = jest.spyOn(context, "fillStyle", "set");
		setStrokeStyleSpy = jest.spyOn(context, "strokeStyle", "set");
		clearRectSpy = jest.spyOn(context, "clearRect");
		fillSpy = jest.spyOn(context, "fill");
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

			it("should have cleared a rectangle", () => {
				expect(clearRectSpy).toHaveBeenCalledTimes(1);
			});

			it("should have changed the state", () => {
				expect(setFillStyleSpy).toHaveBeenCalledTimes(2); // once for the default as well
				expect(setFillStyleSpy).toHaveBeenCalledWith("#f00");
			});

			it("should have executed the new instruction", () => {
				expect(fillSpy).toHaveBeenCalledTimes(1);
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

		it("should have executed the new instruction", () => {
			expect(setFillStyleSpy).toHaveBeenCalledWith(red);
			expect(fillSpy).toHaveBeenCalledTimes(1);
		});

		describe("and which then clears an area containing that instruction", () => {

			beforeEach(() => {
				setFillStyleSpy.mockClear();
				fillSpy.mockClear();
				clearRectSpy.mockClear();
				infiniteContext.clearRect(0, 0, 4, 4);
			});

			it("should have cleared a rectangle", () => {
				expect(clearRectSpy).toHaveBeenCalledTimes(1);
			});

			describe("and which then draws something else without changing the state", () => {

				beforeEach(() => {
					clearRectSpy.mockClear();
					setFillStyleSpy.mockClear();
					infiniteContext.fillRect(1, 1, 2, 2);
				});

				it("should have cleared a rect only once more", () => {
					expect(clearRectSpy).toHaveBeenCalledTimes(1); // for the default
				});

				it("should still use the old state", () => {
					expect(setFillStyleSpy).toHaveBeenCalledTimes(2); //once for the default as well
					expect(setFillStyleSpy).toHaveBeenCalledWith(red);
					expect(fillSpy).toHaveBeenCalledTimes(1);
				});
			});

			describe("and which then draws something else", () => {

				beforeEach(() => {
					clearRectSpy.mockClear();
					setFillStyleSpy.mockClear();
					infiniteContext.fillStyle = blue;
					infiniteContext.fillRect(1, 1, 2, 2);
				});

				it("should have cleared a rect only once more", () => {
					expect(clearRectSpy).toHaveBeenCalledTimes(1); // for the default
				});

				it("should not have executed the old instruction again", () => {
					expect(setFillStyleSpy).toHaveBeenCalledTimes(2); //once for the default as well
					expect(setFillStyleSpy).toHaveBeenCalledWith(blue);
					expect(setFillStyleSpy).not.toHaveBeenCalledWith(red);
					expect(fillSpy).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe("and which then draws something else", () => {

			beforeEach(() => {
				setFillStyleSpy.mockClear();
				infiniteContext.fillRect(4, 1, 2, 2);
			});

			it("should not have altered the state", () => {
				expect(setFillStyleSpy).toHaveBeenCalledTimes(2); //for the default as well
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
				infiniteContext.fill();
			});

			it("should have executed the new instructions", () => {
				expect(moveToSpy).toHaveBeenCalledTimes(1);
				expect(lineToSpy).toHaveBeenCalledTimes(2);
				expect(closePathSpy).toHaveBeenCalledTimes(1);
				expect(fillSpy).toHaveBeenCalledTimes(1);
			});

			describe("and then clears an area that is outside the drawn area", () => {

				beforeEach(() => {
					clearRectSpy.mockClear();
					infiniteContext.clearRect(10, 10, 1, 1);
				});

				it("should not have called clearRect", () => {
					expect(clearRectSpy).not.toHaveBeenCalled();
				});
			});

			describe("and then clears a smaller area than the one that was closed and adds another instruction", () => {

				beforeEach(() => {
					infiniteContext.clearRect(0, 0, 2, 2);
					infiniteContext.strokeStyle = "#f00";
					infiniteContext.beginPath();
					infiniteContext.moveTo(0,0);
					infiniteContext.lineTo(2, 0);
					moveToSpy.mockClear();
					clearRectSpy.mockClear();
					infiniteContext.stroke();
				});

				it("should still have executed the instructions in the completed area", () => {
					expect(moveToSpy).toHaveBeenCalledTimes(2);
				});

				it("should have cleared a rectangle again", () => {
					expect(clearRectSpy).toHaveBeenCalledWith(0, 0, 2, 2);
				});

				describe("and then clears an area containing all previous instructions", () => {

					beforeEach(() => {
						clearRectSpy.mockClear();
						infiniteContext.clearRect(-1, -1, 4, 4);
					});

					it("should have cleared a rectangle once", () => {
						expect(clearRectSpy).toHaveBeenCalledTimes(1);
					});

					describe("and then draws something else", () => {

						beforeEach(() => {
							clearRectSpy.mockClear();
							infiniteContext.fillRect(0, 0, 1, 1);
						});

						it("should have cleared a rectangle once more", () => {
							expect(clearRectSpy).toHaveBeenCalledTimes(1);
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
			infiniteContext.fillRect(1,1,1,1);
		});

		it("should have called the context methods", () => {
			expect(setStrokeStyleSpy).toHaveBeenCalledTimes(2); // also once for the default
			expect(setFillStyleSpy).toHaveBeenCalledTimes(2); // also once for the default
			expect(fillSpy).toHaveBeenCalledTimes(1);
		});

		describe("and then clears a rectangle containing the drawing", () => {

			beforeEach(() => {
				setStrokeStyleSpy.mockClear();
				setFillStyleSpy.mockClear();
				clearRectSpy.mockClear();
				fillSpy.mockClear();
				infiniteContext.clearRect(0, 0, 3, 3);
			});

			it("should have cleared a rectangle", () => {
				expect(clearRectSpy).toHaveBeenCalledTimes(1);
			});

			it("should not have executed the previous instructions again", () => {
				expect(setStrokeStyleSpy).not.toHaveBeenCalled();
				expect(setFillStyleSpy).not.toHaveBeenCalled();
				expect(fillSpy).not.toHaveBeenCalled();
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
				lineToSpy.mockClear();
				infiniteContext.stroke();
			});

			xit("should have executed the last path modification only once", () => {
				expect(lineToSpy).toHaveBeenCalledTimes(3);
			});
		});
	});
});