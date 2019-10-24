import { Rectangle } from "../rectangle";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { PathInstruction } from "../interfaces/path-instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { Transformation } from "../transformation";
import { PathInstructions } from "./path-instructions";

export class InstructionsWithPath extends StateChangingInstructionSequence<InfiniteCanvasStateAndInstruction> implements StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState{
    public area: Rectangle;
    public visible: boolean;
    constructor(initialState: InfiniteCanvasState){
        super(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();})
    }

    public drawPath(instruction: Instruction): void{
        this.add(new InfiniteCanvasStateAndInstruction(this.state, instruction));
        this.visible = true;
    }
    public addPathInstruction(pathInstruction: PathInstruction): void{
        this.area = pathInstruction.changeArea.execute(this.state.current.transformation, this.area);
        this.add(new InfiniteCanvasStateAndInstruction(this.state, pathInstruction.instruction));
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(!this.visible){
            return;
        }
        super.execute(context, transformation);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        if(!this.area || !this.visible){
            return false;
        }
        if(area.contains(this.area)){
            return false;
        }
        return area.intersects(this.area);
    }
    public intersects(area: Rectangle): boolean{
        if(!this.area || !this.visible){
            return false;
        }
        return this.area.intersects(area);
    }
    public clearContentsInsideArea(area: Rectangle): void{
        if(!this.area || !this.visible){
            return;
        }
        if(area.contains(this.area)){
            this.visible = false;
        }
    }
    public addClearRect(area: Rectangle): void{
        this.addPathInstruction(area.getInstructionToClear());
    }
    public static create(initialState: InfiniteCanvasState, pathInstructions?: PathInstruction[]): InstructionsWithPath{
        const result: InstructionsWithPath = new InstructionsWithPath(initialState);
        if(!pathInstructions){
            return result;
        }
        for(const pathInstruction of pathInstructions){
            result.addPathInstruction(pathInstruction);
        }
        return result;
    }
}