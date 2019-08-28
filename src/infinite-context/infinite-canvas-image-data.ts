export class InfiniteCanvasImageData implements CanvasImageData{
	public createImageData(swOrImageData: number | ImageData, sh?: number): ImageData{return undefined;}
	public getImageData(sx: number, sy: number, sw: number, sh: number): ImageData{return undefined;}
	public putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void{}
}