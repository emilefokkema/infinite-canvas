import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "./state-changing-instruction-set-with-area-and-current-path";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Area } from "../areas/area";
import { Position } from "../geometry/position";
export interface CurrentPath {
    allSubpathsAreClosable(): boolean;
    currentSubpathIsClosable(): boolean;
    containsFinitePoint(): boolean;
    fillPath(instruction: Instruction, state: InfiniteCanvasState): void;
    strokePath(instruction: Instruction, state: InfiniteCanvasState): void;
    clipPath(instruction: Instruction, state: InfiniteCanvasState): void;
    addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void;
    closePath(): void;
    moveTo(position: Position, state: InfiniteCanvasState): void;
    canAddLineTo(position: Position, state: InfiniteCanvasState): boolean;
    lineTo(position: Position, state: InfiniteCanvasState): void;
    rect(x: number, y: number, w: number, h: number, state: InfiniteCanvasState): void;
    recreatePath(): StateChangingInstructionSetWithAreaAndCurrentPath;
    getClippedArea(previouslyClipped?: Area): Area;
}
