import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { Rectangle } from "../rectangle";
import { PathInstruction } from "./path-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { WithStateAndArea } from "../with-state-and-area";

export class InstructionsWithStateAndArea extends InfiniteCanvasStateAndInstruction implements WithStateAndArea{
    public area: Rectangle;
    constructor(initialState: InfiniteCanvasState, pathInstruction: PathInstruction){
        super(initialState, pathInstruction.instruction);
        this.area = pathInstruction.changeArea.execute(initialState.current.transformation, undefined);
    }
}