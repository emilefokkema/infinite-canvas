import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";

export interface CurrentPath{
    drawPath(instruction: Instruction): void;
    addPathInstruction(pathInstruction: PathInstruction): void;
}