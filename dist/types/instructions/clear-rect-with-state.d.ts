import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
export declare class ClearRectWithState extends StateAndInstruction implements StateChangingInstructionSetWithArea {
    area: Area;
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, stateConversion: Instruction, area: Area);
    hasDrawingAcrossBorderOf(area: Area): boolean;
    intersects(area: Area): boolean;
    isContainedBy(area: Area): boolean;
    static createClearRect(initialState: InfiniteCanvasState, area: Area, infinity: ViewboxInfinity, x: number, y: number, width: number, height: number): ClearRectWithState;
}
