import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { Instruction } from "./instructions/instruction";
import { InfiniteCanvasStateInstance } from "./state/infinite-canvas-state-instance";
import { PreviousInstructions } from "./instructions/previous-instructions";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "./interfaces/state-changing-instruction-set-with-area-and-current-path";
import { StateChangingInstructionSetWithArea } from "./interfaces/state-changing-instruction-set-with-area";
import { InstructionsWithPath } from "./instructions/instructions-with-path";
import { PathInstruction } from "./interfaces/path-instruction";
import { Rectangle } from "./rectangle";
import { TransformationKind } from "./transformation-kind";
import { RectangularDrawing } from "./instructions/rectangular-drawing";
import { Transformation } from "./transformation";
import { transformInstructionRelatively, transformInstructionAbsolutely } from "./instruction-utils";

export class InfiniteCanvasInstructionSet{
    private currentInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPath;
    private previousInstructionsWithPath: PreviousInstructions;
    public state: InfiniteCanvasState;
    private instructionToRestoreState: Instruction;
    constructor(private readonly onChange: () => void){
        this.previousInstructionsWithPath = PreviousInstructions.create();
        this.state = this.previousInstructionsWithPath.state;
    }
    public beginPath(): void{
        this.replaceCurrentInstructionsWithPath(InstructionsWithPath.create(this.state));
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

    private drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
        if(pathInstructions){
            this.drawPathInstructions(pathInstructions, instruction);
        }else{
            this.drawCurrentPath(instruction);
        }
        this.onChange();
    }
    public fillPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
        const stateIsTransformable: boolean = this.state.current.isTransformable();
        if(!stateIsTransformable){
            instruction = transformInstructionRelatively(instruction);
        }
		this.drawPath(instruction, pathInstructions);
	}
	public strokePath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
        const stateIsTransformable: boolean = this.state.current.isTransformable();
        if(!stateIsTransformable){
            instruction = transformInstructionRelatively(instruction);
        }
		this.drawPath(instruction, pathInstructions);
	}
    public addDrawing(instruction: Instruction, area: Rectangle, transformationKind: TransformationKind): void{
        if(transformationKind === TransformationKind.Relative){
			instruction = transformInstructionRelatively(instruction);
			area = area.transform(this.state.current.transformation);
		}else if(transformationKind === TransformationKind.Absolute){
			instruction = transformInstructionAbsolutely(instruction);
        }
        const drawing: RectangularDrawing = RectangularDrawing.createDrawing(this.state.currentlyTransformed(false), instruction, area);
        this.drawBeforeCurrentPath(drawing);
        this.onChange();
    }

    public clipPath(instruction: Instruction): void{
        this.clipCurrentPath(instruction);
    }

    private replaceCurrentInstructionsWithPath(newInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPath, ...instructionsToInterject: StateChangingInstructionSetWithArea[]): void{
        if(this.currentInstructionsWithPath){
            if(this.currentInstructionsWithPath.visible){
                this.previousInstructionsWithPath.add(this.currentInstructionsWithPath);
            }
        }
        for(const instructionToInterject of instructionsToInterject){
            instructionToInterject.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
            this.previousInstructionsWithPath.add(instructionToInterject);
        }
        newInstructionsWithPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
        this.currentInstructionsWithPath = newInstructionsWithPath;
        this.setInstructionToRestoreState();
    }

    private drawCurrentPath(instruction: Instruction): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        this.state = this.state.currentlyTransformed(this.state.current.isTransformable());
        this.currentInstructionsWithPath.drawPath(instruction, this.state);
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
        const latestVisibleState: InfiniteCanvasState = this.currentInstructionsWithPath && this.currentInstructionsWithPath.visible ? this.currentInstructionsWithPath.state : this.previousInstructionsWithPath.state;
        this.instructionToRestoreState = latestVisibleState.getInstructionToClearStack();
    }

    private drawPathInstructions(pathInstructions: PathInstruction[], instruction: Instruction): void{
        const stateToDrawWith: InfiniteCanvasState = this.state.currentlyTransformed(this.state.current.isTransformable());
        const pathToDraw: StateChangingInstructionSetWithAreaAndCurrentPath = InstructionsWithPath.create(stateToDrawWith, pathInstructions);
        pathToDraw.drawPath(instruction, stateToDrawWith);
        this.drawBeforeCurrentPath(pathToDraw);
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

    public intersects(area: Rectangle): boolean{
        return this.previousInstructionsWithPath.intersects(area) || this.currentInstructionsWithPath && this.currentInstructionsWithPath.intersects(area);
    }

    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return this.previousInstructionsWithPath.hasDrawingAcrossBorderOf(area) || this.currentInstructionsWithPath && this.currentInstructionsWithPath.hasDrawingAcrossBorderOf(area);
    }

    public clearContentsInsideArea(area: Rectangle): void{
        if(this.currentInstructionsWithPath){
            this.previousInstructionsWithPath.clearContentsInsideArea(area);
            this.currentInstructionsWithPath.clearContentsInsideArea(area);
            this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
        }else{
            this.previousInstructionsWithPath.clearContentsInsideArea(area);
        }
    }

    public clearArea(x: number, y: number, width: number, height: number): void{
        const rectangle: Rectangle = new Rectangle(x, y, width, height).transform(this.state.current.transformation);
        if(!this.intersects(rectangle)){
            return;
        }
        this.clearContentsInsideArea(rectangle);
        if(this.currentInstructionsWithPath && this.currentInstructionsWithPath.hasDrawingAcrossBorderOf(rectangle)){
            this.currentInstructionsWithPath.addClearRect(rectangle);
        }else if(this.previousInstructionsWithPath.hasDrawingAcrossBorderOf(rectangle)){
            this.previousInstructionsWithPath.addClearRect(rectangle);
        }
		this.onChange();
    }
    
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(this.previousInstructionsWithPath.length || this.currentInstructionsWithPath && this.currentInstructionsWithPath.visible){
            this.previousInstructionsWithPath.execute(context, transformation);
        }
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.execute(context, transformation);
        }
        if(this.instructionToRestoreState){
            this.instructionToRestoreState(context, transformation);
        }
    }
}
