import {InfiniteCanvasState} from "./infinite-canvas-state";
import {Instruction} from "../instructions/instruction";
import {Transformation} from "../transformation";
import {InfiniteCanvasStateInstance} from "./infinite-canvas-state-instance";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class StateConversion {
    private instructions: Instruction[] = [];
    constructor(protected currentState: InfiniteCanvasState) {

    }
    public restore(): void{
        this.addChangeToState(this.currentState.restored(), (context: CanvasRenderingContext2D) => {context.restore();});
    }
    public save(): void{
        this.addChangeToState(this.currentState.saved(), (context: CanvasRenderingContext2D) => {context.save();});
    }
    public changeCurrentInstanceTo(instance: InfiniteCanvasStateInstance, rectangle: CanvasRectangle): void{
        if(this.currentState.current.equals(instance)){
            return;
        }
        const instructionToChangeCurrentInstance: Instruction = this.currentState.current.getInstructionToConvertToState(instance, rectangle);
        const stateWithNewCurrentInstance: InfiniteCanvasState = this.currentState.withCurrentState(instance);
        this.addChangeToState(stateWithNewCurrentInstance, instructionToChangeCurrentInstance);
    }
    protected addChangeToState(newState: InfiniteCanvasState, instruction: Instruction): void{
        this.currentState = newState;
        if(instruction){
            this.instructions.push(instruction);
        }
    }
    public get instruction(): Instruction{
        if(this.instructions.length === 0){
            return undefined;
        }
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            for(const instruction of this.instructions){
                instruction(context, transformation);
            }
        };
    }
}