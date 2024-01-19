import { InstructionsToClip } from "../interfaces/instructions-to-clip";
import { Area } from "../areas/area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class ClippedPaths {
    constructor(public area: Area, public latestClippedPath: InstructionsToClip, public readonly previouslyClippedPaths?: ClippedPaths){}
    public withClippedPath(latestClippedPath: InstructionsToClip): ClippedPaths{
        const newArea: Area = latestClippedPath.area.intersectWith(this.area);
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
        const instructionToRecreateLatest: Instruction = (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
            this.latestClippedPath.execute(context, rectangle);
        };
        if(this.previouslyClippedPaths){
            const instructionToRecreatePrevious: Instruction = this.previouslyClippedPaths.getInstructionToRecreate();
            const instructionToConvertToLatest: Instruction = this.previouslyClippedPaths.latestClippedPath.state.getInstructionToConvertToState(this.latestClippedPath.initialState);
            return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
                instructionToRecreatePrevious(context, rectangle);
                instructionToConvertToLatest(context, rectangle);
                instructionToRecreateLatest(context, rectangle);
            };
        }
        return instructionToRecreateLatest;
    }
}
