import { Mock, MockInstance, vi } from 'vitest'
import { DrawingLock } from "src/drawing-lock";
import { MockCanvasMeasurementProvider } from './mock-canvas-measurement-provider';
import { CanvasContextMock } from './canvas-context-mock';
import { Config } from 'api/config';
import { MockDrawingIterationProvider } from './mock-drawing-iteration-provider';
import { CssLengthConverterFactory } from 'src/css-length-converter-factory';
import { InfiniteCanvasViewBox } from 'src/infinite-canvas-viewbox';
import { RectangleManagerImpl } from 'src/rectangle/rectangle-manager-impl';
import { InfiniteContext } from 'src/infinite-context/infinite-context';
import { ViewBox } from 'src/interfaces/viewbox';
import { InfiniteCanvasRenderingContext2D } from 'api/infinite-canvas-rendering-context-2d';


function setupGlobals(){
	window.createImageBitmap = function(): Promise<ImageBitmap>{return undefined;};
	(<any>window).ImageData = class {
		public width: number;
		public height: number;
		public data: Uint8ClampedArray;
		constructor(arrayOrWidth: Uint8ClampedArray | number, widthOrHeight: number, height?: number){
			if(typeof arrayOrWidth === "number"){
				this.width = arrayOrWidth;
				this.height = widthOrHeight;
			}else{
				this.width = widthOrHeight;
				this.height = height;
				this.data = arrayOrWidth;
			}
		}
	};
}

export interface InfiniteCanvasTestFixture{
    width: number
    height: number
    releaseDrawingLockSpy: MockInstance<()=>void>
    getDrawingLockSpy: MockInstance<()=>DrawingLock>
    measurementProvider: MockCanvasMeasurementProvider
    contextMock: CanvasContextMock
    config: Partial<Config>
    mockDrawingIterationProvider: MockDrawingIterationProvider
    viewbox: ViewBox,
    infiniteContext: InfiniteCanvasRenderingContext2D
}

export function createInfiniteCanvasTestFixture(): InfiniteCanvasTestFixture{
    setupGlobals();
    const drawingLock: DrawingLock = {release(){}};
    const releaseDrawingLockSpy = vi.spyOn(drawingLock, 'release');
    const getDrawingLockSpy = vi.fn<()=>DrawingLock>().mockReturnValue(drawingLock)
    const width = 200;
    const height = 200;
    const measurementProvider = new MockCanvasMeasurementProvider(width, height);
    const contextMock = new CanvasContextMock();
    const config = {}
    const mockDrawingIterationProvider = new MockDrawingIterationProvider()
    const cssLengthConverterFactory: CssLengthConverterFactory = {
        create: () => ({
            getNumberOfPixels(value: number){
                return value;
            }
        })
    };
    const viewbox = new InfiniteCanvasViewBox(
        new RectangleManagerImpl(measurementProvider, config),
        contextMock.mock,
        mockDrawingIterationProvider,
        getDrawingLockSpy,
        () => false);
    const infiniteContext = new InfiniteContext(undefined, viewbox, cssLengthConverterFactory);
    return {
        width,
        height,
        releaseDrawingLockSpy,
        getDrawingLockSpy,
        measurementProvider,
        contextMock,
        config,
        mockDrawingIterationProvider,
        viewbox,
        infiniteContext
    };
}