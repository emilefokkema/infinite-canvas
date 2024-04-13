import { Position } from "../../geometry/position";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { InstructionUsingInfinity } from "../instruction-using-infinity";

export interface PathInstructionBuilder{
    getInstructionToDrawLineTo(position: Position, state: InfiniteCanvasState): InstructionUsingInfinity;
    getInstructionToMoveToBeginning(state: InfiniteCanvasState): InstructionUsingInfinity;
    canAddLineTo(position: Position): boolean;
    addPosition(position: Position): PathInstructionBuilder;
    isClosable(): boolean;
    containsFinitePoint(): boolean;
    surroundsFinitePoint(): boolean;
    readonly currentPosition: Position;
}
