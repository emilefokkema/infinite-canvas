export class InfiniteCanvasPathDrawingStyles implements CanvasPathDrawingStyles{
	public lineCap: CanvasLineCap;
	public lineDashOffset: number;
	public lineJoin: CanvasLineJoin;
	public lineWidth: number;
	public miterLimit: number;
	public getLineDash(): number[]{return [];}
	public setLineDash(segments: number[]): void{}
}