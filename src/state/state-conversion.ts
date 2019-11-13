import {InfiniteCanvasState} from "./infinite-canvas-state";
import {Instruction} from "../instructions/instruction";
import {StateChange} from "./state-change";
import {Transformation} from "../transformation";
import {InfiniteCanvasStateInstance} from "./infinite-canvas-state-instance";

export class StateConversion implements StateChange<InfiniteCanvasState>{
    private instructions: Instruction[] = [];
    public newState: InfiniteCanvasState;
    constructor(private readonly initial: InfiniteCanvasState) {
        this.newState = initial;
    }
    public restore(): void{
        this.change(s => s.restore());
    }
    public save(): void{
        this.change(s => s.save());
    }
    public changeCurrentInstanceTo(instance: InfiniteCanvasStateInstance): void{
        if(this.newState.current.equals(instance)){
            return;
        }
        this.change(s => s.withChangedState(s => s.convertToState(instance)));
    }
    protected addChange(stateChange: StateChange<InfiniteCanvasState>){
        this.newState = stateChange.newState;
        if(stateChange.instruction){
            this.instructions.push(stateChange.instruction);
        }
    }
    protected change(change: (state: InfiniteCanvasState) => StateChange<InfiniteCanvasState>){
        this.addChange(change(this.newState))
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