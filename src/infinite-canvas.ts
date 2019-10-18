import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d"
import { InfiniteContext } from "./infinite-context/infinite-context"
import { ViewBox } from "./interfaces/viewbox";
import { InfiniteCanvasViewBox } from "./infinite-canvas-viewbox";
import { Transformer } from "./transformer/transformer"
import { InfiniteCanvasTransformer } from "./transformer/infinite-canvas-transformer";
import { InfiniteCanvasEvents } from "./events/infinite-canvas-events";
import { InfiniteCanvasConfig } from "./config/infinite-canvas-config";

export class InfiniteCanvas implements InfiniteCanvasConfig{
	private context: InfiniteCanvasRenderingContext2D;
	private viewBox: ViewBox;
	private transformer: Transformer;
	private config: InfiniteCanvasConfig;
	constructor(private readonly canvas: HTMLCanvasElement, config?: InfiniteCanvasConfig){
		this.config = config || {rotationEnabled: true, greedyGestureHandling: false};
		this.viewBox = new InfiniteCanvasViewBox(canvas.width, canvas.height, canvas.getContext("2d"));
		this.transformer = new InfiniteCanvasTransformer(this.viewBox, this.config);
		const events: InfiniteCanvasEvents = new InfiniteCanvasEvents(canvas, this.viewBox, this.transformer, this.config);
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
	public get greedyGestureHandling(): boolean{
		return this.config.greedyGestureHandling;
	}
	public set greedyGestureHandling(value: boolean){
		this.config.greedyGestureHandling = value;
	}
}