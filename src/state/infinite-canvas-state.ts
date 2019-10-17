import { InfiniteCanvasStateInstance } from "./infinite-canvas-state-instance";
import { StateChange } from "./state-change";
import { ChainableStateChange } from "./chainable-state-change";

export class InfiniteCanvasState{
    constructor(public current: InfiniteCanvasStateInstance, public stack: InfiniteCanvasStateInstance[] = []){}
    public static default: InfiniteCanvasState = new InfiniteCanvasState(InfiniteCanvasStateInstance.default, []);
    public withChangedState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): StateChange<InfiniteCanvasState>{
        const stateChange: StateChange<InfiniteCanvasStateInstance> = change(this.current);
        return {
            newState: new InfiniteCanvasState(stateChange.newState, this.stack),
            instruction: stateChange.instruction
        };
    }
    public save(): StateChange<InfiniteCanvasState>{
        return {
            newState: new InfiniteCanvasState(this.current, (this.stack || []).concat([this.current])),
            instruction: (context: CanvasRenderingContext2D) => {context.save();}
        };
    }
    public restore(): StateChange<InfiniteCanvasState>{
        if(!this.stack || this.stack.length === 0){
            return {
                newState: this,
                instruction: undefined
            };
        }
        const topOfStack: InfiniteCanvasStateInstance = this.stack[this.stack.length - 1];
        return {
            newState: new InfiniteCanvasState(topOfStack, this.stack.slice(0, this.stack.length - 1)),
            instruction: (context: CanvasRenderingContext2D) => {context.restore();}
        };
    }
    public convertTo(other: InfiniteCanvasState): StateChange<InfiniteCanvasState>{
        let change: ChainableStateChange<InfiniteCanvasState> = new ChainableStateChange(this, []);
        const indexOfHighestCommon: number = InfiniteCanvasState.findIndexOfHighestCommon(this.stack, other.stack);
        let currentIndex: number = indexOfHighestCommon + 1;
        for(let i: number = this.stack.length - 1; i > indexOfHighestCommon; i--){
            change = change.change(s => s.restore());
        }
        while(currentIndex < other.stack.length){
            change = change.change(s => s.withChangedState(ss => ss.convertToState(other.stack[currentIndex])));
            change = change.change(s => s.save());
            currentIndex++;
        }
        change = change.change(s => s.withChangedState(ss => ss.convertToState(other.current)));
        return change;
    }

    private static findIndexOfHighestCommon(one: InfiniteCanvasStateInstance[], other: InfiniteCanvasStateInstance[]): number{
        let result: number = 0;
        let lowestIndex: number = Math.min(one.length - 1, other.length - 1);
        while(result <= lowestIndex){
            if(!one[result].equals(other[result])){
                return result - 1;
            }
            result++;
        }
        return result - 1;
    }
}