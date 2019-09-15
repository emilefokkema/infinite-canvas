import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d"
import { InfiniteContext } from "./infinite-context/infinite-context"
import { ViewBox } from "./viewbox";
import { InfiniteCanvasViewBox } from "./infinite-canvas-viewbox";
import { Transformer } from "./transformer/transformer"
import { InfiniteCanvasTransformer } from "./transformer/infinite-canvas-transformer";
import { InfiniteCanvasEvents } from "./events/infinite-canvas-events";

export class InfiniteCanvas{
	private context: InfiniteCanvasRenderingContext2D;
	private viewBox: ViewBox;
	private transformer: Transformer;
	constructor(private readonly canvas: HTMLCanvasElement){
		this.viewBox = new InfiniteCanvasViewBox(canvas.width, canvas.height, canvas.getContext("2d"));
		this.transformer = new InfiniteCanvasTransformer(this.viewBox);
		const events: InfiniteCanvasEvents = new InfiniteCanvasEvents(canvas, this.viewBox, this.transformer);
	}
	public getContext(): InfiniteCanvasRenderingContext2D{
		if(!this.context){
			this.context = new InfiniteContext(this.canvas, this.viewBox);
		}
		return this.context;
	}
	public get rotationEnabled(): boolean{
		return this.transformer.rotationEnabled;
	}
	public set rotationEnabled(value: boolean){
		this.transformer.rotationEnabled = value;
	}
}