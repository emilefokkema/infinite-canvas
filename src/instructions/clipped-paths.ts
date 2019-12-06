import { InfiniteCanvasStatesAndInstructions } from "./infinite-canvas-states-and-instructions";
import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { InstructionAndState } from "../interfaces/instruction-and-state";
import {StateChangingInstructionSetWithCurrentState} from "../interfaces/state-changing-instruction-set-with-current-state";
import {Rectangle} from "../rectangle";
import {StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState} from "../interfaces/state-changing-instruction-set-with-area-and-current-path";

export class ClippedPaths {
    constructor(public area: Rectangle, public latestClippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState, public readonly previouslyClippedPaths?: ClippedPaths){}
    public withClippedPath(latestClippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState): ClippedPaths{
        const newArea: Rectangle = latestClippedPath.getClippedArea(this.area);
        return new ClippedPaths(newArea, latestClippedPath, this);
    }
    private getAllInstructionsAndStates(): InstructionAndState[]{
        const instructionsAndStatesFromLatestClippedPath: InstructionAndState[] = this.latestClippedPath.getAllInstructionsAndStates();
        const instructionsAndStatesFromPreviouslyClippedPaths: InstructionAndState[] = this.previouslyClippedPaths ? this.previouslyClippedPaths.getAllInstructionsAndStates() : [];
        const result: InstructionAndState[] = [];
        for(const instructionAndState of instructionsAndStatesFromPreviouslyClippedPaths.concat(instructionsAndStatesFromLatestClippedPath)){
            if(!result.find(is => is.instruction === instructionAndState.instruction)){
                result.push(instructionAndState);
            }
        }
        return result;
    }
    public equals(other: ClippedPaths): boolean{
        if(!other){
            return false;
        }
        if(this.latestClippedPath !== other.latestClippedPath){
            return false;
        }
        if(this.previouslyClippedPaths){
            return this.previouslyClippedPaths.equals(other.previouslyClippedPaths);
        }
        return !other.previouslyClippedPaths;
    }
    public contains(other: ClippedPaths): boolean{
        if(!other){
            return false;
        }
        if(this.equals(other)){
            return true;
        }
        if(this.previouslyClippedPaths){
            return this.previouslyClippedPaths.contains(other);
        }
        return false;
    }
    private createFromInstructionsAndStates(instructionsAndStates: InstructionAndState[]): StateChangingInstructionSetWithCurrentState{
        let result: InfiniteCanvasStatesAndInstructions;
        for(const instructionAndStateFromThis of instructionsAndStates){
            if(!result){
                result = InfiniteCanvasStatesAndInstructions.create(instructionAndStateFromThis.state, instructionAndStateFromThis.instruction);
            }else{
                const toAdd: InfiniteCanvasStateAndInstruction = InfiniteCanvasStateAndInstruction.create(instructionAndStateFromThis.state, instructionAndStateFromThis.instruction);
                result.changeToState(toAdd.initialState);
                result.add(toAdd);
            }
        }
        return result;
    }
    public recreate(): StateChangingInstructionSetWithCurrentState{
        return this.createFromInstructionsAndStates(this.getAllInstructionsAndStates());
    }
    public recreateStartingFrom(other: ClippedPaths): StateChangingInstructionSetWithCurrentState{
        const allInstructionsAndStatesFromOther: InstructionAndState[] = other.getAllInstructionsAndStates();
        const allInstructionsAndStatesFromThis: InstructionAndState[] = this.getAllInstructionsAndStates();
        const instructionsAndStatesFromThisNotFromOther: InstructionAndState[] = allInstructionsAndStatesFromThis.filter(fromThis => !allInstructionsAndStatesFromOther.find(fromOther => fromOther.instruction === fromThis.instruction));
        return this.createFromInstructionsAndStates(instructionsAndStatesFromThisNotFromOther);
    }
}