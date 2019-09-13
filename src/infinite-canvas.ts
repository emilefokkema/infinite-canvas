import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d"
import { InfiniteContext } from "./infinite-context/infinite-context"
import { ViewBox } from "./viewbox";
import { InfiniteCanvasViewBox } from "./infinite-canvas-viewbox";
import { Transformer } from "./transformer/transformer"
import { InfiniteCanvasTransformer } from "./transformer/infinite-canvas-transformer";

export class InfiniteCanvas{
	private context: InfiniteCanvasRenderingContext2D;
	private viewBox: ViewBox;
	constructor(private readonly canvas: HTMLCanvasElement){
		this.viewBox = new InfiniteCanvasViewBox(canvas.width, canvas.height, canvas.getContext("2d"));
		const transformer: Transformer = new InfiniteCanvasTransformer(this.viewBox);
	}
	public getContext(): InfiniteCanvasRenderingContext2D{
		if(!this.context){
			this.context = new InfiniteContext(this.canvas, this.viewBox);
		}
		return this.context;
	}
}