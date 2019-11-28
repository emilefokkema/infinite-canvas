import {InfiniteCanvasFillStrokeStyle} from "./infinite-canvas-fill-stroke-style";

export abstract class InfiniteCanvasGradient extends InfiniteCanvasFillStrokeStyle implements CanvasGradient{
    private colorStops: {offset: number; color: string}[] = [];
    protected gradient: CanvasGradient;
    protected addColorStops(): void{
        for(const colorStop of this.colorStops){
            this.gradient.addColorStop(colorStop.offset, colorStop.color);
        }
    }
    public get fillStrokeStyle(): CanvasPattern | CanvasGradient{return this.gradient;}
    public addColorStop(offset: number, color: string): void {
        this.colorStops.push({offset, color});
    }
}