import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { defaultState } from "../state/default-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { StateAndInstruction } from "./state-and-instruction";
import { ClearRectWithState } from "./clear-rect-with-state";
import { Area } from "../areas/area";
import { PartOfDrawing } from "../interfaces/part-of-drawing";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class PreviousInstructions extends StateChangingInstructionSequence<StateChangingInstructionSetWithArea> implements PartOfDrawing{
    constructor(initiallyWithState: StateAndInstruction, private readonly rectangle: CanvasRectangle){
        super(initiallyWithState);
    }
    protected reconstructState(fromState: InfiniteCanvasState, toInstructionSet: StateChangingInstructionSetWithArea): void{
        toInstructionSet.setInitialStateWithClippedPaths(fromState);
    }
    public hasDrawingAcrossBorderOf(area: Area): boolean{
        return this.contains(i => i.hasDrawingAcrossBorderOf(area));
    }
    public intersects(area: Area): boolean{
        return this.contains(i => i.intersects(area));
    }
    public addClearRect(area: Area, state: InfiniteCanvasState, x: number, y: number, width: number, height: number): void{
        const infinity: ViewboxInfinity = this.rectangle.getForPath().getInfinity(state);
        const clearRect: ClearRectWithState = ClearRectWithState.createClearRect(state, area, infinity, x, y, width, height, this.rectangle);
        clearRect.setInitialState(this.state);
        this.add(clearRect);
    }
    public clearContentsInsideArea(area: Area): void{
        this.removeAll(i => i.isContainedBy(area));
    }
    public isContainedBy(area: Area): boolean {
        return !this.contains(i => !i.isContainedBy(area));
    }
    public static create(rectangle: CanvasRectangle): PreviousInstructions{
        return new PreviousInstructions(StateAndInstruction.create(defaultState, InfiniteCanvasStateInstance.setDefault, rectangle), rectangle);
    }
}
