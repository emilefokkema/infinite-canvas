import { Area } from "../areas/area";
import { InstructionsToClip } from "../interfaces/instructions-to-clip";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class InstructionsToClipImpl implements InstructionsToClip{
    public get state(): InfiniteCanvasState{return this.instructions.state;}
    public get initialState(): InfiniteCanvasState{return this.instructions.initialState;}
    constructor(
        private readonly instructions: ExecutableStateChangingInstructionSet,
        public readonly area: Area){}
    public execute(ctx: CanvasRenderingContext2D, rectangle: CanvasRectangle){
        this.instructions.execute(ctx, rectangle)
    }
}