import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { CopyableInstructionWithState } from "./copyable-instruction-with-state";
import { StateChangingInstructionSetWithCurrentPath } from "../interfaces/state-changing-instruction-set-with-current-path";
import { PathInstruction } from "../interfaces/path-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { InfiniteCanvasAreaBuilder } from "../areas/infinite-canvas-area-builder";
import { Position } from "../geometry/position";
import { transformPosition } from "../geometry/transform-position";
import { Point } from "../geometry/point";
import { InstructionsWithSubpath } from "./instructions-with-subpath";
import {down, left, right, up} from "../geometry/points-at-infinity";
import {rectangleHasArea} from "../geometry/rectangle-has-area";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
import { DrawnStrokeProperties } from "../interfaces/drawn-stroke-properties";
import { InfiniteCanvasPathInfinityProvider } from "../infinite-canvas-path-infinity-provider";
import { StateChangingInstructionSetWithPositiveArea } from "../interfaces/state-changing-instruction-set-with-positive-area";
import { InstructionsWithPositiveDrawnArea } from "./instructions-with-positive-drawn-area";
import { InstructionsToClip } from "../interfaces/instructions-to-clip";
import { InstructionsToClipImpl } from "./instructions-to-clip-impl";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { ExecutableStateChangingInstructionSequence } from "./executable-state-changing-instruction-sequence";

export class InstructionsWithPath extends StateChangingInstructionSequence<InstructionsWithSubpath> implements StateChangingInstructionSetWithCurrentPath{
    private areaBuilder: InfiniteCanvasAreaBuilder = new InfiniteCanvasAreaBuilder();
    constructor(private _initiallyWithState: CopyableInstructionWithState, private readonly rectangle: CanvasRectangle){
        super(_initiallyWithState);
    }
    private get area(): Area{return this.areaBuilder.area;}
    public containsFinitePoint(): boolean{
        for(const subpath of this.added){
            if(subpath.containsFinitePoint()){
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
    public fillPath(instruction: Instruction, state: InfiniteCanvasState): StateChangingInstructionSetWithPositiveArea{
        return this.drawPath(instruction, state, {lineWidth: 0, lineDashPeriod: 0, shadowOffsets: state.current.getShadowOffsets()});
    }
    public strokePath(instruction: Instruction, state: InfiniteCanvasState): StateChangingInstructionSetWithPositiveArea{
        return this.drawPath(
            instruction,
            state,
            {
                lineWidth: state.current.getMaximumLineWidth(),
                lineDashPeriod: state.current.getLineDashPeriod(),
                shadowOffsets: state.current.getShadowOffsets()
            });
    }
    private drawPath(instruction: Instruction, state: InfiniteCanvasState, drawnStrokeProperties: DrawnStrokeProperties): StateChangingInstructionSetWithPositiveArea{ 
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        let newlyDrawnArea: Area = this.area
        if(newlyDrawnArea && drawnStrokeProperties.lineWidth > 0){
            newlyDrawnArea = newlyDrawnArea.expandByDistance(drawnStrokeProperties.lineWidth / 2)
        }
        const toAdd: CopyableInstructionWithState = CopyableInstructionWithState.create(state, instruction, this.rectangle);
        currentSubpath.addInstruction(toAdd);
        return new InstructionsWithPositiveDrawnArea(this.makeExecutable(drawnStrokeProperties), newlyDrawnArea)
    }
    private makeExecutable(drawnStrokeProperties: DrawnStrokeProperties): ExecutableStateChangingInstructionSet{
        const result = new ExecutableStateChangingInstructionSequence<ExecutableStateChangingInstructionSet>(this._initiallyWithState.makeExecutable());
        const pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(this.rectangle, drawnStrokeProperties)
        for(const added of this.added){
            result.add(added.makeExecutable(pathInfinityProvider))
        }
        return result;
    }
    public clipPath(instruction: Instruction, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const toAdd: CopyableInstructionWithState = CopyableInstructionWithState.create(state, instruction, this.rectangle);
        currentSubpath.addInstruction(toAdd);
        const recreated = this.recreatePath();
        this.addClippedPath(recreated.getInstructionsToClip());
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
        const newSubpath: InstructionsWithSubpath = InstructionsWithSubpath.create(state, position, this.rectangle);
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
    private moveToPositionDeterminedBy(x: number, y: number, state: InfiniteCanvasState): void{
        if(Number.isFinite(x)){
            if(Number.isFinite(y)){
                this.moveTo(new Point(x, y), state);
            }else{
                this.moveTo(y < 0 ? up : down, state);
            }
        }else{
            this.moveTo(x < 0 ? left : right, state);
        }
    }
    public rect(x: number, y: number, w: number, h: number, state: InfiniteCanvasState): void{
        if(!Number.isFinite(x) && !Number.isFinite(y)){
            this.moveTo({direction: new Point(1, 0)}, state);
            this.lineTo({direction: new Point(0, 1)}, state);
            this.lineTo({direction: new Point(-1, -1)}, state);
            return;
        }
        this.moveToPositionDeterminedBy(x, y, state);
        if(!rectangleHasArea(x, y, w, h)){
           return;
        }
        if(Number.isFinite(x)){
            if(Number.isFinite(y)){
                if(Number.isFinite(w)){
                    this.lineTo(new Point(x + w, y), state);
                    if(Number.isFinite(h)){
                        this.lineTo(new Point(x + w, y + h), state);
                        this.lineTo(new Point(x, y + h), state);
                    }else{
                        this.lineTo(h > 0 ? down : up, state);
                    }
                }else{
                    this.lineTo(w > 0 ? right : left, state);
                    if(Number.isFinite(h)){
                        this.lineTo(new Point(x, y + h), state);
                    }else{
                        this.lineTo(h > 0 ? down : up, state);
                    }
                }
                this.lineTo(new Point(x, y), state);
            }else{
                if(Number.isFinite(w)){
                    this.lineTo(new Point(x + w, 0), state);      
                }else{
                    this.lineTo(w > 0 ? right : left, state);
                }
                this.lineTo(h > 0 ? down : up, state);
                this.lineTo(new Point(x, 0), state);
                this.lineTo(y < 0 ? up : down, state);
            }
        }else{
            this.lineTo(new Point(0, y), state);
            this.lineTo(w > 0 ? right : left, state);
            if(Number.isFinite(h)){
                this.lineTo(new Point(0, y + h), state);
            }else{
                this.lineTo(h > 0 ? down : up, state)
            }
            this.lineTo(x < 0 ? left : right, state);
        }
        this.closePath();
        this.moveToPositionDeterminedBy(x, y, state);
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
        const toAdd: CopyableInstructionWithState = CopyableInstructionWithState.create(state, pathInstruction.instruction, this.rectangle);
        currentSubpath.addPathInstruction(pathInstruction, toAdd, state);
    }
    public getInstructionsToClip(): InstructionsToClip{
        return new InstructionsToClipImpl(this.makeExecutable({lineWidth: 0, lineDashPeriod: 0, shadowOffsets: []}), this.area)
    }
    public recreatePath(): StateChangingInstructionSetWithCurrentPath{
        const result: InstructionsWithPath = new InstructionsWithPath(this._initiallyWithState.copy(), this.rectangle);
        for(const added of this.added){
            result.add(added.copy());
        }
        result.areaBuilder = this.areaBuilder.copy();
        result.setInitialState(result.stateOfFirstInstruction);
        return result;
    }
    public static create(initialState: InfiniteCanvasState, rectangle: CanvasRectangle): InstructionsWithPath{
        return new InstructionsWithPath(CopyableInstructionWithState.create(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();}, rectangle), rectangle);
    }
}
