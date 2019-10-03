import { Instruction } from "../instruction";
import { CanvasState } from "../canvas-state";

export interface Dimension{
    getInstruction(): Instruction;
    hasSameValueAs(other: CanvasState): boolean;
    hasScale: boolean;
}