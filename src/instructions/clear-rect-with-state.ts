import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";

export class ClearRectWithState extends StateAndInstruction implements StateChangingInstructionSetWithArea{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, stateConversion: Instruction, public area: Area){
        super(initialState, state, instruction, stateConversion);
    }
    public hasDrawingAcrossBorderOf(area: Area): boolean{
        return false;
    }
    public intersects(area: Area): boolean{
        return this.area.intersects(area);
    }
    public isContainedBy(area: Area): boolean {
        return area.contains(this.area);
    }
    public static createClearRect(initialState: InfiniteCanvasState, area: Area, infinity: ViewboxInfinity, x: number, y: number, width: number, height: number): ClearRectWithState{
        return new ClearRectWithState(initialState, initialState, (context: CanvasRenderingContext2D) => {
            infinity.clearRect(context, x, y, width, height);
        }, () => {}, area);
    }
}