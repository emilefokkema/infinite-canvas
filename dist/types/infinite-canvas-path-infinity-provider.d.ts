import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { InfiniteCanvasViewboxInfinityProvider } from "./infinite-canvas-viewbox-infinity-provider";
import { Instruction } from "./instructions/instruction";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
export declare class InfiniteCanvasPathInfinityProvider implements PathInfinityProvider {
    private readonly viewboxInfinityProvider;
    constructor(viewboxInfinityProvider: InfiniteCanvasViewboxInfinityProvider);
    private drawnLineWidth;
    private lineDashPeriod;
    getPathInstructionToGoAroundViewbox(): Instruction;
    addDrawnLineWidth(lineWidth: number): void;
    addLineDashPeriod(lineDashPeriod: number): void;
    getInfinity(state: InfiniteCanvasState): ViewboxInfinity;
}
