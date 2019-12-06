import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "../interfaces/state-changing-instruction-set-with-current-state-and-area";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { Drawing } from "../interfaces/drawing";
import { Rectangle } from "../rectangle";
import { ClearRectWithState } from "./clear-rect-with-state";
import { defaultState } from "../state/default-state";
import {InfiniteCanvasStateAndInstruction} from "./infinite-canvas-state-and-instruction";
import {StateChangingInstructionSetWithCurrentState} from "../interfaces/state-changing-instruction-set-with-current-state";
import {InfiniteCanvasState} from "../state/infinite-canvas-state";

export class PreviousInstructions extends StateChangingInstructionSequence<StateChangingInstructionSetWithCurrentStateAndArea> implements Drawing{
    constructor(initiallyWithState: InfiniteCanvasStateAndInstruction){
        super(initiallyWithState);
    }
    protected reconstructState(instructionSetToChange: StateChangingInstructionSetWithCurrentState, stateToChangeTo: InfiniteCanvasState): void {
        instructionSetToChange.changeToStateWithClippedPaths(stateToChangeTo);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return this.contains(i => i.hasDrawingAcrossBorderOf(area));
    }
    public intersects(area: Rectangle): boolean{
        return this.contains(i => i.intersects(area));
    }
    public addClearRect(area: Rectangle): void{
        this.add(ClearRectWithState.create(this.state, area));
    }
    public clearContentsInsideArea(area: Rectangle): void{
        this.removeAll(i => i.isContainedBy(area), instructionSet => instructionSet.destroy());
    }
    public isContainedBy(area: Rectangle): boolean {
        return !this.contains(i => !i.isContainedBy(area));
    }
    public static create(): PreviousInstructions{
        return new PreviousInstructions(InfiniteCanvasStateAndInstruction.create(defaultState, InfiniteCanvasStateInstance.setDefault));
    }
}