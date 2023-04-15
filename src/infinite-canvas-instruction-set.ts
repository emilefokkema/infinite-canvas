import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { Instruction } from "./instructions/instruction";
import { InfiniteCanvasStateInstance } from "./state/infinite-canvas-state-instance";
import { PreviousInstructions } from "./instructions/previous-instructions";
import { StateChangingInstructionSetWithCurrentPath } from "./interfaces/state-changing-instruction-set-with-current-path";
import { StateChangingInstructionSetWithPositiveArea } from "./interfaces/state-changing-instruction-set-with-positive-area";
import { InstructionsWithPath } from "./instructions/instructions-with-path";
import { PathInstruction } from "./interfaces/path-instruction";
import { TransformationKind } from "./transformation-kind";
import { Transformation } from "./transformation";
import { Area } from "./areas/area";
import { Position } from "./geometry/position"
import { rectangleHasArea } from "./geometry/rectangle-has-area";
import { rectangleIsPlane } from "./geometry/rectangle-is-plane";
import { plane } from "./areas/plane";
import { ConvexPolygon } from "./areas/polygons/convex-polygon";
import { CanvasRectangle } from "./rectangle/canvas-rectangle";
import { ExecutableInstructionWithState } from "./instructions/executable-instruction-with-state";
import { InstructionsWithPositiveDrawnArea } from "./instructions/instructions-with-positive-drawn-area";
import { DrawingInstruction } from "./drawing-instruction";

export class InfiniteCanvasInstructionSet{
    private currentInstructionsWithPath: StateChangingInstructionSetWithCurrentPath;
    private previousInstructionsWithPath: PreviousInstructions;
    public state: InfiniteCanvasState;
    constructor(private readonly onChange: () => void, private readonly rectangle: CanvasRectangle){
        this.previousInstructionsWithPath = PreviousInstructions.create(rectangle);
        this.state = this.previousInstructionsWithPath.state;
    }
    public beginPath(): void{
        const newCurrentPath = InstructionsWithPath.create(this.state, this.rectangle);
        newCurrentPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
        this.currentInstructionsWithPath = newCurrentPath;
    }
    public changeState(change: (state: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): void{
        this.state = this.state.withCurrentState(change(this.state.current));
    }
    public saveState(): void{
        this.state = this.state.saved();
    }
    public restoreState(): void{
        this.state = this.state.restored();
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
        this.drawPath(instruction, (path: StateChangingInstructionSetWithCurrentPath, _instruction: Instruction, state: InfiniteCanvasState) => {
            return path.fillPath(_instruction, state);
        });
    }
    public strokePath(): void{
        this.drawPath((context: CanvasRenderingContext2D) => {context.stroke();}, (path: StateChangingInstructionSetWithCurrentPath, _instruction: Instruction, state: InfiniteCanvasState) => {
            return path.strokePath(_instruction, state);
        });
    }
    public fillRect(x: number, y: number, w: number, h: number, instruction: Instruction): void{
        this.drawRect(x, y, w, h, instruction, (path: StateChangingInstructionSetWithCurrentPath, _instruction: Instruction, state: InfiniteCanvasState) => {
            return path.fillPath(_instruction, state);
        });
    }

    public strokeRect(x: number, y: number, w: number, h: number): void{
        this.drawRect(x, y, w, h, (context: CanvasRenderingContext2D) => {context.stroke();}, (path: StateChangingInstructionSetWithCurrentPath, _instruction: Instruction, state: InfiniteCanvasState) => {
            return path.strokePath(_instruction, state);
        });
    }
    private drawPath(instruction: Instruction, drawPath: (path: StateChangingInstructionSetWithCurrentPath, instruction: Instruction, state: InfiniteCanvasState) => StateChangingInstructionSetWithPositiveArea): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        const stateIsTransformable: boolean = this.state.current.isTransformable();
        const transformationKind = stateIsTransformable ? TransformationKind.None : TransformationKind.Relative;
        this.state = this.state.currentlyTransformed(stateIsTransformable);
        this.incorporateDrawingInstruction(DrawingInstruction.create({
            instruction,
            build: (currentPath, instruction) => drawPath(currentPath, instruction, this.state),
            transformationKind,
            state: this.state,
            takeClippingRegionIntoAccount: true
        }))
        this.onChange();
    }

    private drawRect(x: number, y: number, w: number, h: number, instruction: Instruction, drawPath: (path: StateChangingInstructionSetWithCurrentPath, instruction: Instruction, state: InfiniteCanvasState) => StateChangingInstructionSetWithPositiveArea): void{
        const stateIsTransformable: boolean = this.state.current.isTransformable();
        const transformationKind = stateIsTransformable ? TransformationKind.None : TransformationKind.Relative;
        const stateToDrawWith: InfiniteCanvasState = this.state.currentlyTransformed(stateIsTransformable);
        this.incorporateDrawingInstruction(DrawingInstruction.create({
            instruction,
            build: (_, instruction) => {
                const pathToDraw = InstructionsWithPath.create(stateToDrawWith, this.rectangle);
                pathToDraw.rect(x, y, w, h, stateToDrawWith);
                return drawPath(pathToDraw, instruction, stateToDrawWith);
            },
            transformationKind,
            state: stateToDrawWith,
            takeClippingRegionIntoAccount: true
        }));
        this.onChange();
	}

    public addDrawing(
        instruction: Instruction,
        area: Area,
        transformationKind: TransformationKind,
        takeClippingRegionIntoAccount: boolean,
        tempStateFn: (state: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): void{
            const state = this.state.currentlyTransformed(false);
            if(transformationKind === TransformationKind.Relative){
                area = area.transform(this.state.current.transformation);
            }
            let tempState: InfiniteCanvasState;
            if(tempStateFn){
                tempState = state.withCurrentState(tempStateFn(state.current));
            }
            this.incorporateDrawingInstruction(DrawingInstruction.create({
                instruction,
                build: (_, instruction) => new InstructionsWithPositiveDrawnArea(ExecutableInstructionWithState.create(state, instruction, this.rectangle), area),
                transformationKind,
                state,
                tempState,
                takeClippingRegionIntoAccount
            }));
            this.onChange();
    }

    public clipPath(instruction: Instruction): void{
        this.clipCurrentPath(instruction);
    }

    private incorporateDrawingInstruction(drawingInstruction: DrawingInstruction): void{
        if(this.currentInstructionsWithPath){
            const recreated = this.currentInstructionsWithPath.recreatePath();
            this.addToPreviousInstructions(drawingInstruction);
            recreated.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
            this.currentInstructionsWithPath = recreated;
        }else{
            this.addToPreviousInstructions(drawingInstruction);
            this.state = this.previousInstructionsWithPath.state;
        }
    }

    private addToPreviousInstructions(drawingInstruction: DrawingInstruction): void{
        const newInstruction = drawingInstruction.build(this.currentInstructionsWithPath, this.rectangle);
        newInstruction.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
        this.previousInstructionsWithPath.add(newInstruction);
    }

    private clipCurrentPath(instruction: Instruction): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        this.currentInstructionsWithPath.clipPath(instruction, this.state);
        this.state = this.currentInstructionsWithPath.state;
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
    private intersects(area: Area): boolean{
        return this.previousInstructionsWithPath.intersects(area);
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
        const latestVisibleState: InfiniteCanvasState = this.previousInstructionsWithPath.state;
        const stackLength = latestVisibleState.stack.length;
        for(let i = 0; i < stackLength; i++){
            context.restore();
        }
    }
}
