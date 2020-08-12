import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { ViewboxInfinity } from "./viewbox-infinity";
import { Instruction } from "../instructions/instruction";
export interface PathInfinityProvider {
    getInfinity(state: InfiniteCanvasState): ViewboxInfinity;
    getPathInstructionToGoAroundViewbox(): Instruction;
    addDrawnLineWidth(lineWidth: number): void;
    addLineDashPeriod(lineDashPeriod: number): void;
}
