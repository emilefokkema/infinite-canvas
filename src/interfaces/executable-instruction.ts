import { Instruction } from "../instructions/instruction";

export interface ExecutableInstruction{
    execute: Instruction;
}