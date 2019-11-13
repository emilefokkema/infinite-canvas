import {StateConversion} from "./state-conversion";
import {InfiniteCanvasStateInstance} from "./infinite-canvas-state-instance";
import {ClippedPaths} from "../instructions/clipped-paths";
import {InfiniteCanvasState} from "./infinite-canvas-state";
import {StateChangingInstructionSetWithCurrentState} from "../interfaces/state-changing-instruction-set-with-current-state";
import {Transformation} from "../transformation";

export class StateConversionWithClippedPaths extends StateConversion{
    public changeCurrentInstanceTo(instance: InfiniteCanvasStateInstance): void{
        if(this.newState.current.equals(instance)){
            return;
        }
        if(!StateConversionWithClippedPaths.canConvert(this.newState.current, instance) && this.newState.stack.length > 0){
            this.restore();
            this.save();
        }
        if(instance.clippedPaths){
            const currentState: InfiniteCanvasState = this.newState;
            const currentInstance: InfiniteCanvasStateInstance = currentState.current;
            const previouslyClippedPaths: ClippedPaths = currentInstance.clippedPaths;
            const instanceClippedPathsEqualsPreviouslyClippedPaths: boolean = instance.clippedPaths.equals(previouslyClippedPaths);
            if(instanceClippedPathsEqualsPreviouslyClippedPaths){
                super.changeCurrentInstanceTo(instance);
            }else{
                const instructionsToRecreateClippedPaths: StateChangingInstructionSetWithCurrentState = previouslyClippedPaths
                    ? instance.clippedPaths.recreateStartingFrom(previouslyClippedPaths)
                    : instance.clippedPaths.recreate();
                this.convertToState(instructionsToRecreateClippedPaths.initialState);
                this.addChange({
                    newState: instructionsToRecreateClippedPaths.state,
                    instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                        instructionsToRecreateClippedPaths.execute(context, transformation);
                    }
                });
                this.convertToState(currentState.replaceCurrent(instance));
            }
        }else{
            super.changeCurrentInstanceTo(instance);
        }
    }
    private convertToState(state: InfiniteCanvasState): void{
        this.change(s => s.convertToState(state));
    }
    private static canConvert(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): boolean{
        if(fromInstance.clippedPaths){
            if(toInstance.clippedPaths){
                return toInstance.clippedPaths.contains(fromInstance.clippedPaths);
            }
            return false;
        }else{
            return true;
        }
    }
}