import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Transformation } from "../transformation";
import { InstructionAndState } from "../interfaces/instruction-and-state";
import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { prependToInstruction } from "../instruction-utils";

export class StateAndInstruction implements StateChangingInstructionSet{
    constructor(public initialState: InfiniteCanvasState, public state: InfiniteCanvasState, public readonly instruction: Instruction, protected combinedInstruction: Instruction){
    }
    public setInitialState(previousState: InfiniteCanvasState): void{
        this.initialState = previousState;
        const instructionToConvert: Instruction = this.initialState.getInstructionToConvertToState(this.state);
        this.combinedInstruction = prependToInstruction(instructionToConvert, this.instruction);
    }
    public addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): void{
        this.state = this.state.withClippedPath(clippedPath);
    }
    public setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void{
        this.initialState = previousState;
        const instructionToConvert: Instruction = this.initialState.getInstructionToConvertToStateWithClippedPath(this.state);
        this.combinedInstruction = prependToInstruction(instructionToConvert, this.instruction);
    }
    public getAllInstructionsAndStates(): InstructionAndState[]{
        return [{instruction: this.instruction, state: this.state}];
    }
    public copy(): StateAndInstruction{
        return new StateAndInstruction(this.initialState, this.state, this.instruction, this.combinedInstruction);
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation): void{
        this.combinedInstruction(context, transformation);
    }
    public static create(state: InfiniteCanvasState, instruction: Instruction): StateAndInstruction{
        return new StateAndInstruction(state, state, instruction, instruction);
    }
}