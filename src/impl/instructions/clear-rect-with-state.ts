import { ExecutableInstructionWithState } from "./executable-instruction-with-state";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction, noopInstruction } from "./instruction";
import { Area } from "../areas/area";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { DrawingArea } from "../areas/drawing-area";
import { NegativeDrawingArea } from "../areas/negative-drawing-area";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

class ClearRectInstruction implements Instruction {
    constructor(
        private readonly infinity: ViewboxInfinity,
        private readonly x: number,
        private readonly y: number,
        private readonly width: number,
        private readonly height: number,
    ){}
    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        this.infinity.clearRect(context, rectangle, this.x, this.y, this.width, this.height);
    }
}
export class ClearRectWithState extends ExecutableInstructionWithState implements StateChangingInstructionSetWithArea{
    public drawingArea: DrawingArea;
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, stateConversion: Instruction, area: Area){
        super(initialState, state, instruction, stateConversion);
        this.drawingArea = new NegativeDrawingArea(area)
    }
    public static createClearRect(initialState: InfiniteCanvasState, area: Area, infinity: ViewboxInfinity, x: number, y: number, width: number, height: number): ClearRectWithState{
        return new ClearRectWithState(initialState, initialState, new ClearRectInstruction(infinity, x, y, width, height), noopInstruction, area);
    }
}