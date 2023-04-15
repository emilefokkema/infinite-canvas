import { Transformation } from "../transformation";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";

export class ExecutableStateChangingInstructionSequence<TInstructionSet extends ExecutableStateChangingInstructionSet> extends StateChangingInstructionSequence<TInstructionSet> implements ExecutableStateChangingInstructionSet{
    constructor(private _initiallyWithState: ExecutableStateChangingInstructionSet){
        super(_initiallyWithState)
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation): void{
        this._initiallyWithState.execute(context, transformation);
        for(const added of this.added){
            added.execute(context, transformation);
        }
    }
}