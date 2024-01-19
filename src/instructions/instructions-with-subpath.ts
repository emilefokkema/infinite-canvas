import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { PathInstructionWithState } from "./path-instruction-with-state";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Position } from "../geometry/position";
import { isPointAtInfinity } from "../geometry/is-point-at-infinity";
import { transformPosition } from "../geometry/transform-position";
import { PathInstruction } from "../interfaces/path-instruction";
import { positionsAreEqual } from "../geometry/positions-are-equal";
import { PathInstructionBuilder } from "./path-instruction-builders/path-instruction-builder";
import { InfiniteCanvasPathInstructionBuilderProvider } from "./path-instruction-builders/infinite-canvas-path-instruction-builder-provider";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { CopyableInstructionWithState } from "./copyable-instruction-with-state";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { InstructionUsingInfinity } from "./instruction-using-infinity";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { ExecutableStateChangingInstructionSequence } from "./executable-state-changing-instruction-sequence";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class InstructionsWithSubpath extends StateChangingInstructionSequence<CopyableInstructionSet>{
    constructor(private readonly _initiallyWithState: PathInstructionWithState, private pathInstructionBuilder: PathInstructionBuilder){
        super(_initiallyWithState);
    }
    public get currentPosition(): Position{return this.pathInstructionBuilder.currentPosition;}
    public addInstruction(instruction: CopyableInstructionWithState): void{
        instruction.setInitialState(this.state);
        this.add(instruction);
    }
    public closePath(): void{
        const toAdd: CopyableInstructionWithState = CopyableInstructionWithState.create(this.state, (context: CanvasRenderingContext2D) => {context.closePath();})
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public copy(): InstructionsWithSubpath{
        const result: InstructionsWithSubpath = new InstructionsWithSubpath(this._initiallyWithState.copy(), this.pathInstructionBuilder);
        for(const added of this.added){
            result.add(added.copy());
        }
        return result;
    }
    public makeExecutable(infinityProvider: PathInfinityProvider): ExecutableStateChangingInstructionSet{
        const result = new ExecutableStateChangingInstructionSequence<ExecutableStateChangingInstructionSet>(this._initiallyWithState.makeExecutable(infinityProvider));
        for(const added of this.added){
            result.add(added.makeExecutable(infinityProvider))
        }
        return result;
    }
    public containsFinitePoint(): boolean{
        return this.pathInstructionBuilder.containsFinitePoint();
    }
    public isClosable(): boolean{
        return this.pathInstructionBuilder.isClosable();
    }
    public canAddLineTo(position: Position): boolean{
        return this.pathInstructionBuilder.canAddLineTo(position);
    }
    public lineTo(position: Position, state: InfiniteCanvasState): void{
        const transformedPosition: Position = transformPosition(position, state.current.transformation);
        if(!isPointAtInfinity(position) || this.pathInstructionBuilder.containsFinitePoint()){
            this.addInstructionToDrawLineTo(position, state);
        }
        this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(transformedPosition);
        const moveTo: InstructionUsingInfinity = this.pathInstructionBuilder.getInstructionToMoveToBeginning(this._initiallyWithState.state);
        this._initiallyWithState.replaceInstruction((context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity) => {
            moveTo(context, rectangle, infinity);
        });
    }
    private addInstructionToDrawLineTo(position: Position, state: InfiniteCanvasState): void{
        const instructionToDrawLine: InstructionUsingInfinity = this.pathInstructionBuilder.getInstructionToDrawLineTo(position, state);
        const toAdd: PathInstructionWithState = PathInstructionWithState.create(state, instructionToDrawLine);
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public addPathInstruction(pathInstruction: PathInstruction, pathInstructionWithState: CopyableInstructionWithState, state: InfiniteCanvasState): void{
        if(pathInstruction.initialPoint && !positionsAreEqual(this.pathInstructionBuilder.currentPosition, pathInstruction.initialPoint)){
            this.lineTo(pathInstruction.initialPoint, state);
        }
        if(pathInstruction.positionChange){
            this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(transformPosition(pathInstruction.positionChange, state.current.transformation));
        }
        pathInstructionWithState.setInitialState(this.state);
        this.add(pathInstructionWithState);
    }
    public static create(initialState: InfiniteCanvasState, initialPosition: Position): InstructionsWithSubpath{
        const transformedInitialPosition: Position = transformPosition(initialPosition, initialState.current.transformation);
        const pathInstructionBuilder: PathInstructionBuilder = new InfiniteCanvasPathInstructionBuilderProvider().getBuilderFromPosition(transformedInitialPosition);
        const instructionToMoveTo: InstructionUsingInfinity = pathInstructionBuilder.getInstructionToMoveToBeginning(initialState);
        const initialInstruction: PathInstructionWithState = PathInstructionWithState.create(initialState, instructionToMoveTo);
        return new InstructionsWithSubpath(initialInstruction, pathInstructionBuilder);
    }
}