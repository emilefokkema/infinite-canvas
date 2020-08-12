import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasDrawImage implements CanvasDrawImage {
    private readonly viewBox;
    constructor(viewBox: ViewBox);
    drawImage(): void;
    private getDrawImageInstruction;
    private getDrawnLength;
    private getLength;
}
