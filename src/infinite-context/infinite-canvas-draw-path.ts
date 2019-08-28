export class InfiniteCanvasDrawPath implements CanvasDrawPath{
	public beginPath(): void{}
	public clip(pathOrFillRule: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{}
	public fill(pathOrFillRule: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{}
	public isPointInPath(xOrPath: number | Path2D, xOry: number, yOrFillRule: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean{return true;}
	public isPointInStroke(xOrPath: number | Path2D, xOry: number, y?:number): boolean{return true;}
	public stroke(path?: Path2D): void{}
}