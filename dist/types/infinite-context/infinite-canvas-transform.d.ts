import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasTransform implements CanvasTransform {
    private viewBox;
    constructor(viewBox: ViewBox);
    getTransform(): DOMMatrix;
    resetTransform(): void;
    rotate(angle: number): void;
    scale(x: number, y: number): void;
    setTransform(a: number | DOMMatrix2DInit, b?: number, c?: number, d?: number, e?: number, f?: number): void;
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    translate(x: number, y: number): void;
    private addTransformation;
}
