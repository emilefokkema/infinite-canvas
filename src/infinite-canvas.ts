import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d"
import { InfiniteContext } from "./infinite-context/infinite-context"

export default class InfiniteCanvas{
	private context: InfiniteCanvasRenderingContext2D;
	constructor(private readonly canvas: HTMLCanvasElement){}
	public getContext(): InfiniteCanvasRenderingContext2D{
		if(!this.context){
			this.context = new InfiniteContext(this.canvas);
		}
		return this.context;
	}
}