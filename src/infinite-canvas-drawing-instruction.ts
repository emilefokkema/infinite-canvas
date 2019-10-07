import { Transformation } from "./transformation";
import { Rectangle } from "./rectangle";
import { DrawingInstruction } from "./drawing-instruction";
import { Instruction } from "./instruction";
import { ImmutablePathInstructionSet } from "./immutable-path-instruction-set";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { SimpleInstruction } from "./simple-instruction";

export class InfiniteCanvasDrawingInstruction implements DrawingInstruction{
    
    private leadingInstructions: Instruction[];
    private instruction: SimpleInstruction;
    constructor(
        public state: InfiniteCanvasState,
        public pathInstructions: ImmutablePathInstructionSet,
        public area: Rectangle,
        instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void){
            this.leadingInstructions = [];
            this.instruction = new SimpleInstruction(instruction)
                .after(new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                    for(const leadingInstruction of this.leadingInstructions){
                        leadingInstruction.apply(context, transformation);
                    }
                }));
            if(!state.transformation.equals(Transformation.identity)){
                this.instruction = this.instruction
                    .after(new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                        const newTransformation: Transformation = transformation.inverse().before(state.transformation).before(transformation);
                        context.setTransform(
                            newTransformation.a,
                            newTransformation.b,
                            newTransformation.c,
                            newTransformation.d,
                            newTransformation.e,
                            newTransformation.f
                        );
                    }))
                    .before(new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                        context.setTransform(1, 0, 0, 1, 0, 0);
                    }));
            }
    }
    public useLeadingInstructionsFrom(previousInstruction: DrawingInstruction): void{
        let result: Instruction[] = this.state.getInstructionsComparedTo(previousInstruction.state);
        if(this.pathInstructions){
            result = result.concat(this.pathInstructions.getInstructionsComparedTo(previousInstruction.pathInstructions));
        }
        this.leadingInstructions = result;
    }
    public useAllLeadingInstructions(): void{
        let result: Instruction[] = this.state.getAllInstructions();
        if(this.pathInstructions){
            result = result.concat(this.pathInstructions.getAllInstructions());
        }
        this.leadingInstructions = result;
    }
    public apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
        this.instruction.apply(context, transformation);
    }
}