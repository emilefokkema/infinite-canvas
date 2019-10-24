import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "../interfaces/state-changing-instruction-set-with-current-state-and-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { Drawing } from "../interfaces/drawing";
import { Rectangle } from "../rectangle";
import { ClearRectWithState } from "./clear-rect-with-state";

export class PreviousInstructions extends StateChangingInstructionSequence<StateChangingInstructionSetWithCurrentStateAndArea> implements Drawing{
    constructor(){
        super(InfiniteCanvasState.default, InfiniteCanvasStateInstance.setDefault);
    }
    public addAndMaintainState(instructionSet: StateChangingInstructionSetWithCurrentStateAndArea){
        const currentState: InfiniteCanvasState = this.state;
        this.add(instructionSet);
        this.changeToState(currentState);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return this.contains(i => i.hasDrawingAcrossBorderOf(area));
    }
    public intersects(area: Rectangle): boolean{
        return this.contains(i => i.intersects(area));
    }
    public addClearRect(area: Rectangle): void{
        this.addAndMaintainState(new ClearRectWithState(this.state, area));
    }
    public clearContentsInsideArea(area: Rectangle): void{
        this.removeAll(i => i.area && area.contains(i.area));
    }
}