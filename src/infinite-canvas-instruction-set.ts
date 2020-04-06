import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { Instruction } from "./instructions/instruction";
import { InfiniteCanvasStateInstance } from "./state/infinite-canvas-state-instance";
import { PreviousInstructions } from "./instructions/previous-instructions";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "./interfaces/state-changing-instruction-set-with-area-and-current-path";
import { StateChangingInstructionSetWithArea } from "./interfaces/state-changing-instruction-set-with-area";
import { InstructionsWithPath } from "./instructions/instructions-with-path";
import { PathInstruction } from "./interfaces/path-instruction";
import { TransformationKind } from "./transformation-kind";
import { RectangularDrawing } from "./instructions/rectangular-drawing";
import { Transformation } from "./transformation";
import { transformInstructionRelatively, transformInstructionAbsolutely } from "./instruction-utils";
import { Area } from "./areas/area";
import { Position } from "./geometry/position"
import { ViewboxInfinityProvider } from "./interfaces/viewbox-infinity-provider";
import { rectangleHasArea } from "./geometry/rectangle-has-area";
import { rectangleIsPlane } from "./geometry/rectangle-is-plane";
import { plane } from "./areas/plane";
import { ConvexPolygon } from "./areas/polygons/convex-polygon";

export class InfiniteCanvasInstructionSet{
    private currentInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPath;
    private previousInstructionsWithPath: PreviousInstructions;
    public state: InfiniteCanvasState;
    private instructionToRestoreState: Instruction;
    constructor(private readonly onChange: () => void, private readonly infinityProvider: ViewboxInfinityProvider){
        this.previousInstructionsWithPath = PreviousInstructions.create(infinityProvider);
        this.state = this.previousInstructionsWithPath.state;
    }
    public beginPath(): void{
        this.replaceCurrentInstructionsWithPath(InstructionsWithPath.create(this.state, this.infinityProvider, this.infinityProvider.getForPath()));
    }
    public changeState(change: (state: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): void{
        this.state = this.state.withCurrentState(change(this.state.current));
    }
    public saveState(): void{
        this.state = this.state.saved();
        this.setInstructionToRestoreState();
    }
    public restoreState(): void{
        this.state = this.state.restored();
        this.setInstructionToRestoreState();
    }
    public allSubpathsAreClosable(): boolean{
        return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.allSubpathsAreClosable();
    }
    public currentPathContainsFinitePoint(): boolean{
        return this.currentInstructionsWithPath && this.currentInstructionsWithPath.containsFinitePoint();
    }
    public currentSubpathIsClosable(): boolean{
        return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.currentSubpathIsClosable();
    }
    public fillPath(instruction: Instruction): void{
        this.drawPath(instruction, (path: StateChangingInstructionSetWithAreaAndCurrentPath, _instruction: Instruction, state: InfiniteCanvasState) => {
            path.fillPath(_instruction, state);
        });
    }
    public strokePath(): void{
        this.drawPath((context: CanvasRenderingContext2D) => {context.stroke();}, (path: StateChangingInstructionSetWithAreaAndCurrentPath, _instruction: Instruction, state: InfiniteCanvasState) => {
            path.strokePath(_instruction, state);
        });
    }
    public fillRect(x: number, y: number, w: number, h: number, instruction: Instruction): void{
        this.drawRect(x, y, w, h, instruction, (path: StateChangingInstructionSetWithAreaAndCurrentPath, _instruction: Instruction, state: InfiniteCanvasState) => {
            path.fillPath(_instruction, state);
        });
    }

    public strokeRect(x: number, y: number, w: number, h: number): void{
        this.drawRect(x, y, w, h, (context: CanvasRenderingContext2D) => {context.stroke();}, (path: StateChangingInstructionSetWithAreaAndCurrentPath, _instruction: Instruction, state: InfiniteCanvasState) => {
            path.strokePath(_instruction, state);
        });
    }
    private drawPath(instruction: Instruction, drawPath: (path: StateChangingInstructionSetWithAreaAndCurrentPath, instruction: Instruction, state: InfiniteCanvasState) => void): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        const stateIsTransformable: boolean = this.state.current.isTransformable();
        if(!stateIsTransformable){
            instruction = transformInstructionRelatively(instruction);
        }
        this.state = this.state.currentlyTransformed(stateIsTransformable);
        const recreatedPath: StateChangingInstructionSetWithAreaAndCurrentPath = this.currentInstructionsWithPath.recreatePath();
        drawPath(this.currentInstructionsWithPath, instruction, this.state);
        this.previousInstructionsWithPath.add(this.currentInstructionsWithPath);
        recreatedPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
        this.currentInstructionsWithPath = recreatedPath;
        this.setInstructionToRestoreState();
        this.onChange();
    }

    private drawRect(x: number, y: number, w: number, h: number, instruction: Instruction, drawPath: (path: StateChangingInstructionSetWithAreaAndCurrentPath, instruction: Instruction, state: InfiniteCanvasState) => void): void{
        const stateIsTransformable: boolean = this.state.current.isTransformable();
        if(!stateIsTransformable){
            instruction = transformInstructionRelatively(instruction);
        }
        const stateToDrawWith: InfiniteCanvasState = this.state.currentlyTransformed(this.state.current.isTransformable());
        const pathToDraw: StateChangingInstructionSetWithAreaAndCurrentPath = InstructionsWithPath.create(stateToDrawWith, this.infinityProvider, this.infinityProvider.getForPath());
        pathToDraw.rect(x, y, w, h, stateToDrawWith);
        drawPath(pathToDraw, instruction, stateToDrawWith);
        this.drawBeforeCurrentPath(pathToDraw);
        this.onChange();
	}

    public addDrawing(instruction: Instruction, area: Area, transformationKind: TransformationKind, takeClippingRegionIntoAccount: boolean): void{
        if(transformationKind === TransformationKind.Relative){
			instruction = transformInstructionRelatively(instruction);
			area = area.transform(this.state.current.transformation);
		}else if(transformationKind === TransformationKind.Absolute){
			instruction = transformInstructionAbsolutely(instruction);
        }
        let areaToDraw: Area = area;
        if(this.state.current.clippingRegion && takeClippingRegionIntoAccount){
            areaToDraw = area.intersectWith(this.state.current.clippingRegion);
        }
        const drawing: RectangularDrawing = RectangularDrawing.createDrawing(this.state.currentlyTransformed(false), instruction, areaToDraw);
        this.drawBeforeCurrentPath(drawing);
        this.onChange();
    }

    public clipPath(instruction: Instruction): void{
        this.clipCurrentPath(instruction);
    }

    private replaceCurrentInstructionsWithPath(newInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPath, ...instructionsToInterject: StateChangingInstructionSetWithArea[]): void{
        for(const instructionToInterject of instructionsToInterject){
            instructionToInterject.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
            this.previousInstructionsWithPath.add(instructionToInterject);
        }
        newInstructionsWithPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
        this.currentInstructionsWithPath = newInstructionsWithPath;
        this.setInstructionToRestoreState();
    }

    private clipCurrentPath(instruction: Instruction): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        this.currentInstructionsWithPath.clipPath(instruction, this.state);
        this.state = this.currentInstructionsWithPath.state;
    }

    private setInstructionToRestoreState(): void{
        const latestVisibleState: InfiniteCanvasState = this.previousInstructionsWithPath.state;
        this.instructionToRestoreState = latestVisibleState.getInstructionToClearStack();
    }

    private drawBeforeCurrentPath(instruction: StateChangingInstructionSetWithArea): void{
        if(this.currentInstructionsWithPath){
            const recreatedPath: StateChangingInstructionSetWithAreaAndCurrentPath = this.currentInstructionsWithPath.recreatePath();
            recreatedPath.setInitialState(this.currentInstructionsWithPath.state);
            this.replaceCurrentInstructionsWithPath(recreatedPath, instruction);
        }else{
            instruction.setInitialState(this.previousInstructionsWithPath.state);
            this.previousInstructionsWithPath.add(instruction);
            this.state = this.previousInstructionsWithPath.state;
        }
    }

    public addPathInstruction(pathInstruction: PathInstruction): void{
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.addPathInstruction(pathInstruction, this.state);
        }
    }

    public closePath(): void{
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.closePath();
        }
    }
    public moveTo(position: Position): void{
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.moveTo(position, this.state);
        }
    }
    public canAddLineTo(position: Position): boolean{
        return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.canAddLineTo(position, this.state);
    }
    public lineTo(position: Position): void{
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.lineTo(position, this.state);
        }
    }
    public rect(x: number, y: number, w: number, h: number): void{
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.rect(x, y, w, h, this.state);
        }
    }
    public intersects(area: Area): boolean{
        return this.previousInstructionsWithPath.intersects(area) || this.currentInstructionsWithPath && this.currentInstructionsWithPath.intersects(area);
    }

    public clearContentsInsideArea(area: Area): void{
        this.previousInstructionsWithPath.clearContentsInsideArea(area);
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
        }
    }

    public clearArea(x: number, y: number, width: number, height: number): void{
        if(!rectangleHasArea(x, y, width, height)){
			return;
		}
		const rectangle: Area = rectangleIsPlane(x, y, width, height) ? plane : ConvexPolygon.createRectangle(x, y, width, height);
        const transformedRectangle: Area = rectangle.transform(this.state.current.transformation)
        if(!this.intersects(transformedRectangle)){
            return;
        }
        this.clearContentsInsideArea(transformedRectangle);
        if(this.previousInstructionsWithPath.hasDrawingAcrossBorderOf(transformedRectangle)){
            this.previousInstructionsWithPath.addClearRect(rectangle, this.state, x, y, width, height);
            if(this.currentInstructionsWithPath){
                this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.state);
            }
        }
		this.onChange();
    }
    
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(this.previousInstructionsWithPath.length){
            this.previousInstructionsWithPath.execute(context, transformation);
        }
        if(this.instructionToRestoreState){
            this.instructionToRestoreState(context, transformation);
        }
    }
}
