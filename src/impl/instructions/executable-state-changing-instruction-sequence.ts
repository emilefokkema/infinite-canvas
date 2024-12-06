import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class ExecutableStateChangingInstructionSequence<TInstructionSet extends ExecutableStateChangingInstructionSet> extends StateChangingInstructionSequence<TInstructionSet> implements ExecutableStateChangingInstructionSet{
    constructor(private _initiallyWithState: ExecutableStateChangingInstructionSet){
        super(_initiallyWithState)
    }
    public execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void{
        this._initiallyWithState.execute(context, rectangle);
        for(const added of this.added){
            added.execute(context, rectangle);
        }
    }
}