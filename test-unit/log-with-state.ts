import { logInstruction } from "./log-instruction";
import { Instruction } from "src/instructions/instruction";

export function logWithState(withState: Instruction): string[]{
    return logInstruction(withState)
}