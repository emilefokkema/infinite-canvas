import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d"
import { InfiniteContext } from "./infinite-context/infinite-context"
import { ViewBox } from "./viewbox";
import { InfiniteCanvasViewBox } from "./infinite-canvas-viewbox";

export class InfiniteCanvas{
	private context: InfiniteCanvasRenderingContext2D;
	private viewBox: ViewBox;
	constructor(private readonly canvas: HTMLCanvasElement){
		this.viewBox = new InfiniteCanvasViewBox(canvas.width, canvas.height, canvas.getContext("2d"));
	}
	public getContext(): InfiniteCanvasRenderingContext2D{
		if(!this.context){
			this.context = new InfiniteContext(this.canvas, this.viewBox);
		}
		return this.context;
	}
}