export class InfiniteCanvasText implements CanvasText{
	public fillText(text: string, x: number, y: number, maxWidth?: number): void{}
	public measureText(text: string): TextMetrics{return undefined;}
	public strokeText(text: string, x: number, y: number, maxWidth?: number): void{}
}