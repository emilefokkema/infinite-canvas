import { Instruction } from "./instructions/instruction";

export abstract class InfiniteCanvasFillStrokeStyle {
    public abstract getInstructionToSetUntransformed(propName: "fillStyle" | "strokeStyle"): Instruction;
    public abstract getInstructionToSetTransformed(propName: "fillStyle" | "strokeStyle"): Instruction;
}