import { Transformation } from "./transformation";
import { Transformable } from "./transformable";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { ImmutablePathInstructionSet } from "./immutable-path-instruction-set";

export interface ViewBox extends Transformable{
    width: number;
    height: number;
    readonly state: InfiniteCanvasState;
    saveState(): void;
    restoreState(): void;
    changeState(instruction: (state: InfiniteCanvasState) => InfiniteCanvasState): void;
    clearArea(x: number, y: number, width: number, height: number): void;
    beginPath(): void;
    addToPath(instruction: (instructionSet: ImmutablePathInstructionSet) => ImmutablePathInstructionSet): void;
    drawPath(instruction: (context: CanvasRenderingContext2D) => void): void;
}