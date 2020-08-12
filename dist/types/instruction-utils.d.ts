import { Instruction } from "./instructions/instruction";
import { InstructionUsingInfinity } from "./instructions/instruction-using-infinity";
export declare function transformInstructionAbsolutely(instruction: Instruction): Instruction;
export declare function transformInstructionRelatively(instruction: Instruction): Instruction;
export declare function combineInstructions(instructions: InstructionUsingInfinity[]): InstructionUsingInfinity;
export declare function instructionSequence(...instructions: InstructionUsingInfinity[]): InstructionUsingInfinity;
