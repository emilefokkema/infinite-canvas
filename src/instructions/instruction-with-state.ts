import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { Instruction } from "./instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { Transformation } from "../transformation";

export abstract class InstructionWithState implements StateChangingInstructionSet{
    protected stateConversion: Instruction;
    constructor(public initialState: InfiniteCanvasState, public state: InfiniteCanvasState){
        this.stateConversion = () => {};
    }
    protected abstract executeInstruction(context: CanvasRenderingContext2D, transformation: Transformation): void;
    public setInitialState(previousState: InfiniteCanvasState): void{
        this.initialState = previousState;
        const instructionToConvert: Instruction = this.initialState.getInstructionToConvertToState(this.state);
        this.stateConversion = instructionToConvert;
    }
    public get stateOfFirstInstruction(): InfiniteCanvasState{
        return this.state;
    }
    public addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): void{
        this.state = this.state.withClippedPath(clippedPath);
    }
    public setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void{
        this.initialState = previousState;
        const instructionToConvert: Instruction = this.initialState.getInstructionToConvertToStateWithClippedPath(this.state);
        this.stateConversion = instructionToConvert;
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation): void{
        if(this.stateConversion){
            this.stateConversion(context, transformation);
        }
        this.executeInstruction(context, transformation);
    }
}