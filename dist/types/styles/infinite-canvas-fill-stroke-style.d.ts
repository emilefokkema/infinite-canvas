import { Instruction } from "../instructions/instruction";
export declare abstract class InfiniteCanvasFillStrokeStyle {
    abstract getInstructionToSetUntransformed(propName: "fillStyle" | "strokeStyle"): Instruction;
    abstract getInstructionToSetTransformed(propName: "fillStyle" | "strokeStyle"): Instruction;
}
