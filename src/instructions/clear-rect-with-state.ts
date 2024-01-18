import { ExecutableInstructionWithState } from "./executable-instruction-with-state";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { DrawingArea } from "../areas/drawing-area";
import { NegativeDrawingArea } from "../areas/negative-drawing-area";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class ClearRectWithState extends ExecutableInstructionWithState implements StateChangingInstructionSetWithArea{
    public drawingArea: DrawingArea;
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, stateConversion: Instruction, area: Area){
        super(initialState, state, instruction, stateConversion);
        this.drawingArea = new NegativeDrawingArea(area)
    }
    public static createClearRect(initialState: InfiniteCanvasState, area: Area, infinity: ViewboxInfinity, x: number, y: number, width: number, height: number): ClearRectWithState{
        return new ClearRectWithState(initialState, initialState, (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
            infinity.clearRect(context, rectangle, x, y, width, height);
        }, () => {}, area);
    }
}