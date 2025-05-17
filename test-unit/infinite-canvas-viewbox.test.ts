import { beforeEach, afterEach, describe, expect, it, vi, type Mock, type MockInstance} from 'vitest'
import {ViewBox} from "src/interfaces/viewbox";
import {CanvasContextMock} from "./canvas-context-mock";
import {Transformation} from "src/transformation";
import {DrawingLock} from "src/drawing-lock";
import {InfiniteCanvasRenderingContext2D} from "api/infinite-canvas-rendering-context-2d";
import {MockCanvasMeasurementProvider} from "./mock-canvas-measurement-provider";
import {Config} from "api/config";
import {Units} from "api/units";
import { createInfiniteCanvasTestFixture } from './infinite-canvas-test-fixture';
import { MockDrawingIterationProvider } from './mock-drawing-iteration-provider';

type CreateImageBitmapSpyInstance = MockInstance<(typeof window)['createImageBitmap']>


describe("an infinite canvas context", () => {
	let width: number;
	let height: number;
	let infiniteContext: InfiniteCanvasRenderingContext2D;
	let contextMock: CanvasContextMock;
	let viewbox: ViewBox;
	let getDrawingLockSpy: MockInstance<()=>DrawingLock>;
	let releaseDrawingLockSpy: MockInstance<()=>void>;
	let mockDrawingIterationProvider: MockDrawingIterationProvider
	let measurementProvider: MockCanvasMeasurementProvider;
	let config: Partial<Config>;

	beforeEach(() => {
		({config, width, height, measurementProvider, mockDrawingIterationProvider, releaseDrawingLockSpy, getDrawingLockSpy, contextMock, viewbox, infiniteContext} = createInfiniteCanvasTestFixture());
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
	

	// filling paths
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

	// state and transformation
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

	// state and transformation
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

	// state and transformation
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

	// gradients
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

	// image data
	describe("that creates image data", () => {
		let width: number;
		let height: number;
		let returnImageBitmap: (bitmap: ImageBitmap) => void;
		let createImageBitmapSpy: CreateImageBitmapSpyInstance;
		let imageData: ImageData;

		beforeEach(() => {
			width = 10;
			height = 10;
			const imageBitmapPromise: Promise<ImageBitmap> = new Promise((res, rej) => {
				returnImageBitmap = res;
			});
			createImageBitmapSpy = vi.spyOn(window, 'createImageBitmap').mockImplementation(() => imageBitmapPromise);
			const array: Uint8ClampedArray = new Uint8ClampedArray(4 * width * height);
			imageData = {data: array, height: height, width: width, colorSpace: "srgb"};
		});

		afterEach(() => {
			createImageBitmapSpy.mockRestore();
		});

		describe("and then puts it on the context", () => {
			let x: number;
			let y: number;

			beforeEach(() => {
				mockDrawingIterationProvider.halt();
				x = 10;
				y = 10;
				infiniteContext.putImageData(imageData, x, y);
			});

			it("should have gotten a drawing lock", () => {
				expect(getDrawingLockSpy).toHaveBeenCalledTimes(1);
			});
	
			it("should have asked for an image bitmap", () => {
				const createImageBitmapLatestArgs = createImageBitmapSpy.mock.calls[0];
				const imageData: ImageData = createImageBitmapLatestArgs[0] as ImageData;
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
						mockDrawingIterationProvider.resume();
					});
	
					it("should have filled a rect using a pattern created from the bitmap", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});

					describe("and then part of the drawing is cleared", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.clearRect(5, 5, 10, 10);
						});

						it("should have added a clearRect", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});

					describe("and then the entire drawing is cleared", () => {

						beforeEach(() => {
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
				mockDrawingIterationProvider.halt();
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
				const imageData: ImageData = createImageBitmapLatestArgs[0] as ImageData;
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
						mockDrawingIterationProvider.resume();
					});
	
					it("should have filled a rect using a pattern created from the bitmap", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});
	});

	// pattern
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

		describe('and then uses it to fill the entire plane', () => {

			beforeEach(() => {
				infiniteContext.fillStyle = pattern;
				contextMock.clear();
				infiniteContext.fillRect(-Infinity, -Infinity, Infinity, Infinity);
			});

			it("should wrap the fill command in a transform", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		})
	});

	// image data
	describe("that clips and then puts image data", () => {
		let clipX: number;
		let clipY: number;
		let clipWidth: number;
		let clipHeight: number;
		let imageDataWidth: number;
		let imageDataHeight: number;
		let createImageBitmapSpy: CreateImageBitmapSpyInstance;

		beforeEach(async () => {
			imageDataWidth = 100;
			imageDataHeight = 100;
			clipX = 10;
			clipY = 10;
			clipWidth = 10;
			clipHeight = 10;
			let resolveImageBitmap: (bitmap: ImageBitmap | PromiseLike<ImageBitmap>) => void;
			const imageBitmap: ImageBitmap = {width: imageDataWidth, height: imageDataHeight, close(){}};
			createImageBitmapSpy = vi.spyOn(window, 'createImageBitmap').mockImplementation(() => new Promise<ImageBitmap>((res) => {resolveImageBitmap = res;}));
			const array: Uint8ClampedArray = new Uint8ClampedArray(4 * width * height);
			const imageData: ImageData = {data: array, height: height, width: width, colorSpace: "srgb"};
			infiniteContext.putImageData(imageData, 0, 0);
			resolveImageBitmap(imageBitmap);
			await new Promise<void>((done) => {
				setTimeout(() => {
					contextMock.clear();
					mockDrawingIterationProvider.execute();
					done();
				}, 0);
			})
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

	// draw image
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

	// draw image
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

	// text
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
			vi.spyOn(contextMock.mock, "measureText").mockImplementation(()=> ({
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

	// text
	describe("that makes a rect, strokes it and then strokes text", () => {

		beforeEach(() => {
			vi.spyOn(contextMock.mock, "measureText").mockImplementation(()=> ({
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

	// text
	describe("that sets a line width, makes a rect, strokes it and then strokes text", () => {

		beforeEach(() => {
			vi.spyOn(contextMock.mock, "measureText").mockImplementation(()=> ({
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

	// pattern
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

	// shadow
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

	// arc
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

	// ellipse
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

	// bezier curve
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

	// bezier curve
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

	// quadratic curve
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

	// quadratic curve
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

	// filter
	describe('that has this screen transformation', () => {

		beforeEach(() => {
			measurementProvider.measurement = {
				screenWidth: 400,
				screenHeight: 400,
				viewboxWidth: 300,
				viewboxHeight: 150,
				left: 0,
				top: 0
			};
		});

		describe('and that uses css units', () => {

			beforeEach(() => {
				config.units = Units.CSS;
			});

			describe('and that draws a square using a drop-shadow filter', () => {

				beforeEach(() => {
					infiniteContext.filter = 'drop-shadow(60px 60px)'
					infiniteContext.fillRect(0, 0, 80, 80)
				})

				describe('and that transforms in this way', () => {

					beforeEach(() => {
						const transformation = new Transformation(0, -1, 1, 0, 0, 200);
						contextMock.clear();
						viewbox.transformation = transformation;
					})

					it('should set the filter correctly', () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					})
				})
			})

			describe('and that draws a square using a shadow', () => {

				beforeEach(() => {
					infiniteContext.shadowColor = '#f00'
					infiniteContext.shadowOffsetX = 60;
					infiniteContext.shadowOffsetY = 60;
					infiniteContext.fillRect(0, 0, 80, 80)
				});

				describe('and that transforms in this way', () => {

					beforeEach(() => {
						const transformation = new Transformation(0, -1, 1, 0, 0, 200);
						contextMock.clear();
						viewbox.transformation = transformation;
					})

					it('should set the shadow offset correctly', () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					})
				})
			})
		})

		describe('and that uses canvas units', () => {

			beforeEach(() => {
				config.units = Units.CANVAS;
			});

			describe('and that draws a square using a drop-shadow filter', () => {

				beforeEach(() => {
					infiniteContext.filter = 'drop-shadow(60px 60px)'
					infiniteContext.fillRect(0, 0, 80, 80)
				})

				describe('and that transforms in this way', () => {

					beforeEach(() => {
						const transformation = new Transformation(0, -1, 1, 0, 0, 200);
						contextMock.clear();
						viewbox.transformation = transformation;
					})

					it('should set the filter correctly', () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					})
				})
			})

			describe('and that draws a square using a shadow', () => {

				beforeEach(() => {
					infiniteContext.shadowColor = '#f00'
					infiniteContext.shadowOffsetX = 60;
					infiniteContext.shadowOffsetY = 60;
					infiniteContext.fillRect(0, 0, 80, 80)
				});

				describe('and that transforms in this way', () => {

					beforeEach(() => {
						const transformation = new Transformation(0, -1, 1, 0, 0, 200);
						contextMock.clear();
						viewbox.transformation = transformation;
					})

					it('should set the shadow offset correctly', () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					})
				})
			})
		})
	})

	// units
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
				config.units = Units.CANVAS;
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
				config.units = Units.CSS;
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

	// shadow
	describe('that clips and fills with shadow and then clears a rect', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(20, 20, 200, 200)
			infiniteContext.clip();
			infiniteContext.shadowBlur = 2;
			infiniteContext.shadowOffsetX = 60;
			infiniteContext.shadowOffsetY = 60;
			infiniteContext.shadowColor = '#000';
			infiniteContext.fillRect(180, 180, 20, 20);
			contextMock.clear();
			infiniteContext.clearRect(10, 10, 220, 220)
		})

		it("should not have added a clearRect", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	})

	// reset
	describe('that makes a drawing and then resets', () => {

		beforeEach(() => {
			infiniteContext.fillStyle = '#f00'
			infiniteContext.beginPath();
			infiniteContext.rect(0, 0, 10, 10)
			infiniteContext.fill();
			contextMock.clear();
			infiniteContext.reset();
		})

		it("should have no drawing anymore", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe('and then calls fill', () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fill();
			})

			it("should have done nothing", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		})
	})
})
