import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasText implements CanvasText {
    private readonly viewBox;
    constructor(viewBox: ViewBox);
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    measureText(text: string): TextMetrics;
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
    private getDrawnRectangle;
}
