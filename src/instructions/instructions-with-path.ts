import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { PreExecutableInstructionWithState } from "./pre-executable-instruction-with-state";
import { CurrentPath } from "../interfaces/current-path";
import { PathInstruction } from "../interfaces/path-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { InfiniteCanvasAreaBuilder } from "../areas/infinite-canvas-area-builder";
import { Position } from "../geometry/position";
import { transformPosition } from "../geometry/transform-position";
import { InstructionsWithSubpath } from "./instructions-with-subpath";
import { DrawnPathProperties } from "../interfaces/drawn-path-properties";
import { InfiniteCanvasPathInfinityProvider } from "../infinite-canvas-path-infinity-provider";
import { InstructionsToClip } from "../interfaces/instructions-to-clip";
import { InstructionsToClipImpl } from "./instructions-to-clip-impl";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { ExecutableStateChangingInstructionSequence } from "./executable-state-changing-instruction-sequence";
import { ExecutableInstructionWithState } from "./executable-instruction-with-state";

export class InstructionsWithPath extends StateChangingInstructionSequence<InstructionsWithSubpath> implements CurrentPath{
    private areaBuilder: InfiniteCanvasAreaBuilder = new InfiniteCanvasAreaBuilder();
    constructor(private _initiallyWithState: PreExecutableInstructionWithState){
        super(_initiallyWithState);
    }
    public get area(): Area{return this.areaBuilder.area;}
    public surroundsFinitePoint(): boolean{
        for(const subpath of this.added){
            if(subpath.surroundsFinitePoint()){
                return true;
            }
        }
        return false;
    }
    public currentSubpathIsClosable(): boolean{
        if(this.added.length === 0){
            return true;
        }
        return this.added[this.added.length - 1].isClosable();
    }
    public allSubpathsAreClosable(): boolean{
        if(this.added.length === 0){
            return true;
        }
        for(const subPath of this.added){
            if(!subPath.isClosable()){
                return false;
            }
        }
        return true;
    }
    public drawPath(instruction: Instruction, state: InfiniteCanvasState, drawnPathProperties: DrawnPathProperties): ExecutableStateChangingInstructionSet{
        if(this.added.length === 0){
            return;
        }
        const toAdd = ExecutableInstructionWithState.create(state, instruction);
        const result = this.makeExecutable(drawnPathProperties);
        toAdd.setInitialState(result.state)
        result.add(toAdd)
        return result;
    }
    private makeExecutable(drawnPathProperties: DrawnPathProperties): ExecutableStateChangingInstructionSequence<ExecutableStateChangingInstructionSet>{
        const result = new ExecutableStateChangingInstructionSequence<ExecutableStateChangingInstructionSet>(this._initiallyWithState.makeExecutable());
        const pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties)
        for(const added of this.added){
            result.add(added.makeExecutable(pathInfinityProvider))
        }
        return result;
    }
    private getInstructionsToClip(): InstructionsToClip{
        const executable = this.makeExecutable({lineWidth: 0, lineDashPeriod: 0, shadowOffsets: []})
        executable.setInitialState(executable.stateOfFirstInstruction)
        return new InstructionsToClipImpl(executable, this.area)
    }
    public clipPath(instruction: Instruction, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const toAdd: PreExecutableInstructionWithState = PreExecutableInstructionWithState.create(state, instruction);
        currentSubpath.addInstruction(toAdd);
        const instructionsToClip = this.getInstructionsToClip();
        this.addClippedPath(instructionsToClip);
    }
    public closePath(): void{
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        currentSubpath.closePath();
    }
    public moveTo(position: Position, state: InfiniteCanvasState): void{
        const transformedPointToMoveTo: Position = transformPosition(position, state.current.transformation);
        this.areaBuilder.addPosition(transformedPointToMoveTo);
        const newSubpath: InstructionsWithSubpath = InstructionsWithSubpath.create(state, position);
        newSubpath.setInitialState(this.state);
        this.add(newSubpath);
    }
    public canAddLineTo(position: Position, state: InfiniteCanvasState): boolean{
        if(this.added.length === 0){
          return true;
        }
        const transformedPosition: Position = transformPosition(position, state.current.transformation);
        return this.added[this.added.length - 1].canAddLineTo(transformedPosition);
    }
    public lineTo(position: Position, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            this.moveTo(position, state);
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const transformedPosition: Position = transformPosition(position, state.current.transformation);
        this.areaBuilder.addPosition(transformedPosition);
        currentSubpath.lineTo(position, state);
    }
    public addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            if(pathInstruction.initialPoint){
                this.moveTo(pathInstruction.initialPoint, state);
            }else{
                return;
            }
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const currentPosition: Position = currentSubpath.currentPosition;
        const inverseTransformedCurrentPosition = transformPosition(currentPosition, state.current.transformation.inverse());
        pathInstruction.changeArea(this.areaBuilder.transformedWith(state.current.transformation), inverseTransformedCurrentPosition);
        const toAdd: PreExecutableInstructionWithState = PreExecutableInstructionWithState.create(state, pathInstruction.instruction);
        currentSubpath.addPathInstruction(pathInstruction, toAdd, state);
    }
    public static create(initialState: InfiniteCanvasState): InstructionsWithPath{
        return new InstructionsWithPath(PreExecutableInstructionWithState.create(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();}));
    }
}
