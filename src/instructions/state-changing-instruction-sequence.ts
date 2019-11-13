import { StateChangingInstructionSetWithCurrentState } from "../interfaces/state-changing-instruction-set-with-current-state";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChange } from "../state/state-change";
import { Transformation } from "../transformation";
import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { InstructionSequence } from "../interfaces/instruction-sequence";
import { InstructionAndState } from "../interfaces/instruction-and-state";
import {StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState} from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import {InfiniteCanvasStateInstance} from "../state/infinite-canvas-state-instance";

export class StateChangingInstructionSequence<TInstructionSet extends StateChangingInstructionSetWithCurrentState> implements StateChangingInstructionSetWithCurrentState, InstructionSequence<TInstructionSet>{
    protected added: TInstructionSet[] = [];
    private addedLast: TInstructionSet;
    public get state(): InfiniteCanvasState{return this.currentlyWithState.state;}
    public get initialState(): InfiniteCanvasState{return this.initiallyWithState.initialState;}
    public get length(): number{return this.added.length;}
    private get currentlyWithState(): StateChangingInstructionSetWithCurrentState{
        if(this.addedLast){
            return this.addedLast;
        }
        return this.initiallyWithState;
    }
    protected constructor(protected readonly initiallyWithState: InfiniteCanvasStateAndInstruction){
    }
    protected reconstructState(instructionSetToChange: StateChangingInstructionSetWithCurrentState, stateToChangeTo: InfiniteCanvasState): void{
        instructionSetToChange.changeToState(stateToChangeTo);
    }
    public getAllInstructionsAndStates(): InstructionAndState[]{
        let result: InstructionAndState[] = this.initiallyWithState.getAllInstructionsAndStates();
        for(const added of this.added){
            result = result.concat(added.getAllInstructionsAndStates());
        }
        return result;
    }
    public addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState): void{
        this.currentlyWithState.addClippedPath(clippedPath);
    }
    public add(instructionSet: TInstructionSet): void{
        this.added.push(instructionSet);
        this.addedLast = instructionSet;
    }
    public removeAll(predicate: (instructionSet: TInstructionSet) => boolean): void{
        let indexToRemove: number;
        while((indexToRemove = this.added.findIndex(predicate)) > -1){
            this.removeAtIndex(indexToRemove);
        }
    }
    public contains(predicate: (instructionSet: TInstructionSet) => boolean): boolean{
        return !!this.added.find(predicate);
    }
    public changeState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void{
        this.currentlyWithState.changeState(change);
    }
    public saveState(): void{
        this.currentlyWithState.saveState();
    }
    public restoreState(): void{
        this.currentlyWithState.restoreState();
    }
    public changeToState(state: InfiniteCanvasState): void{
        this.currentlyWithState.changeToState(state);
    }
    public changeToStateWithClippedPaths(state: InfiniteCanvasState): void {
        this.currentlyWithState.changeToStateWithClippedPaths(state);
    }
    public setInitialState(newInitialState: InfiniteCanvasState): void {
        this.initiallyWithState.setInitialState(newInitialState);
    }

    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        this.initiallyWithState.execute(context, transformation);
        for(const added of this.added){
            added.execute(context, transformation);
        }
    }
    private beforeIndex(index: number): StateChangingInstructionSetWithCurrentState{
        if(index === 0){
            return this.initiallyWithState;
        }
        return this.added[index - 1];
    }
    private stateAfterIndex(index: number): InfiniteCanvasState{
        return this.added[index].state;
    }
    private removeAtIndex(index: number){
        if(index === this.added.length - 1){
            if(this.added.length === 1){
                this.addedLast = undefined;
            }else{
                this.addedLast = this.added[index - 1];
            }
        }
        this.reconstructState(this.beforeIndex(index), this.stateAfterIndex(index));
        this.added.splice(index, 1);
    }
}