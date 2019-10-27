import { StateChangingInstructionSetWithCurrentState } from "../interfaces/state-changing-instruction-set-with-current-state";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { StateChange } from "../state/state-change";
import { Transformation } from "../transformation";
import { Instruction } from "./instruction";
import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";

export class StateChangingInstructionSequence<TInstructionSet extends StateChangingInstructionSetWithCurrentState> implements StateChangingInstructionSetWithCurrentState{
    private initiallyWithState: StateChangingInstructionSetWithCurrentState;
    protected added: TInstructionSet[] = [];
    private addedLast: TInstructionSet;
    public get state(): InfiniteCanvasState{return this.currentlyWithState.state;}
    public get length(): number{return this.added.length;}
    private get currentlyWithState(): StateChangingInstructionSetWithCurrentState{
        if(this.addedLast){
            return this.addedLast;
        }
        return this.initiallyWithState;
    }
    constructor(public initialState: InfiniteCanvasState, initialInstruction: Instruction){
        this.initiallyWithState = new InfiniteCanvasStateAndInstruction(initialState, initialInstruction);
    }
    public add(instructionSet: TInstructionSet): void{
        this.changeToState(instructionSet.initialState);
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
        this.beforeIndex(index).changeToState(this.stateAfterIndex(index));
        this.added.splice(index, 1);
    }
}