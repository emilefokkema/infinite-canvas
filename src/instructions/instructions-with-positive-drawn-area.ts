import { PositiveDrawingArea } from "../areas/positive-drawing-area";
import { Area } from "../areas/area";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { PositiveDrawingAreaImpl } from "../areas/positive-drawing-area-impl";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InstructionsToClip } from "../interfaces/instructions-to-clip";
import { Transformation } from "../transformation";
import { StateChangingInstructionSetWithPositiveArea } from "../interfaces/state-changing-instruction-set-with-positive-area";

export class InstructionsWithPositiveDrawnArea implements StateChangingInstructionSetWithPositiveArea{
    public drawingArea: PositiveDrawingArea
    public get state(): InfiniteCanvasState{return this.instructions.state;}
    public get initialState(): InfiniteCanvasState{return this.instructions.initialState;}
    public get stateOfFirstInstruction(): InfiniteCanvasState{return this.instructions.stateOfFirstInstruction;}
    constructor(
        private readonly instructions: ExecutableStateChangingInstructionSet,
        area: Area){
            this.drawingArea = new PositiveDrawingAreaImpl(area)
    }
    public setInitialState(previousState: InfiniteCanvasState): void {
        this.instructions.setInitialState(previousState)
    }
    public setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void {
        this.instructions.setInitialStateWithClippedPaths(previousState)
    }
    public addClippedPath(clippedPath: InstructionsToClip): void {
        this.instructions.addClippedPath(clippedPath)
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation): void{
        this.instructions.execute(context, transformation);
    }
}