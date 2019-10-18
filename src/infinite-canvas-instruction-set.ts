import { InstructionsWithPath } from "./instructions/instructions-with-path";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "./state/infinite-canvas-state-instance";
import { StateChange } from "./state/state-change";
import { Instruction } from "./instructions/instruction";
import { Transformation } from "./transformation";
import { DefaultInstructionsWithState } from "./instructions/default-instructions-with-state";
import { Rectangle } from "./rectangle";
import { PathInstruction } from "./interfaces/path-instruction";
import { InstructionsWithStateAndArea } from "./instructions/instructions-with-state-and-area";
import { PathInstructions } from "./instructions/path-instructions";
import { StateChangingInstructionSet } from "./interfaces/state-changing-instruction-set";
import { StateChangingInstructionSetWithArea } from "./interfaces/state-changing-instruction-set-with-area";
import { CurrentState } from "./interfaces/current-state";
import { StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState } from "./interfaces/state-changing-instruction-set-with-area-and-current-path";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "./interfaces/state-changing-instruction-set-with-current-state-and-area";

export class InfiniteCanvasInstructionSet {
    private initialInstructionsWithState: StateChangingInstructionSet;
    private currentInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState;
    private currentInstructionsWithPathAreVisible: boolean = false;
    private previousInstructionsWithPath: StateChangingInstructionSetWithArea[] = [];
    private currentlyWithState: CurrentState;
    private lastBeforeCurrentPath: StateChangingInstructionSet;
    constructor(private readonly onChange: () => void){
        const defaultInstructions: DefaultInstructionsWithState = new DefaultInstructionsWithState();
        this.initialInstructionsWithState = defaultInstructions;
        this.currentlyWithState = defaultInstructions;
        this.lastBeforeCurrentPath = this.initialInstructionsWithState;
    }
    public get state(): InfiniteCanvasState{return this.currentlyWithState.state;}
    private get drawCurrentInstructionsWithPath(): boolean{
        return this.currentInstructionsWithPath && this.currentInstructionsWithPathAreVisible;
    }
    public beginPath(): void{
        if(this.currentInstructionsWithPath){
            this.lastBeforeCurrentPath = this.currentInstructionsWithPath;
            this.previousInstructionsWithPath.push(this.currentInstructionsWithPath);
        }
        this.currentInstructionsWithPath = InstructionsWithPath.create(this.currentlyWithState.state);
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
        if(this.currentInstructionsWithPath){
            withStateAndArea.changeToState(this.currentInstructionsWithPath.initialState);
        }else{
            this.currentlyWithState = withStateAndArea;
        }
        this.lastBeforeCurrentPath.changeToState(withStateAndArea.initialState);
        this.lastBeforeCurrentPath = withStateAndArea;
        this.previousInstructionsWithPath.push(withStateAndArea);
    }
    private createDrawnPath(instruction: Instruction, pathInstructions: PathInstruction[]): StateChangingInstructionSetWithCurrentStateAndArea{
        const currentState: InfiniteCanvasState = this.currentlyWithState.state;
        const instructionsWithPath: InstructionsWithPath = InstructionsWithPath.create(currentState, pathInstructions);
        instructionsWithPath.drawPath(instruction);
        return instructionsWithPath;
    }
    public drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
        if(pathInstructions){
            this.interjectWithStateAndArea(this.createDrawnPath(instruction, pathInstructions));
        }
        else if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.drawPath(instruction);
            this.currentInstructionsWithPathAreVisible = true;
        }
        this.onChange();
    }

    public addPathInstruction(pathInstruction: PathInstruction): void{
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.addPathInstruction(pathInstruction);
        }
    }
    private removePreviousInstructionsWithPathAtIndex(index: number): void{
        const thisOne: StateChangingInstructionSet = this.previousInstructionsWithPath[index];
        const theOneBefore: StateChangingInstructionSet = index === 0 ? this.initialInstructionsWithState : this.previousInstructionsWithPath[index - 1];
        if(thisOne === this.lastBeforeCurrentPath){
            this.lastBeforeCurrentPath = theOneBefore;
        }
        const theOneAfter: StateChangingInstructionSet = index === this.previousInstructionsWithPath.length - 1 ? this.currentInstructionsWithPath : this.previousInstructionsWithPath[index + 1];
        const stateToChangeTo: InfiniteCanvasState = theOneAfter ? theOneAfter.initialState : this.currentlyWithState.state;
        theOneBefore.changeToState(stateToChangeTo);
        this.previousInstructionsWithPath.splice(index, 1);
    }

    public clearArea(x: number, y: number, width: number, height: number): void{
        const rectangle: Rectangle = new Rectangle(x, y, width, height).transform(this.currentlyWithState.state.current.transformation);
		let indexContainedInstruction: number;
        let somethingWasDone: boolean = false;
        let clearRectWasAdded: boolean = false;
		while((indexContainedInstruction = this.previousInstructionsWithPath.findIndex(i => i.area && rectangle.contains(i.area))) > -1){
			somethingWasDone = true;
			this.removePreviousInstructionsWithPathAtIndex(indexContainedInstruction);
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
		if(!clearRectWasAdded && this.previousInstructionsWithPath.find(i => i.area && rectangle.intersects(i.area))){
            somethingWasDone = true;
            this.interjectWithStateAndArea(new InstructionsWithStateAndArea(this.currentlyWithState.state, clearRectPathInstruction));
		}
		if(somethingWasDone){
			this.onChange();
		}
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(this.previousInstructionsWithPath.length || this.drawCurrentInstructionsWithPath){
            this.initialInstructionsWithState.execute(context, transformation);
        }
        for(const previous of this.previousInstructionsWithPath){
            previous.execute(context, transformation);
        }
        if(this.drawCurrentInstructionsWithPath){
            this.currentInstructionsWithPath.execute(context, transformation);
        }
        for(let i = 0; i < this.currentlyWithState.state.stack.length; i++){
            context.restore();
        }
    }
}