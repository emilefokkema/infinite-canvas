import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Rectangle } from "../rectangle";

export class ClearRectWithState extends StateAndInstruction implements StateChangingInstructionSetWithArea{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, combinedInstruction: Instruction, public area: Rectangle){
        super(initialState, state, instruction, combinedInstruction);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return false;
    }
    public intersects(area: Rectangle): boolean{
        return this.area.intersects(area);
    }
    public isContainedBy(area: Rectangle): boolean {
        return area.contains(this.area);
    }
    public static createClearRect(initialState: InfiniteCanvasState, area: Rectangle): ClearRectWithState{
        const instructionToClear: Instruction = area.getInstructionToClear().instruction;
        return new ClearRectWithState(initialState, initialState, instructionToClear, instructionToClear, area);
    }
}