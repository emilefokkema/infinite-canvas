import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InstructionsToClip } from "../interfaces/instructions-to-clip";

export class StateChangingInstructionSequence<TInstructionSet extends StateChangingInstructionSet> implements StateChangingInstructionSet{
    protected added: TInstructionSet[] = [];
    private addedLast: TInstructionSet;
    constructor(protected initiallyWithState: StateChangingInstructionSet){}
    public get length(): number{return this.added.length;}
    protected get currentlyWithState(): StateChangingInstructionSet{
        if(this.addedLast){
            return this.addedLast;
        }
        return this.initiallyWithState;
    }
    protected reconstructState(fromState: InfiniteCanvasState, toInstructionSet: TInstructionSet): void{
        toInstructionSet.setInitialState(fromState);
    }
    public get stateOfFirstInstruction(): InfiniteCanvasState{
        return this.initiallyWithState.stateOfFirstInstruction;
    }
    public get state(): InfiniteCanvasState{return this.currentlyWithState.state;}
    public get initialState(): InfiniteCanvasState{return this.initiallyWithState.initialState;}
    public addClippedPath(clippedPath: InstructionsToClip): void{
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
    public setInitialState(previousState: InfiniteCanvasState): void{
        this.initiallyWithState.setInitialState(previousState);
    }
    public setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void{
        this.initiallyWithState.setInitialStateWithClippedPaths(previousState);
    }
    private beforeIndex(index: number): InfiniteCanvasState{
        if(index === 0){
            return this.initiallyWithState.state;
        }
        return this.added[index - 1].state;
    }
    private removeAtIndex(index: number){
        if(index === this.added.length - 1){
            if(this.added.length === 1){
                this.addedLast = undefined;
            }else{
                this.addedLast = this.added[index - 1];
            }
        }else{
            this.reconstructState(this.beforeIndex(index), this.added[index + 1]);
        }
        this.added.splice(index, 1);
    }
}
