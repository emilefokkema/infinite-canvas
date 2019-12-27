import { ViewBox } from "../interfaces/viewbox";

export class InfiniteCanvasFillStrokeStyles implements CanvasFillStrokeStyles{
    constructor(private viewBox: ViewBox){}
	public set fillStyle(value: string | CanvasGradient | CanvasPattern){
        this.viewBox.changeState(state => state.setFillStyle(value));
	}
    public set strokeStyle(value: string | CanvasGradient | CanvasPattern){
        this.viewBox.changeState(state => state.setStrokeStyle(value));
    }
    public createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient{
        return this.viewBox.createLinearGradient(x0, y0, x1, y1);
    }
    public createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null{
    	return this.viewBox.createPattern(image, repetition);
    }
    public createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient{
    	return this.viewBox.createRadialGradient(x0, y0, r0, x1, y1, r1);
    }
}