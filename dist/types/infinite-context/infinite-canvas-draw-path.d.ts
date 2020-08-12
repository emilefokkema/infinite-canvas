import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasDrawPath implements CanvasDrawPath {
    private viewBox;
    constructor(viewBox: ViewBox);
    private isFillRule;
    beginPath(): void;
    clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void;
    fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void;
    isPointInPath(xOrPath: number | Path2D, xOry: number, yOrFillRule: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean;
    isPointInStroke(xOrPath: number | Path2D, xOry: number, y?: number): boolean;
    stroke(path?: Path2D): void;
}
