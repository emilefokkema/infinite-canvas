import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { Instruction } from "./instructions/instruction";
import { InfiniteCanvasStateInstance } from "./state/infinite-canvas-state-instance";
import { PreviousInstructions } from "./instructions/previous-instructions";
import { CurrentPath } from "./interfaces/current-path";
import { InstructionsWithPath } from "./instructions/instructions-with-path";
import { PathInstruction } from "./interfaces/path-instruction";
import { TransformationKind } from "./transformation-kind";
import { Area } from "./areas/area";
import { empty } from "./areas/empty";
import { Position } from "./geometry/position"
import { ExecutableInstructionWithState } from "./instructions/executable-instruction-with-state";
import { InstructionsWithPositiveDrawnArea } from "./instructions/instructions-with-positive-drawn-area";
import { ExecutableStateChangingInstructionSet } from "./interfaces/executable-state-changing-instruction-set";
import { DrawingInstruction } from './drawing-instruction'
import { CanvasRectangle } from "./rectangle/canvas-rectangle";
import { roundRect } from "./rect/round-rect";
import { getRectStrategy} from "./rect/get-rect-strategy";
import { Rect } from './rect/rect'

export class InfiniteCanvasInstructionSet{
    private currentInstructionsWithPath: CurrentPath;
    private previousInstructionsWithPath: PreviousInstructions;
    public state: InfiniteCanvasState;
    constructor(private readonly onChange: () => void){
        this.previousInstructionsWithPath = PreviousInstructions.create();
        this.state = this.previousInstructionsWithPath.state;
    }
    public beginPath(): void{
        const newCurrentPath = InstructionsWithPath.create(this.state);
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
    public resetState(): void{
        this.previousInstructionsWithPath = PreviousInstructions.create();
        this.state = this.previousInstructionsWithPath.state;
        this.currentInstructionsWithPath = undefined;
        this.onChange();
    }
    public allSubpathsAreClosable(): boolean{
        return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.allSubpathsAreClosable();
    }
    public currentPathSurroundsFinitePoint(): boolean{
        return this.currentInstructionsWithPath && this.currentInstructionsWithPath.surroundsFinitePoint();
    }
    public currentSubpathIsClosable(): boolean{
        return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.currentSubpathIsClosable();
    }
    public fillPath(instruction: Instruction): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        const drawingInstruction = DrawingInstruction.forFillingPath(instruction, this.state, () => this.currentInstructionsWithPath)
        this.state = drawingInstruction.state;
        this.incorporateDrawingInstruction(drawingInstruction)
    }
    public strokePath(): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        const drawingInstruction = DrawingInstruction.forStrokingPath((context) => {context.stroke();}, this.state, () => this.currentInstructionsWithPath)
        this.state = drawingInstruction.state;
        this.incorporateDrawingInstruction(drawingInstruction)
    }
    public fillRect(rect: Rect, instruction: Instruction): void{
        const drawingInstruction = rect.fill(this.state, instruction)
        if(!drawingInstruction){
            return
        }
        this.incorporateDrawingInstruction(drawingInstruction);
    }

    public strokeRect(rect: Rect): void{
        const drawingInstruction = rect.stroke(this.state, (context) => {context.stroke();})
        if(!drawingInstruction){
            return
        }
        this.incorporateDrawingInstruction(drawingInstruction);
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
            this.incorporateDrawingInstruction(new DrawingInstruction(
                instruction,
                area,
                (instruction) => {
                    return ExecutableInstructionWithState.create(state, instruction)
                },
                takeClippingRegionIntoAccount,
                transformationKind,
                state,
                tempState
            ));
    }

    public clipPath(instruction: Instruction): void{
        this.clipCurrentPath(instruction);
    }

    private incorporateDrawingInstruction(
        instruction: DrawingInstruction
    ): void{
        const area = instruction.getDrawnArea();
        if(area === empty){
            return;
        }
        const modifiedInstruction = instruction.getModifiedInstruction();
        this.addToPreviousInstructions(modifiedInstruction, area, instruction.build);
        if(!this.currentInstructionsWithPath){
            this.state = this.previousInstructionsWithPath.state;
        }
        this.onChange();
    }

    private addToPreviousInstructions(
        instruction: Instruction,
        area: Area,
        build: (instruction: Instruction) => ExecutableStateChangingInstructionSet
    ): void{
        const newInstruction = new InstructionsWithPositiveDrawnArea(build(instruction), area);
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
    public rect(rect: Rect): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        rect.addSubpaths(this.currentInstructionsWithPath, this.state)
    }
    public roundRect(
        rect: Rect,
		radii: number | DOMPointInit | Iterable<number | DOMPointInit> | undefined
    ): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        roundRect(this.currentInstructionsWithPath, rect, radii, this.state);
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
        const rectStrategy = getRectStrategy(x, y, width, height)
		const rectangle: Area = rectStrategy.getArea();
        if(!rectangle){
            return;
        }
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
    
    public execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle){
        if(this.previousInstructionsWithPath.length){
            this.previousInstructionsWithPath.execute(context, rectangle);
        }
        const latestVisibleState: InfiniteCanvasState = this.previousInstructionsWithPath.state;
        const stackLength = latestVisibleState.stack.length;
        for(let i = 0; i < stackLength; i++){
            context.restore();
        }
    }
}
