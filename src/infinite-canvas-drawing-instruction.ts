import { Transformation } from "./transformation";
import { Rectangle } from "./rectangle";
import { DrawingInstruction } from "./drawing-instruction";
import { Instruction } from "./instruction";
import { ImmutablePathInstructionSet } from "./immutable-path-instruction-set";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";

export class InfiniteCanvasDrawingInstruction implements DrawingInstruction{
    public area?: Rectangle;
    private leadingInstructions: Instruction[];
    constructor(
        public state: InfiniteCanvasState,
        public pathInstructions: ImmutablePathInstructionSet,
        private instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void){
            this.area = pathInstructions.area;
            this.leadingInstructions = [];
    }
    public useLeadingInstructionsFrom(previousInstruction: DrawingInstruction): void{
        this.leadingInstructions = this.state.getInstructionsComparedTo(previousInstruction.state).concat(this.pathInstructions.getInstructionsComparedTo(previousInstruction.pathInstructions));
    }
    public useAllLeadingInstructions(): void{
        this.leadingInstructions = this.state.getAllInstructions().concat(this.pathInstructions.getAllInstructions());
    }
    public apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
        for(const leadingInstruction of this.leadingInstructions){
            leadingInstruction.apply(context, transformation);
        }
        this.instruction(context, transformation);
    }
}