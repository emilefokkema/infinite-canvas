import { InstructionsWithPath } from "./instructions/instructions-with-path";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "./state/infinite-canvas-state-instance";
import { StateChange } from "./state/state-change";
import { Instruction } from "./instructions/instruction";
import { Transformation } from "./transformation";
import { Rectangle } from "./rectangle";
import { PathInstruction } from "./interfaces/path-instruction";
import { InstructionsWithStateAndArea } from "./instructions/instructions-with-state-and-area";
import { PathInstructions } from "./instructions/path-instructions";
import { CurrentState } from "./interfaces/current-state";
import { StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState } from "./interfaces/state-changing-instruction-set-with-area-and-current-path";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "./interfaces/state-changing-instruction-set-with-current-state-and-area";
import { StateChangingInstructionSequence } from "./instructions/state-changing-instruction-sequence";

export class InfiniteCanvasInstructionSet {
    private currentInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState;
    private currentInstructionsWithPathAreVisible: boolean = false;
    private previousInstructionsWithPath: StateChangingInstructionSequence<StateChangingInstructionSetWithCurrentStateAndArea>;
    private currentlyWithState: CurrentState;
    constructor(private readonly onChange: () => void){
        this.previousInstructionsWithPath = new StateChangingInstructionSequence(InfiniteCanvasState.default, InfiniteCanvasStateInstance.setDefault);
        this.currentlyWithState = this.previousInstructionsWithPath;
    }
    public get state(): InfiniteCanvasState{return this.currentlyWithState.state;}
    private get drawCurrentInstructionsWithPath(): boolean{
        return this.currentInstructionsWithPath && this.currentInstructionsWithPathAreVisible;
    }
    public beginPath(): void{
        if(this.currentInstructionsWithPath){
            this.previousInstructionsWithPath.add(this.currentInstructionsWithPath);
        }
        this.currentInstructionsWithPath = InstructionsWithPath.create(this.state);
        this.currentlyWithState = this.currentInstructionsWithPath;
    }
    public changeState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void{
        this.currentlyWithState.changeState(change);
    }
    public saveState(): void{
        this.currentlyWithState.saveState();
    }
    public restoreState(): void{
        this.currentlyWithState.restoreState();
    }
    private interjectWithStateAndArea(withStateAndArea: StateChangingInstructionSetWithCurrentStateAndArea): void{
        this.previousInstructionsWithPath.add(withStateAndArea);
        if(this.currentInstructionsWithPath){
            this.previousInstructionsWithPath.changeToState(this.currentInstructionsWithPath.initialState);
        }
    }

    public drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
        if(pathInstructions){
            this.drawPathInstructions(pathInstructions, instruction);
        }else{
            this.drawCurrentPath(instruction);
        }
        this.onChange();
    }

    private drawCurrentPath(instruction: Instruction){
        if(!this.currentInstructionsWithPath){
            return;
        }
        this.currentInstructionsWithPath.drawPath(instruction);
        this.currentInstructionsWithPathAreVisible = true;
    }

    private drawPathInstructions(pathInstructions: PathInstruction[], instruction: Instruction): void{
        const pathToDraw: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = InstructionsWithPath.create(this.state, pathInstructions);
        pathToDraw.drawPath(instruction);
        this.interjectWithStateAndArea(pathToDraw);
    }

    public addPathInstruction(pathInstruction: PathInstruction): void{
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.addPathInstruction(pathInstruction);
        }
    }

    public clearArea(x: number, y: number, width: number, height: number): void{
        const rectangle: Rectangle = new Rectangle(x, y, width, height).transform(this.currentlyWithState.state.current.transformation);
        let somethingWasDone: boolean = false;
        let clearRectWasAdded: boolean = false;
        if(this.previousInstructionsWithPath.contains(i => i.area && rectangle.contains(i.area))){
            this.previousInstructionsWithPath.removeAll(i => i.area && rectangle.contains(i.area));
            somethingWasDone = true;
        }
        const clearRectPathInstruction: PathInstruction = PathInstructions.clearRect(x, y, width, height);
        if(this.drawCurrentInstructionsWithPath && this.currentInstructionsWithPath.area){
            if(rectangle.contains(this.currentInstructionsWithPath.area)){
                this.currentInstructionsWithPathAreVisible = false;
                somethingWasDone = true;
            }else if(rectangle.intersects(this.currentInstructionsWithPath.area)){
                this.currentInstructionsWithPath.addPathInstruction(clearRectPathInstruction);
                somethingWasDone = true;
                clearRectWasAdded = true;
            }
        }
		if(!clearRectWasAdded && this.previousInstructionsWithPath.contains(i => i.area && rectangle.intersects(i.area))){
            somethingWasDone = true;
            this.interjectWithStateAndArea(new InstructionsWithStateAndArea(this.currentlyWithState.state, clearRectPathInstruction));
		}
		if(somethingWasDone){
			this.onChange();
		}
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(this.previousInstructionsWithPath.length || this.drawCurrentInstructionsWithPath){
            this.previousInstructionsWithPath.execute(context, transformation);
        }
        if(this.drawCurrentInstructionsWithPath){
            this.currentInstructionsWithPath.execute(context, transformation);
        }
        for(let i = 0; i < this.currentlyWithState.state.stack.length; i++){
            context.restore();
        }
    }
}