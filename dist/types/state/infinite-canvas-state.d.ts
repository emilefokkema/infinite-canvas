import { InfiniteCanvasStateInstance } from "./infinite-canvas-state-instance";
import { Instruction } from "../instructions/instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
export declare class InfiniteCanvasState {
    current: InfiniteCanvasStateInstance;
    stack: InfiniteCanvasStateInstance[];
    constructor(current: InfiniteCanvasStateInstance, stack?: InfiniteCanvasStateInstance[]);
    replaceCurrent(newCurrent: InfiniteCanvasStateInstance): InfiniteCanvasState;
    withCurrentState(newCurrent: InfiniteCanvasStateInstance): InfiniteCanvasState;
    currentlyTransformed(transformed: boolean): InfiniteCanvasState;
    withClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): InfiniteCanvasState;
    saved(): InfiniteCanvasState;
    restored(): InfiniteCanvasState;
    private convertToLastSavedInstance;
    private convertFromLastSavedInstance;
    private getInstructionToConvertToStateUsingConversion;
    getInstructionToConvertToState(other: InfiniteCanvasState, rectangle: CanvasRectangle): Instruction;
    getInstructionToClearStack(): Instruction;
    getInstructionToConvertToStateWithClippedPath(other: InfiniteCanvasState, rectangle: CanvasRectangle): Instruction;
    private static findIndexOfHighestCommon;
}
