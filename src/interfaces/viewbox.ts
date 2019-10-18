import { Transformable } from "../transformable";
import { CurrentState } from "./current-state";
import { CurrentPath } from "./current-path";
import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";

export interface ViewBox extends Transformable, CurrentState, CurrentPath{
    width: number;
    height: number;
    drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void;
    clearArea(x: number, y: number, width: number, height: number): void;
    beginPath(): void;
}