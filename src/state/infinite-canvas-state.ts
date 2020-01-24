import {InfiniteCanvasStateInstance} from "./infinite-canvas-state-instance";
import {StateConversion} from "./state-conversion";
import {StateConversionWithClippedPaths} from "./state-conversion-with-clipped-paths";
import { Instruction } from "../instructions/instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";

export class InfiniteCanvasState{
    constructor(public current: InfiniteCanvasStateInstance, public stack: InfiniteCanvasStateInstance[] = []){}
    public replaceCurrent(newCurrent: InfiniteCanvasStateInstance): InfiniteCanvasState{
        return new InfiniteCanvasState(newCurrent, this.stack);
    }
    public withCurrentState(newCurrent: InfiniteCanvasStateInstance): InfiniteCanvasState{
        return new InfiniteCanvasState(newCurrent, this.stack);
    }
    public currentlyTransformed(transformed: boolean): InfiniteCanvasState{
        return this.withCurrentState(this.current.changeProperty("fillAndStrokeStylesTransformed", transformed));
    }
    public withClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): InfiniteCanvasState{
        return new InfiniteCanvasState(this.current.withClippedPath(clippedPath), this.stack);
    }
    public saved(): InfiniteCanvasState{
        return new InfiniteCanvasState(this.current, (this.stack || []).concat([this.current]));
    }
    public restored(): InfiniteCanvasState{
        if(!this.stack || this.stack.length === 0){
            return this;
        }
        const topOfStack: InfiniteCanvasStateInstance = this.stack[this.stack.length - 1];
        return new InfiniteCanvasState(topOfStack, this.stack.slice(0, this.stack.length - 1));
    }

    private convertToLastSavedInstance(conversion: StateConversion, indexOfLastSavedInstance: number): void{
        for(let i: number = this.stack.length - 1; i > indexOfLastSavedInstance; i--){
            conversion.restore();
        }
    }

    private convertFromLastSavedInstance(conversion: StateConversion, indexOfLastSavedInstance: number): void{
        for(let i: number = indexOfLastSavedInstance + 1; i < this.stack.length; i++){
            conversion.changeCurrentInstanceTo(this.stack[i]);
            conversion.save();
        }
        conversion.changeCurrentInstanceTo(this.current);
    }

    private getInstructionToConvertToStateUsingConversion(conversion: StateConversion, other: InfiniteCanvasState): Instruction{
        const indexOfHighestCommon: number = InfiniteCanvasState.findIndexOfHighestCommon(this.stack, other.stack);
        this.convertToLastSavedInstance(conversion, indexOfHighestCommon);
        other.convertFromLastSavedInstance(conversion, indexOfHighestCommon);
        return conversion.instruction;
    }
    public getInstructionToConvertToState(other: InfiniteCanvasState): Instruction{
        return this.getInstructionToConvertToStateUsingConversion(new StateConversion(this), other);
    }
    public getInstructionToClearStack(): Instruction{
        const length: number = this.stack.length;
        return (context: CanvasRenderingContext2D) => {
            for(let i: number = 0; i < length; i++){
                context.restore();
            }
        };
    }
    public getInstructionToConvertToStateWithClippedPath(other: InfiniteCanvasState): Instruction{
        return this.getInstructionToConvertToStateUsingConversion(new StateConversionWithClippedPaths(this), other);
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