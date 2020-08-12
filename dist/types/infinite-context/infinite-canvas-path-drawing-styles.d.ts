import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasPathDrawingStyles implements CanvasPathDrawingStyles {
    private viewBox;
    constructor(viewBox: ViewBox);
    lineCap: CanvasLineCap;
    get lineDashOffset(): number;
    set lineDashOffset(value: number);
    lineJoin: CanvasLineJoin;
    get lineWidth(): number;
    set lineWidth(value: number);
    miterLimit: number;
    getLineDash(): number[];
    setLineDash(segments: number[]): void;
}
