import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { defaultState } from "../state/default-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { StateAndInstruction } from "./state-and-instruction";
import { ClearRectWithState } from "./clear-rect-with-state";
import { Area } from "../areas/area";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
import { InfiniteCanvasPathInfinityProvider } from "../infinite-canvas-path-infinity-provider";

export class PreviousInstructions extends StateChangingInstructionSequence<StateChangingInstructionSetWithArea> {
    constructor(initiallyWithState: StateAndInstruction, private readonly rectangle: CanvasRectangle){
        super(initiallyWithState);
    }
    protected reconstructState(fromState: InfiniteCanvasState, toInstructionSet: StateChangingInstructionSetWithArea): void{
        toInstructionSet.setInitialStateWithClippedPaths(fromState);
    }
    public hasDrawingAcrossBorderOf(area: Area): boolean{
        return this.contains(i => i.drawingArea.hasDrawingAcrossBorderOf(area));
    }
    public intersects(area: Area): boolean{
        return this.contains(i => i.drawingArea.intersects(area));
    }
    public addClearRect(area: Area, state: InfiniteCanvasState, x: number, y: number, width: number, height: number): void{
        const infinityProvider = new InfiniteCanvasPathInfinityProvider(this.rectangle, {lineWidth: 0, lineDashPeriod: 0})
        const infinity: ViewboxInfinity = infinityProvider.getInfinity(state);
        const clearRect: ClearRectWithState = ClearRectWithState.createClearRect(state, area, infinity, x, y, width, height, this.rectangle);
        clearRect.setInitialState(this.state);
        this.add(clearRect);
    }
    public clearContentsInsideArea(area: Area): void{
        this.removeAll(i => i.drawingArea.isContainedBy(area));
    }
    public static create(rectangle: CanvasRectangle): PreviousInstructions{
        return new PreviousInstructions(StateAndInstruction.create(defaultState, InfiniteCanvasStateInstance.setDefault, rectangle), rectangle);
    }
}
