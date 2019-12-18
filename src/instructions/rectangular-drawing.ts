import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "../interfaces/state-changing-instruction-set-with-current-state-and-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Rectangle } from "../rectangle";
import { Instruction } from "./instruction";

export class RectangularDrawing extends StateAndInstruction implements StateChangingInstructionSetWithCurrentStateAndArea{
    constructor(initialState: InfiniteCanvasState, instruction: Instruction, public area: Rectangle, stateChangeInstruction: Instruction, currentState: InfiniteCanvasState, initialStateChangeInstruction: Instruction, stateForInstruction: InfiniteCanvasState){
        super(initialState, instruction, stateChangeInstruction, currentState, initialStateChangeInstruction, stateForInstruction);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return this.intersects(area) && !this.isContainedBy(area);
    }
    public intersects(area: Rectangle): boolean{
        return this.area.intersects(area);
    }
    public isContainedBy(area: Rectangle): boolean {
        return area.contains(this.area);
    }
    public static create(initialState: InfiniteCanvasState, instruction: Instruction, area: Rectangle): RectangularDrawing{
        return new RectangularDrawing(initialState, instruction, area, undefined, initialState, undefined, initialState);
    }
}