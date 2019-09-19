import { ViewBox } from "../viewbox";

export class InfiniteCanvasRect implements CanvasRect{
    constructor(private viewBox: ViewBox){}
	public clearRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.clearArea(x, y, w, h);
    }
    public fillRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.beginPath();
        this.viewBox.addToPath(path => path.rect(x, y, w, h));
        this.viewBox.drawPath((context: CanvasRenderingContext2D) => context.fill())
    }
    public strokeRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.beginPath();
        this.viewBox.addToPath(path => path.rect(x, y, w, h));
        this.viewBox.drawPath((context: CanvasRenderingContext2D) => context.stroke())
    }
}