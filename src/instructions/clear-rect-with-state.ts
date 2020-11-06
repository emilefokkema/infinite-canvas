import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { Transformation } from "../transformation";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class ClearRectWithState extends StateAndInstruction implements StateChangingInstructionSetWithArea{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, stateConversion: Instruction, public area: Area, rectangle: CanvasRectangle){
        super(initialState, state, instruction, stateConversion, rectangle);
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
    public static createClearRect(initialState: InfiniteCanvasState, area: Area, infinity: ViewboxInfinity, x: number, y: number, width: number, height: number, rectangle: CanvasRectangle): ClearRectWithState{
        return new ClearRectWithState(initialState, initialState, (context: CanvasRenderingContext2D, transformation: Transformation) => {
            infinity.clearRect(context, transformation, x, y, width, height);
        }, () => {}, area, rectangle);
    }
}