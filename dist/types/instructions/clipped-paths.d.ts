import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { Area } from "../areas/area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
export declare class ClippedPaths {
    area: Area;
    latestClippedPath: StateChangingInstructionSet;
    readonly previouslyClippedPaths?: ClippedPaths;
    constructor(area: Area, latestClippedPath: StateChangingInstructionSet, previouslyClippedPaths?: ClippedPaths);
    withClippedPath(latestClippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): ClippedPaths;
    get initialState(): InfiniteCanvasState;
    except(other: ClippedPaths): ClippedPaths;
    contains(other: ClippedPaths): boolean;
    getInstructionToRecreate(rectangle: CanvasRectangle): Instruction;
}
