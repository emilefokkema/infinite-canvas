import { ViewBox } from "../interfaces/viewbox";

export class InfiniteCanvasState implements CanvasState{
	constructor(private viewBox: ViewBox){}
	public restore():void{
		this.viewBox.restoreState();
	}
	public save(): void{
		this.viewBox.saveState();
	}
}