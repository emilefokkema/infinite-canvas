import { Rectangle } from "../rectangle";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { PathInstruction } from "../interfaces/path-instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";

export class InstructionsWithPath extends StateChangingInstructionSequence<InfiniteCanvasStateAndInstruction> implements StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState{
    public area: Rectangle;

    constructor(initialState: InfiniteCanvasState){
        super(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();})
    }

    public drawPath(instruction: Instruction): void{
        this.add(new InfiniteCanvasStateAndInstruction(this.state, instruction));
    }
    public addPathInstruction(pathInstruction: PathInstruction): void{
        this.area = pathInstruction.changeArea.execute(this.state.current.transformation, this.area);
        this.add(new InfiniteCanvasStateAndInstruction(this.state, pathInstruction.instruction));
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