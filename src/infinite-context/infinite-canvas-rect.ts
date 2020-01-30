import { ViewBox } from "../interfaces/viewbox";
import { PathInstructions } from "../instructions/path-instructions";
import { Instruction } from "../instructions/instruction";

export class InfiniteCanvasRect implements CanvasRect{
    constructor(private viewBox: ViewBox){}
	public clearRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.clearArea(x, y, w, h);
    }
    public fillRect(x: number, y: number, w: number, h: number): void{
        let instruction: Instruction = (context: CanvasRenderingContext2D) => context.fill();
        this.viewBox.drawPath(instruction, [PathInstructions.rect(x, y, w, h)])
    }
    public strokeRect(x: number, y: number, w: number, h: number): void{
        let instruction: Instruction = (context: CanvasRenderingContext2D) => context.stroke();
        this.viewBox.drawPath(instruction, [PathInstructions.rect(x, y, w, h)]);
    }
}