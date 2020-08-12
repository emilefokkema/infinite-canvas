import { InfiniteCanvasFillStrokeStyle } from "./infinite-canvas-fill-stroke-style";
import { Instruction } from "../instructions/instruction";
export declare class InfiniteCanvasPattern extends InfiniteCanvasFillStrokeStyle implements CanvasPattern {
    private readonly fillStrokeStyle;
    constructor(fillStrokeStyle: CanvasPattern);
    setTransform(transform?: DOMMatrix2DInit): void;
    getInstructionToSetUntransformed(propName: "fillStyle" | "strokeStyle"): Instruction;
    getInstructionToSetTransformed(propName: "fillStyle" | "strokeStyle"): Instruction;
}
