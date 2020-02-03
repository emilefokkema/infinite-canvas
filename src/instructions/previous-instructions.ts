import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { defaultState } from "../state/default-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { StateAndInstruction } from "./state-and-instruction";
import { Rectangle } from "../rectangle";
import { ClearRectWithState } from "./clear-rect-with-state";
import { Drawing } from "../interfaces/drawing";

export class PreviousInstructions extends StateChangingInstructionSequence<StateChangingInstructionSetWithArea> implements Drawing{
    constructor(initiallyWithState: StateAndInstruction){
        super(initiallyWithState);
    }
    protected reconstructState(fromState: InfiniteCanvasState, toInstructionSet: StateChangingInstructionSetWithArea): void{
        toInstructionSet.setInitialStateWithClippedPaths(fromState);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return this.contains(i => i.hasDrawingAcrossBorderOf(area));
    }
    public intersects(area: Rectangle): boolean{
        return this.contains(i => i.intersects(area));
    }
    public addClearRect(area: Rectangle, state: InfiniteCanvasState): void{
        const clearRect: ClearRectWithState = ClearRectWithState.createClearRect(state, area);
        clearRect.setInitialState(this.state);
        this.add(clearRect);
    }
    public clearContentsInsideArea(area: Rectangle): void{
        this.removeAll(i => i.isContainedBy(area));
    }
    public isContainedBy(area: Rectangle): boolean {
        return !this.contains(i => !i.isContainedBy(area));
    }
    public static create(): PreviousInstructions{
        return new PreviousInstructions(StateAndInstruction.create(defaultState, InfiniteCanvasStateInstance.setDefault));
    }
}