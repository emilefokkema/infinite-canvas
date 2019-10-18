import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { Rectangle } from "../rectangle";
import { PathInstruction } from "../interfaces/path-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithCurrentState } from "../interfaces/state-changing-instruction-set-with-current-state";
import { WithArea } from "../interfaces/with-area";

export class InstructionsWithStateAndArea extends InfiniteCanvasStateAndInstruction implements StateChangingInstructionSetWithCurrentState, WithArea{
    public area: Rectangle;
    constructor(initialState: InfiniteCanvasState, pathInstruction: PathInstruction){
        super(initialState, pathInstruction.instruction);
        this.area = pathInstruction.changeArea.execute(initialState.current.transformation, undefined);
    }
}