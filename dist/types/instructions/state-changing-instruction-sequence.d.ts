import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Transformation } from "../transformation";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
export declare class StateChangingInstructionSequence<TInstructionSet extends StateChangingInstructionSet> implements StateChangingInstructionSet {
    protected initiallyWithState: StateChangingInstructionSet;
    protected added: TInstructionSet[];
    private addedLast;
    constructor(initiallyWithState: StateChangingInstructionSet);
    get length(): number;
    protected get currentlyWithState(): StateChangingInstructionSet;
    protected reconstructState(fromState: InfiniteCanvasState, toInstructionSet: TInstructionSet): void;
    get stateOfFirstInstruction(): InfiniteCanvasState;
    get state(): InfiniteCanvasState;
    get initialState(): InfiniteCanvasState;
    addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): void;
    add(instructionSet: TInstructionSet): void;
    removeAll(predicate: (instructionSet: TInstructionSet) => boolean): void;
    contains(predicate: (instructionSet: TInstructionSet) => boolean): boolean;
    setInitialState(previousState: InfiniteCanvasState): void;
    setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void;
    execute(context: CanvasRenderingContext2D, transformation: Transformation): void;
    private beforeIndex;
    private removeAtIndex;
}
