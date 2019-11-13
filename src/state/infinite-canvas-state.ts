import { StateChange } from "./state-change";
import {StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState} from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import {InfiniteCanvasStateInstance} from "./infinite-canvas-state-instance";
import {StateConversion} from "./state-conversion";
import {StateConversionWithClippedPaths} from "./state-conversion-with-clipped-paths";

export class InfiniteCanvasState{
    constructor(public current: InfiniteCanvasStateInstance, public stack: InfiniteCanvasStateInstance[] = []){}
    public replaceCurrent(newCurrent: InfiniteCanvasStateInstance): InfiniteCanvasState{
        return new InfiniteCanvasState(newCurrent, this.stack);
    }
    public withChangedState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): StateChange<InfiniteCanvasState>{
        const stateChange: StateChange<InfiniteCanvasStateInstance> = change(this.current);
        return {
            newState: new InfiniteCanvasState(stateChange.newState, this.stack),
            instruction: stateChange.instruction
        };
    }
    public withClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState): InfiniteCanvasState{
        return new InfiniteCanvasState(this.current.withClippedPath(clippedPath), this.stack);
    }
    public save(): StateChange<InfiniteCanvasState>{
        return {
            newState: new InfiniteCanvasState(this.current, (this.stack || []).concat([this.current])),
            instruction: (context: CanvasRenderingContext2D) => {context.save();}
        };
    }
    public lastBeforeFirstSaved(): InfiniteCanvasState{
        if(this.stack.length === 0){
            return this;
        }
        const firstInstance: InfiniteCanvasStateInstance = this.stack[0];
        return new InfiniteCanvasState(firstInstance);
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

    private convertToLastSavedInstance(conversion: StateConversion, lastSavedInstance: InfiniteCanvasStateInstance): void{
        const indexOfLastSavedInstance: number = this.stack.indexOf(lastSavedInstance);
        for(let i: number = this.stack.length - 1; i > indexOfLastSavedInstance; i--){
            conversion.restore();
        }
    }

    private convertFromLastSavedInstance(conversion: StateConversion, lastSavedInstance: InfiniteCanvasStateInstance): void{
        const indexOfLastSavedInstance: number = this.stack.indexOf(lastSavedInstance);
        for(let i: number = indexOfLastSavedInstance + 1; i < this.stack.length; i++){
            conversion.changeCurrentInstanceTo(this.stack[i]);
            conversion.save();
        }
        conversion.changeCurrentInstanceTo(this.current);
    }

    private convertToStateUsingConversion(conversion: StateConversion, other: InfiniteCanvasState): StateChange<InfiniteCanvasState>{
        const indexOfHighestCommon: number = InfiniteCanvasState.findIndexOfHighestCommon(this.stack, other.stack);
        this.convertToLastSavedInstance(conversion, this.stack[indexOfHighestCommon]);
        other.convertFromLastSavedInstance(conversion, other.stack[indexOfHighestCommon]);
        return conversion;
    }
    public convertToState(other: InfiniteCanvasState): StateChange<InfiniteCanvasState>{
        return this.convertToStateUsingConversion(new StateConversion(this), other);
    }
    public convertToStateWithClippedPath(other: InfiniteCanvasState): StateChange<InfiniteCanvasState>{
        return this.convertToStateUsingConversion(new StateConversionWithClippedPaths(this), other);
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