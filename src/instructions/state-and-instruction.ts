import { StateChangingInstructionSetWithCurrentState } from "../interfaces/state-changing-instruction-set-with-current-state";
import { Instruction } from "./instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChange } from "../state/state-change";
import { Transformation } from "../transformation";
import { InstructionAndState } from "../interfaces/instruction-and-state";
import {StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState} from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import {InfiniteCanvasStateInstance} from "../state/infinite-canvas-state-instance";

export abstract class StateAndInstruction implements StateChangingInstructionSetWithCurrentState{
    protected constructor(
        private _initialState: InfiniteCanvasState,
        protected readonly initialInstruction: Instruction,
        protected stateChangeInstruction: Instruction,
        public state: InfiniteCanvasState,
        protected initialStateChangeInstruction: Instruction,
        protected readonly stateForInstruction: InfiniteCanvasState){
    }
    private change(change: (state: InfiniteCanvasState) => StateChange<InfiniteCanvasState>): void{
        this.changeToState(change(this.state).newState)
    }
    public get initialState(): InfiniteCanvasState{return this._initialState;}
    public addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState): void{
        this.state = this.state.withClippedPath(clippedPath);
    }
    public changeState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void{
        this.change(s => s.withChangedState(change));
    }
    public destroy(): void {
    }
    public getAllInstructionsAndStates(): InstructionAndState[]{
        return [{instruction: this.initialInstruction, state: this.stateForInstruction}];
    }
    public saveState(): void{
        this.change(s => s.save());
    }
    public restoreState(): void{
        this.change(s => s.restore());
    }
    public changeToState(state: InfiniteCanvasState): void{
        this.state = state;
        this.stateChangeInstruction = this.stateForInstruction.convertToState(this.state).instruction;
    }
    public changeToStateWithClippedPaths(state: InfiniteCanvasState): void {
        this.state = state;
        this.stateChangeInstruction = this.stateForInstruction.convertToStateWithClippedPath(this.state).instruction;
    }
    public setInitialState(newInitialState: InfiniteCanvasState): void{
        this.initialStateChangeInstruction = newInitialState.convertToState(this.stateForInstruction).instruction;
        this._initialState = newInitialState;
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(this.initialStateChangeInstruction){
            this.initialStateChangeInstruction(context, transformation);
        }
        if(this.initialInstruction){
            this.initialInstruction(context, transformation);
        }
        if(this.stateChangeInstruction){
            this.stateChangeInstruction(context, transformation);
        }
    }
}