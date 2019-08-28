export class InfiniteCanvasDrawImage implements CanvasDrawImage{
	public drawImage(): void{
		const argumentsArray = Array.prototype.slice.apply(arguments);
		if(arguments.length <= 4){
			const [image, dx, dy, dw, dh]: [CanvasImageSource, number, number, number, number] = argumentsArray;
			this.drawImageWithoutSourceRect(image, dx, dy, dw, dh);
		}
		const [image, sx, sy, sw, sh, dx, dy, dw, dh]: [CanvasImageSource, number, number, number, number, number, number, number, number] = argumentsArray;
		this.drawImageFromSourceRect(image, sx, sy, sw, sh, dx, dy, dw, dh);
	}
	private drawImageFromSourceRect(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void{

	}
	private drawImageWithoutSourceRect(image: CanvasImageSource, dx: number, dy: number, dw?: number, dh?: number): void{

	}
}