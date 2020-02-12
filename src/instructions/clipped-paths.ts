import { InstructionAndState } from "../interfaces/instruction-and-state";
import {Rectangle} from "../rectangle";
import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { InfiniteCanvasStatesAndInstructions } from "./infinite-canvas-states-and-instructions";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";

export class ClippedPaths {
    constructor(public area: Rectangle, public latestClippedPath: StateChangingInstructionSetWithAreaAndCurrentPath, public readonly previouslyClippedPaths?: ClippedPaths){}
    public withClippedPath(latestClippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): ClippedPaths{
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

    public contains(other: ClippedPaths): boolean{
        if(!other){
            return false;
        }
        if(this === other){
            return true;
        }
        if(this.previouslyClippedPaths){
            return this.previouslyClippedPaths.contains(other);
        }
        return false;
    }
    private createFromInstructionsAndStates(instructionsAndStates: InstructionAndState[]): StateChangingInstructionSet{
        let result: InfiniteCanvasStatesAndInstructions;
        for(const instructionAndStateFromThis of instructionsAndStates){
            if(!result){
                result = InfiniteCanvasStatesAndInstructions.create(instructionAndStateFromThis.state, instructionAndStateFromThis.instruction);
            }else{
                const toAdd: StateAndInstruction = StateAndInstruction.create(instructionAndStateFromThis.state, instructionAndStateFromThis.instruction);
                toAdd.setInitialState(result.state);
                result.add(toAdd);
            }
        }
        return result;
    }
    public recreate(): StateChangingInstructionSet{
        return this.createFromInstructionsAndStates(this.getAllInstructionsAndStates());
    }
    public recreateStartingFrom(other: ClippedPaths): StateChangingInstructionSet{
        const allInstructionsAndStatesFromOther: InstructionAndState[] = other.getAllInstructionsAndStates();
        const allInstructionsAndStatesFromThis: InstructionAndState[] = this.getAllInstructionsAndStates();
        const instructionsAndStatesFromThisNotFromOther: InstructionAndState[] = allInstructionsAndStatesFromThis.filter(fromThis => !allInstructionsAndStatesFromOther.find(fromOther => fromOther.instruction === fromThis.instruction));
        return this.createFromInstructionsAndStates(instructionsAndStatesFromThisNotFromOther);
    }
}