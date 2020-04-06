import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { Area } from "../areas/area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Transformation } from "../transformation";
import { instructionSequence } from "../instruction-utils";

export class ClippedPaths {
    constructor(public area: Area, public latestClippedPath: StateChangingInstructionSet, public readonly previouslyClippedPaths?: ClippedPaths){}
    public withClippedPath(latestClippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): ClippedPaths{
        const newArea: Area = latestClippedPath.getClippedArea(this.area);
        return new ClippedPaths(newArea, latestClippedPath, this);
    }
    public get initialState(): InfiniteCanvasState{
        return this.previouslyClippedPaths ? this.previouslyClippedPaths.initialState : this.latestClippedPath.initialState;
    }
    public except(other: ClippedPaths): ClippedPaths{
        if(other === this){
            return undefined;
        }
        if(this.previouslyClippedPaths){
            return new ClippedPaths(this.area, this.latestClippedPath, this.previouslyClippedPaths.except(other))
        }
        return this;
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
    public getInstructionToRecreate(): Instruction{
        const instructionToRecreateLatest: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            this.latestClippedPath.execute(context, transformation);
        };
        if(this.previouslyClippedPaths){
            const instructionToRecreatePrevious: Instruction = this.previouslyClippedPaths.getInstructionToRecreate();
            const instructionToConvertToLatest: Instruction = this.previouslyClippedPaths.latestClippedPath.state.getInstructionToConvertToState(this.latestClippedPath.initialState);
            return (context: CanvasRenderingContext2D, transformation: Transformation) => {
                instructionToRecreatePrevious(context, transformation);
                instructionToConvertToLatest(context, transformation);
                instructionToRecreateLatest(context, transformation);
            };
        }
        return instructionToRecreateLatest;
    }
}
