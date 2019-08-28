export class InfiniteCanvasFillStrokeStyles implements CanvasFillStrokeStyles{
	public set fillStyle(value: string | CanvasGradient | CanvasPattern){

	}
    public set strokeStyle(value: string | CanvasGradient | CanvasPattern){

    }
    public createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient{
    	return undefined
    }
    public createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null{
    	return undefined;
    }
    public createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient{
    	return undefined;
    }
}