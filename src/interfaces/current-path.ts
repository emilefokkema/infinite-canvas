import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";
import { StateChangingInstructionSet } from './state-changing-instruction-set'
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Position } from "../geometry/position"
import { InstructionsToClip } from "./instructions-to-clip";
import { DrawnPathProperties } from './drawn-path-properties'
import { Area } from '../areas/area'
import { ExecutableStateChangingInstructionSet } from "./executable-state-changing-instruction-set";

export interface CurrentPath extends StateChangingInstructionSet{
    area: Area
    allSubpathsAreClosable(): boolean;
    currentSubpathIsClosable(): boolean;
    containsFinitePoint(): boolean;
    drawPath(instruction: Instruction, state: InfiniteCanvasState, drawnPathProperties: DrawnPathProperties): ExecutableStateChangingInstructionSet
    clipPath(instruction: Instruction, state: InfiniteCanvasState): void;
    addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void;
    closePath(): void;
    moveTo(position: Position, state: InfiniteCanvasState): void;
    canAddLineTo(position: Position, state: InfiniteCanvasState): boolean;
    lineTo(position: Position, state: InfiniteCanvasState): void;
    rect(x: number, y: number, w: number, h: number, state: InfiniteCanvasState): void;
    recreatePath(): CurrentPath;
    getInstructionsToClip(): InstructionsToClip;
}