import {InfiniteCanvasRenderingContext2D} from "./api-surface/infinite-canvas-rendering-context-2d"
import {InfiniteContext} from "./infinite-context/infinite-context"
import {ViewBox} from "./interfaces/viewbox";
import {InfiniteCanvasViewBox} from "./infinite-canvas-viewbox";
import {InfiniteCanvasTransformer} from "./transformer/infinite-canvas-transformer";
import {InfiniteCanvasEvents} from "./events/infinite-canvas-events";
import {Config} from "./api-surface/config";
import {AnimationFrameDrawingIterationProvider} from "./animation-frame-drawing-iteration-provider";
import {EventMap} from "./api-surface/event-map";
import {AddEventListenerOptions} from "./api-surface/add-event-listener-options";
import {EventListener} from "./api-surface/event-listener";
import {DrawingIterationProviderWithCallback} from "./drawing-iteration-provider-with-callback";
import {LockableDrawingIterationProvider} from "./lockable-drawing-iteration-provider";
import {CanvasRectangle} from "./rectangle/canvas-rectangle";
import {HTMLCanvasRectangle} from "./rectangle/html-canvas-rectangle";
import {HtmlCanvasMeasurementProvider} from "./rectangle/html-canvas-measurement-provider";
import {Units} from "./api-surface/units";
import {CanvasResizeObserver} from "./canvas-resize-observer";
import {HtmlCanvasResizeObserver} from "./html-canvas-resize-observer";
import {EventDispatcher} from "./custom-events/event-dispatcher";
import {DrawEvent} from "./api-surface/draw-event";
import {EventDispatcherCollection} from "./custom-events/event-dispatcher-collection";
import {representTransformation} from "./transformer/represent-transformation";
import {InfiniteCanvas as InfiniteCanvasInterface, InfiniteCanvasCtr} from './api-surface/infinite-canvas'

class InfiniteCanvas implements InfiniteCanvasInterface{
	private context: InfiniteCanvasRenderingContext2D;
	private viewBox: ViewBox;
	private config: Config;
	private eventDispatchers: EventDispatcherCollection;
	private rectangle: CanvasRectangle;
	private canvasResizeObserver: CanvasResizeObserver;
	private canvasResizeListener: () => void;
	constructor(private readonly canvas: HTMLCanvasElement, config?: Config){
		const drawEventDispatcher: EventDispatcher<DrawEvent> = new EventDispatcher();
		this.config = {rotationEnabled: true, greedyGestureHandling: false, units: Units.CANVAS};
		if(config){
			Object.assign(this.config, config)
		}
		this.canvasResizeObserver = new HtmlCanvasResizeObserver(canvas);
		this.canvasResizeListener = () => {
			if(this.canvas.parentElement === null){
				return;
			}
			this.viewBox.draw();
		};
		const drawingIterationProvider: DrawingIterationProviderWithCallback = new DrawingIterationProviderWithCallback(new AnimationFrameDrawingIterationProvider());
		drawingIterationProvider.onDraw(() => drawEventDispatcher.dispatchEvent({
			transformation: representTransformation(this.rectangle.inverseInfiniteCanvasContextBase),
			inverseTransformation: representTransformation(this.rectangle.infiniteCanvasContextBase)
		}));
		const lockableDrawingIterationProvider: LockableDrawingIterationProvider = new LockableDrawingIterationProvider(drawingIterationProvider);
		this.rectangle = new HTMLCanvasRectangle(new HtmlCanvasMeasurementProvider(canvas), this.config);
		let transformer: InfiniteCanvasTransformer;
		this.viewBox = new InfiniteCanvasViewBox(
			this.rectangle,
			canvas.getContext("2d"),
			lockableDrawingIterationProvider,
			() => lockableDrawingIterationProvider.getLock(),
			() => transformer.isTransforming);
		transformer = new InfiniteCanvasTransformer(this.viewBox, this.config);
		const events: InfiniteCanvasEvents = new InfiniteCanvasEvents(canvas, transformer, this.config, this.rectangle);

		this.eventDispatchers = new EventDispatcherCollection(
			this.rectangle,
			drawEventDispatcher,
			transformer.transformationStart,
			transformer.transformationChange,
			transformer.transformationEnd);
		if(config && config.units === Units.CSS){
			this.canvasResizeObserver.addListener(this.canvasResizeListener);
		}
	}
	private setUnits(units: Units): void{
		if(units === Units.CSS && this.config.units !== Units.CSS){
			this.canvasResizeObserver.addListener(this.canvasResizeListener);
		}
		if(units !== Units.CSS && this.config.units === Units.CSS){
			this.canvasResizeObserver.removeListener(this.canvasResizeListener);
		}
		this.config.units = units;
		this.rectangle.measure();
		this.viewBox.draw();
	}
	public getContext(): InfiniteCanvasRenderingContext2D{
		if(!this.context){
			this.context = new InfiniteContext(this.canvas, this.viewBox);
		}
		return this.context;
	}
	public get rotationEnabled(): boolean{
		return this.config.rotationEnabled;
	}
	public set rotationEnabled(value: boolean){
		this.config.rotationEnabled = value;
	}
	public get units(): Units{
		return this.config.units;
	}
	public set units(value: Units){
		this.setUnits(value)
	}
	public get greedyGestureHandling(): boolean{
		return this.config.greedyGestureHandling;
	}
	public set greedyGestureHandling(value: boolean){
		this.config.greedyGestureHandling = value;
	}
	public addEventListener<K extends keyof EventMap>(type: K, listener: EventListener<K>, options?: AddEventListenerOptions): void{
		this.eventDispatchers.addEventListener(type, listener, options);
	}
	public removeEventListener<K extends keyof EventMap>(type: K, listener: EventListener<K>): void{
		this.eventDispatchers.removeEventListener(type, listener);
	}
	public static CANVAS_UNITS: Units = Units.CANVAS;
	public static CSS_UNITS: Units = Units.CSS;
}

const ctr: InfiniteCanvasCtr = InfiniteCanvas;

export {ctr as InfiniteCanvas};
