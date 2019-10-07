import { ViewBox } from "../viewbox";
import { ImmutablePathInstructionSet } from "../immutable-path-instruction-set";

export class InfiniteCanvasRect implements CanvasRect{
    constructor(private viewBox: ViewBox){}
	public clearRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.clearArea(x, y, w, h);
    }
    public fillRect(x: number, y: number, w: number, h: number): void{
        const rectPath: ImmutablePathInstructionSet = ImmutablePathInstructionSet.default().rect(x, y, w, h);
        this.viewBox.drawPath((context: CanvasRenderingContext2D) => context.fill(), rectPath)
    }
    public strokeRect(x: number, y: number, w: number, h: number): void{
        const rectPath: ImmutablePathInstructionSet = ImmutablePathInstructionSet.default().rect(x, y, w, h);
        this.viewBox.drawPath((context: CanvasRenderingContext2D) => context.stroke(), rectPath);
    }
}