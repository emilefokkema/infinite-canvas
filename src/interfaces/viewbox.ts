import { Transformable } from "../transformable";
import { CurrentState } from "./current-state";
import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";
import {InfiniteCanvasStateInstance} from "../state/infinite-canvas-state-instance";

export interface ViewBox extends Transformable, CurrentState{
    width: number;
    height: number;
    drawPath(instruction: Instruction, getFillStrokeStyle: (stateInstance: InfiniteCanvasStateInstance) => string | CanvasGradient | CanvasPattern, pathInstructions?: PathInstruction[]): void;
    clearArea(x: number, y: number, width: number, height: number): void;
    beginPath(): void;
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    clipPath(instruction: Instruction): void;
    addPathInstruction(pathInstruction: PathInstruction): void;
}