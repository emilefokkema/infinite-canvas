import { Instruction } from "./instructions/instruction";
import { PathInstruction } from "./instructions/path-instruction";
import { CurrentPath } from "./current-path";

export interface PathContainer extends CurrentPath{
    drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void;
    clearArea(x: number, y: number, width: number, height: number): void;
    beginPath(): void;
}