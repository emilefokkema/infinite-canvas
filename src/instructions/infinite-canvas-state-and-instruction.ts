import { Instruction } from "./instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { StateChange } from "../state/state-change";
import { Transformation } from "../transformation";
import { StateChangingInstructionSetWithCurrentState } from "../interfaces/state-changing-instruction-set-with-current-state";

export class InfiniteCanvasStateAndInstruction implements StateChangingInstructionSetWithCurrentState{
    private stateChangeInstruction: Instruction;
    public state: InfiniteCanvasState;
    constructor(public initialState: InfiniteCanvasState, private readonly initialInstruction?: Instruction){
        this.state = initialState;
    }
    private change(change: (state: InfiniteCanvasState) => StateChange<InfiniteCanvasState>): void{
        this.state = change(this.state).newState;
        const newChange: StateChange<InfiniteCanvasState> = this.initialState.convertTo(this.state);
        this.stateChangeInstruction = newChange.instruction;
    }
    public changeState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void{
        this.change(s => s.withChangedState(change));
    }
    public saveState(): void{
        this.change(s => s.save());
    }
    public restoreState(): void{
        this.change(s => s.restore());
    }
    public changeToState(state: InfiniteCanvasState): void{
        this.change(s => s.convertTo(state));
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(this.initialInstruction){
            this.initialInstruction(context, transformation);
        }
        if(this.stateChangeInstruction){
            this.stateChangeInstruction(context, transformation);
        }
    }
}