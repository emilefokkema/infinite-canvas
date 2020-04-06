import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { PathInstruction } from "../interfaces/path-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { InfiniteCanvasAreaBuilder } from "../areas/infinite-canvas-area-builder";
import { Position } from "../geometry/position";
import { transformPosition } from "../geometry/transform-position";
import { Point } from "../geometry/point";
import {InstructionsWithSubpath} from "./instructions-with-subpath";
import {down, left, right, up} from "../geometry/points-at-infinity";
import {rectangleHasArea} from "../geometry/rectangle-has-area";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { ViewboxInfinityProvider } from "../interfaces/viewbox-infinity-provider";

export class InstructionsWithPath extends StateChangingInstructionSequence<InstructionsWithSubpath> implements StateChangingInstructionSetWithAreaAndCurrentPath{
    private areaBuilder: InfiniteCanvasAreaBuilder = new InfiniteCanvasAreaBuilder();
    private drawnArea: Area;
    constructor(private _initiallyWithState: StateAndInstruction, private readonly viewboxInfinityProvider: ViewboxInfinityProvider, private readonly pathInfinityProvider: PathInfinityProvider){
        super(_initiallyWithState);
    }
    private get area(): Area{return this.areaBuilder.area;}
    private getCurrentlyDrawableArea(): Area{
        if(!this.area){
            return undefined;
        }
        if(!this.state.current.clippingRegion){
            return this.area;
        }
        return this.state.current.clippingRegion.intersectWith(this.area);
    }
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
    public fillPath(instruction: Instruction, state: InfiniteCanvasState): void{
        this.drawPath(instruction, state);
    }
    public strokePath(instruction: Instruction, state: InfiniteCanvasState): void{
        this.pathInfinityProvider.addDrawnLineWidth(state.current.getMaximumLineWidth());
        this.pathInfinityProvider.addLineDashPeriod(state.current.getLineDashPeriod());
        this.drawPath(instruction, state);
    }
    private drawPath(instruction: Instruction, state: InfiniteCanvasState): void{ 
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const newlyDrawnArea: Area = this.getCurrentlyDrawableArea();
        this.drawnArea = newlyDrawnArea;
        const toAdd: StateAndInstruction = StateAndInstruction.create(state, instruction);
        currentSubpath.addInstruction(toAdd);
    }
    public clipPath(instruction: Instruction, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const toAdd: StateAndInstruction = StateAndInstruction.create(state, instruction);
        currentSubpath.addInstruction(toAdd);
        const clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath = this.recreatePath();
        this.addClippedPath(clippedPath);
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
        const newSubpath: InstructionsWithSubpath = InstructionsWithSubpath.create(state, position, this.pathInfinityProvider);
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
        const toAdd: StateAndInstruction = StateAndInstruction.create(state, pathInstruction.instruction);
        pathInstruction.changeArea(this.areaBuilder.transformedWith(state.current.transformation));
        currentSubpath.addPathInstruction(pathInstruction, toAdd, state);
    }

    public hasDrawingAcrossBorderOf(area: Area): boolean{
        if(area.contains(this.area)){
            return false;
        }
        return this.area.intersects(area);
    }
    public isContainedBy(area: Area): boolean {
        return area.contains(this.drawnArea);
    }
    public intersects(area: Area): boolean{
        if(!this.area){
            return false;
        }
        return this.area.intersects(area);
    }
    public getClippedArea(previouslyClipped?: Area): Area {
        return previouslyClipped ? this.area.intersectWith(previouslyClipped): this.area;
    }
    public recreatePath(): StateChangingInstructionSetWithAreaAndCurrentPath{
        const newInfinityProvider: PathInfinityProvider = this.viewboxInfinityProvider.getForPath();
        const result: InstructionsWithPath = new InstructionsWithPath(this._initiallyWithState.copy(), this.viewboxInfinityProvider, newInfinityProvider);
        for(const added of this.added){
            result.add(added.copy(newInfinityProvider));
        }
        result.areaBuilder = this.areaBuilder.copy();
        result.setInitialState(result.stateOfFirstInstruction);
        return result;
    }
    public static create(initialState: InfiniteCanvasState, viewboxInfinityProvider: ViewboxInfinityProvider, pathInfinityProvider: PathInfinityProvider): InstructionsWithPath{
        return new InstructionsWithPath(StateAndInstruction.create(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();}), viewboxInfinityProvider, pathInfinityProvider);
    }
}
