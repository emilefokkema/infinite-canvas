import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { Transformation } from "../transformation";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
import { DrawingArea } from "../areas/drawing-area";
import { NegativeDrawingArea } from "../areas/negative-drawing-area";

export class ClearRectWithState extends StateAndInstruction implements StateChangingInstructionSetWithArea{
    public drawingArea: DrawingArea;
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, stateConversion: Instruction, private readonly area: Area, rectangle: CanvasRectangle){
        super(initialState, state, instruction, stateConversion, rectangle);
        this.drawingArea = new NegativeDrawingArea(area)
    }
    public static createClearRect(initialState: InfiniteCanvasState, area: Area, infinity: ViewboxInfinity, x: number, y: number, width: number, height: number, rectangle: CanvasRectangle): ClearRectWithState{
        return new ClearRectWithState(initialState, initialState, (context: CanvasRenderingContext2D, transformation: Transformation) => {
            infinity.clearRect(context, transformation, x, y, width, height);
        }, () => {}, area, rectangle);
    }
}