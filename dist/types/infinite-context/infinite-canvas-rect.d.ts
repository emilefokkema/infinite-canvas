import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasRect implements CanvasRect {
    private viewBox;
    constructor(viewBox: ViewBox);
    clearRect(x: number, y: number, w: number, h: number): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
}
