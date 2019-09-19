import { Transformation } from "./transformation";
import { Transformable } from "./transformable";
import { InfiniteCanvasState } from "./infinite-canvas-state";
import { InfiniteCanvasPathInstructionSet } from "./infinite-canvas-path-instruction-set";

export interface ViewBox extends Transformable{
    width: number;
    height: number;
    readonly state: InfiniteCanvasState;
    changeState(instruction: (state: InfiniteCanvasState) => InfiniteCanvasState): void;
    addInstruction(instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void): void;
    clearArea(x: number, y: number, width: number, height: number): void;
    beginPath(): void;
    addToPath(instruction: (instructionSet: InfiniteCanvasPathInstructionSet) => void): void;
    drawPath(instruction: (context: CanvasRenderingContext2D) => void): void;
}