import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { PathInstructionWithState } from "./path-instruction-with-state";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Position } from "../geometry/position";
import { PathInstruction } from "../interfaces/path-instruction";
import { PathInstructionBuilder } from "./path-instruction-builders/path-instruction-builder";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { StateAndInstruction } from "./state-and-instruction";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";
export declare class InstructionsWithSubpath extends StateChangingInstructionSequence<CopyableInstructionSet> {
    private _initiallyWithState;
    private readonly pathInfinityProvider;
    private pathInstructionBuilder;
    constructor(_initiallyWithState: PathInstructionWithState, pathInfinityProvider: PathInfinityProvider, pathInstructionBuilder: PathInstructionBuilder);
    addInstruction(instruction: StateAndInstruction): void;
    closePath(): void;
    copy(pathInfinityProvider: PathInfinityProvider): InstructionsWithSubpath;
    containsFinitePoint(): boolean;
    isClosable(): boolean;
    canAddLineTo(position: Position): boolean;
    lineTo(position: Position, state: InfiniteCanvasState): void;
    private addInstructionToDrawLineTo;
    addPathInstruction(pathInstruction: PathInstruction, pathInstructionWithState: StateAndInstruction, state: InfiniteCanvasState): void;
    static create(initialState: InfiniteCanvasState, initialPosition: Position, infinityProvider: PathInfinityProvider): InstructionsWithSubpath;
}
