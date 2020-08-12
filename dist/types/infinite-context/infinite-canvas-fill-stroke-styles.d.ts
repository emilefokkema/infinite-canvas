import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasFillStrokeStyles implements CanvasFillStrokeStyles {
    private viewBox;
    constructor(viewBox: ViewBox);
    set fillStyle(value: string | CanvasGradient | CanvasPattern);
    set strokeStyle(value: string | CanvasGradient | CanvasPattern);
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
}
