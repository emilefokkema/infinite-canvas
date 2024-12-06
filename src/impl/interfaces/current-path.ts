import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";
import { StateChangingInstructionSet } from './state-changing-instruction-set'
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Position } from "../geometry/position"
import { DrawablePath } from "./drawable-path";

export interface CurrentPath extends StateChangingInstructionSet, DrawablePath{
    allSubpathsAreClosable(): boolean;
    currentSubpathIsClosable(): boolean;
    surroundsFinitePoint(): boolean;
    clipPath(instruction: Instruction, state: InfiniteCanvasState): void;
    addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void;
    closePath(): void;
    moveTo(position: Position, state: InfiniteCanvasState): void;
    canAddLineTo(position: Position, state: InfiniteCanvasState): boolean;
    lineTo(position: Position, state: InfiniteCanvasState): void;
}