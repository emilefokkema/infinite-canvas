export class InfiniteCanvasTransform implements CanvasTransform{
	public getTransform(): DOMMatrix{
		return undefined;
	}
	public resetTransform(): void{}
	public rotate(angle: number): void{}
	public scale(x: number, y: number): void{}
	public setTransform(a: number | DOMMatrix2DInit, b?: number, c?: number, d?: number, e?: number, f?: number): void{}
	public transform(a: number, b: number, c: number, d: number, e: number, f: number): void{}
	public translate(x: number, y: number): void{}
}