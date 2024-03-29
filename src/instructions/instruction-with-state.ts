import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { Instruction } from "./instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InstructionsToClip } from "../interfaces/instructions-to-clip";

export class InstructionWithState implements StateChangingInstructionSet{
    protected stateConversion: Instruction;
    constructor(public initialState: InfiniteCanvasState, public state: InfiniteCanvasState){
        this.stateConversion = () => {};
    }
    public setInitialState(previousState: InfiniteCanvasState): void{
        this.initialState = previousState;
        const instructionToConvert: Instruction = this.initialState.getInstructionToConvertToState(this.state);
        this.stateConversion = instructionToConvert;
    }
    public get stateOfFirstInstruction(): InfiniteCanvasState{
        return this.state;
    }
    public addClippedPath(clippedPath: InstructionsToClip): void{
        this.state = this.state.withClippedPath(clippedPath);
    }
    public setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void{
        this.initialState = previousState;
        const instructionToConvert: Instruction = this.initialState.getInstructionToConvertToStateWithClippedPath(this.state);
        this.stateConversion = instructionToConvert;
    }
}