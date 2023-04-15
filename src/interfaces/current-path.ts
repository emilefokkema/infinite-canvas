import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";
import { StateChangingInstructionSetWithCurrentPath } from "./state-changing-instruction-set-with-current-path";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Position } from "../geometry/position"
import { StateChangingInstructionSetWithPositiveArea } from "./state-changing-instruction-set-with-positive-area";
import { InstructionsToClip } from "./instructions-to-clip";

export interface CurrentPath{
    allSubpathsAreClosable(): boolean;
    currentSubpathIsClosable(): boolean;
    containsFinitePoint(): boolean;
    fillPath(instruction: Instruction, state: InfiniteCanvasState): StateChangingInstructionSetWithPositiveArea;
    strokePath(instruction: Instruction, state: InfiniteCanvasState): StateChangingInstructionSetWithPositiveArea;
    clipPath(instruction: Instruction, state: InfiniteCanvasState): void;
    addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void;
    closePath(): void;
    moveTo(position: Position, state: InfiniteCanvasState): void;
    canAddLineTo(position: Position, state: InfiniteCanvasState): boolean;
    lineTo(position: Position, state: InfiniteCanvasState): void;
    rect(x: number, y: number, w: number, h: number, state: InfiniteCanvasState): void;
    recreatePath(): StateChangingInstructionSetWithCurrentPath;
    getInstructionsToClip(): InstructionsToClip;
}