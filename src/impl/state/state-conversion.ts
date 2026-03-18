import {InfiniteCanvasState} from "./infinite-canvas-state";
import { Instruction, MinimalInstruction } from '../instructions/instruction'
import {InfiniteCanvasStateInstance} from "./infinite-canvas-state-instance";
import { sequence } from "../instruction-utils";

class Save implements MinimalInstruction {
    execute(context: CanvasRenderingContext2D): void {
        context.save();
    }
}

class Restore implements MinimalInstruction {
    execute(context: CanvasRenderingContext2D): void {
        context.restore();
    }
}

const save = new Save();
const restore = new Restore();

export class StateConversion {
    private instructions: Instruction[] = [];
    constructor(protected currentState: InfiniteCanvasState) {

    }
    public restore(): void{
        this.addChangeToState(this.currentState.restored(), restore);
    }
    public save(): void{
        this.addChangeToState(this.currentState.saved(), save);
    }
    public changeCurrentInstanceTo(instance: InfiniteCanvasStateInstance): void{
        if(this.currentState.current.equals(instance)){
            return;
        }
        const instructionToChangeCurrentInstance: Instruction = this.currentState.current.getInstructionToConvertToState(instance);
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
        return sequence(...this.instructions)
    }
}