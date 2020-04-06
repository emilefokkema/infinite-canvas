import {StateChangingInstructionSequence} from "./state-changing-instruction-sequence";
import {PathInstructionWithState} from "./path-instruction-with-state";
import {InfiniteCanvasState} from "../state/infinite-canvas-state";
import {Position} from "../geometry/position";
import {isPointAtInfinity} from "../geometry/is-point-at-infinity";
import {transformPosition} from "../geometry/transform-position";
import {PathInstruction} from "../interfaces/path-instruction";
import {positionsAreEqual} from "../geometry/positions-are-equal";
import { PathInstructionBuilder } from "./path-instruction-builders/path-instruction-builder";
import { InfiniteCanvasPathInstructionBuilderProvider } from "./path-instruction-builders/infinite-canvas-path-instruction-builder-provider";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { StateAndInstruction } from "./state-and-instruction";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { InstructionUsingInfinity } from "./instruction-using-infinity";
import { Transformation } from "../transformation";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";

export class InstructionsWithSubpath extends StateChangingInstructionSequence<CopyableInstructionSet>{
    constructor(private _initiallyWithState: PathInstructionWithState, private readonly pathInfinityProvider: PathInfinityProvider, private pathInstructionBuilder: PathInstructionBuilder) {
        super(_initiallyWithState);
    }
    public addInstruction(instruction: StateAndInstruction): void{
        instruction.setInitialState(this.state);
        this.add(instruction);
    }
    public closePath(): void{
        const toAdd: StateAndInstruction = StateAndInstruction.create(this.state, (context: CanvasRenderingContext2D) => {context.closePath();});
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public copy(pathInfinityProvider: PathInfinityProvider): InstructionsWithSubpath{
        const result: InstructionsWithSubpath = new InstructionsWithSubpath(this._initiallyWithState.copy(pathInfinityProvider), pathInfinityProvider, this.pathInstructionBuilder);
        for(const added of this.added){
            result.add(added.copy(pathInfinityProvider));
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
        this._initiallyWithState.replaceInstruction((context: CanvasRenderingContext2D, transformation: Transformation, infinity: ViewboxInfinity) => {
            moveTo(context, transformation, infinity);
        });
    }
    private addInstructionToDrawLineTo(position: Position, state: InfiniteCanvasState): void{
        const instructionToDrawLine: InstructionUsingInfinity = this.pathInstructionBuilder.getInstructionToDrawLineTo(position, state);
        const infinityAtState: ViewboxInfinity = this.pathInfinityProvider.getInfinity(state);
        let toAdd: PathInstructionWithState = PathInstructionWithState.create(state, infinityAtState, instructionToDrawLine);
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public addPathInstruction(pathInstruction: PathInstruction, pathInstructionWithState: StateAndInstruction, state: InfiniteCanvasState): void{
        if(pathInstruction.initialPoint && !positionsAreEqual(this.pathInstructionBuilder.currentPosition, pathInstruction.initialPoint)){
            this.lineTo(pathInstruction.initialPoint, state);
        }
        if(pathInstruction.positionChange){
            this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(transformPosition(pathInstruction.positionChange, state.current.transformation));
        }
        pathInstructionWithState.setInitialState(this.state);
        this.add(pathInstructionWithState);
    }
    public static create(initialState: InfiniteCanvasState, initialPosition: Position, infinityProvider: PathInfinityProvider): InstructionsWithSubpath{
        const transformedInitialPosition: Position = transformPosition(initialPosition, initialState.current.transformation);
        const instructionToGoAroundViewbox: InstructionUsingInfinity = infinityProvider.getPathInstructionToGoAroundViewbox();
        const pathInstructionBuilder: PathInstructionBuilder = new InfiniteCanvasPathInstructionBuilderProvider(instructionToGoAroundViewbox).getBuilderFromPosition(transformedInitialPosition);
        const instructionToMoveTo: InstructionUsingInfinity = pathInstructionBuilder.getInstructionToMoveToBeginning(initialState);
        const infinityAtInitialState: ViewboxInfinity = infinityProvider.getInfinity(initialState);
        let initialInstruction: PathInstructionWithState = PathInstructionWithState.create(initialState, infinityAtInitialState, instructionToMoveTo);        
        return new InstructionsWithSubpath(initialInstruction, infinityProvider, pathInstructionBuilder);
    }
}
