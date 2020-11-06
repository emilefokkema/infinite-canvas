import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { InstructionWithState } from "./instruction-with-state";
import { InstructionUsingInfinity } from "./instruction-using-infinity";
import { Transformation } from "../transformation";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
export declare class PathInstructionWithState extends InstructionWithState implements CopyableInstructionSet {
    private infinity;
    private instruction;
    constructor(initialState: InfiniteCanvasState, infinity: ViewboxInfinity, state: InfiniteCanvasState, instruction: InstructionUsingInfinity, stateConversion: Instruction, rectangle: CanvasRectangle);
    protected executeInstruction(context: CanvasRenderingContext2D, transformation: Transformation): void;
    replaceInstruction(instruction: InstructionUsingInfinity): void;
    copy(pathInfinityProvider: PathInfinityProvider): PathInstructionWithState;
    static create(initialState: InfiniteCanvasState, infinity: ViewboxInfinity, initialInstruction: InstructionUsingInfinity, rectangle: CanvasRectangle): PathInstructionWithState;
}
