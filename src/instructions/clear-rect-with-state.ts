import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { Rectangle } from "../rectangle";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "../interfaces/state-changing-instruction-set-with-current-state-and-area";

export class ClearRectWithState extends InfiniteCanvasStateAndInstruction implements StateChangingInstructionSetWithCurrentStateAndArea{
    constructor(initialState: InfiniteCanvasState, public area: Rectangle){
        super(initialState, area.getInstructionToClear().instruction);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return false;
    }
    public intersects(area: Rectangle): boolean{
        return this.area.intersects(area);
    }
}