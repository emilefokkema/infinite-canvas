import { Instruction } from "../instructions/instruction";
import { InstructionAndState } from "./instruction-and-state";

export interface InstructionSet{
    execute: Instruction;
    getAllInstructionsAndStates(): InstructionAndState[];
}