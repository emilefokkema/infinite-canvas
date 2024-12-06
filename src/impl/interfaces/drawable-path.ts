import { Area } from "../areas/area";
import { Instruction } from "../instructions/instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { DrawnPathProperties } from './drawn-path-properties'
import { ExecutableStateChangingInstructionSet } from "./executable-state-changing-instruction-set";

export interface DrawablePath{
    area: Area
    drawPath(instruction: Instruction, state: InfiniteCanvasState, drawnPathProperties: DrawnPathProperties): ExecutableStateChangingInstructionSet
}