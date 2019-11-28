import { ViewBox } from "../interfaces/viewbox";
import { PathInstructions } from "../instructions/path-instructions";

export class InfiniteCanvasRect implements CanvasRect{
    constructor(private viewBox: ViewBox){}
	public clearRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.clearArea(x, y, w, h);
    }
    public fillRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.drawPath((context: CanvasRenderingContext2D) => context.fill(), state => state.fillStyle, [PathInstructions.rect(x, y, w, h)])
    }
    public strokeRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.drawPath((context: CanvasRenderingContext2D) => context.stroke(), state => state.strokeStyle, [PathInstructions.rect(x, y, w, h)]);
    }
}