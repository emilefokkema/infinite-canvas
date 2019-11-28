import { Rectangle } from "../rectangle";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { PathInstruction } from "../interfaces/path-instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { Transformation } from "../transformation";
import {InfiniteCanvasStateAndInstruction} from "./infinite-canvas-state-and-instruction";
import {PathInstructionWithState} from "./path-instruction-with-state";
import {DrawingPathInstructionWithState} from "./drawing-path-instruction-with-state";
import {ClippingPathInstructionWithState} from "./clipping-path-instruction-with-state";

export class InstructionsWithPath extends StateChangingInstructionSequence<PathInstructionWithState> implements StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState{
    private area: Rectangle;
    private drawnArea: Rectangle;
    public visible: boolean;
    constructor(initiallyWithState: InfiniteCanvasStateAndInstruction){
        super(initiallyWithState);
    }
    private getCurrentlyDrawableArea(): Rectangle{
        if(!this.area){
            return undefined;
        }
        if(!this.state.current.clippingRegion){
            return this.area;
        }
        return this.state.current.clippingRegion.intersectWith(this.area);
    }
    private copy(): InstructionsWithPath{
        const result: InstructionsWithPath = new InstructionsWithPath(this.initiallyWithState.copy());
        for(const added of this.added){
            result.add(added.copy());
        }
        return result;
    }
    public drawPath(instruction: Instruction, onDestroy?: () => void): void{
        const newlyDrawnArea: Rectangle = this.getCurrentlyDrawableArea();
        this.drawnArea = this.drawnArea ? this.drawnArea.expandToInclude(newlyDrawnArea) : newlyDrawnArea;
        this.add(DrawingPathInstructionWithState.createDrawing(this.state, instruction, this.drawnArea, onDestroy));
        this.visible = true;
    }
    public clipPath(instruction: Instruction): void{
        this.add(ClippingPathInstructionWithState.create(this.state, instruction));
        const clippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = this.recreateClippedPath();
        this.addClippedPath(clippedPath);
    }
    public addPathInstruction(pathInstruction: PathInstruction): void{
        this.area = pathInstruction.changeArea.execute(this.state.current.transformation, this.area);
        this.add(PathInstructionWithState.create(this.state, pathInstruction.instruction));
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(!this.visible){
            return;
        }
        super.execute(context, transformation);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        if(!this.drawnArea || !this.visible){
            return false;
        }
        if(area.contains(this.drawnArea)){
            return false;
        }
        return area.intersects(this.drawnArea);
    }
    public isContainedBy(area: Rectangle): boolean {
        const areaToContain: Rectangle = this.drawnArea || this.area;
        return area.contains(areaToContain);
    }
    public intersects(area: Rectangle): boolean{
        if(!this.area || !this.visible){
            return false;
        }
        return this.area.intersects(area);
    }
    public getClippedArea(previouslyClipped?: Rectangle): Rectangle {
        return previouslyClipped ? this.area.intersectWith(previouslyClipped): this.area;
    }

    public clearContentsInsideArea(area: Rectangle): void{
        if(!this.drawnArea || !this.visible){
            return;
        }
        this.removeAll(i => i instanceof DrawingPathInstructionWithState && area.contains(i.drawnArea), instructionSet => instructionSet.destroy());
        if(area.contains(this.drawnArea)){
            this.visible = false;
        }
    }
    public addClearRect(area: Rectangle): void{
        this.addPathInstruction(area.getInstructionToClear());
    }
    public recreatePath(): StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState{
        const result: InstructionsWithPath = this.copy();
        result.removeAll(i => (i instanceof DrawingPathInstructionWithState) || (i instanceof ClippingPathInstructionWithState));
        result.area = this.area;
        return result;
    }
    public recreateClippedPath(): StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState{
        const result: InstructionsWithPath = this.copy();
        result.removeAll(i => i instanceof DrawingPathInstructionWithState);
        result.area = this.area;
        return result;
    }
    public static create(initialState: InfiniteCanvasState, pathInstructions?: PathInstruction[]): InstructionsWithPath{
        const result: InstructionsWithPath = new InstructionsWithPath(
            InfiniteCanvasStateAndInstruction.create(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();}));
        if(!pathInstructions){
            return result;
        }
        for(const pathInstruction of pathInstructions){
            result.addPathInstruction(pathInstruction);
        }
        return result;
    }
}
