import {StateConversion} from "./state-conversion";
import {InfiniteCanvasStateInstance} from "./infinite-canvas-state-instance";
import {ClippedPaths} from "../instructions/clipped-paths";
import {InfiniteCanvasState} from "./infinite-canvas-state";
import {Transformation} from "../transformation";
import { Instruction } from "../instructions/instruction";
import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
import { rectangleHasArea } from "../geometry/rectangle-has-area";

export class StateConversionWithClippedPaths extends StateConversion{
    public changeCurrentInstanceTo(instance: InfiniteCanvasStateInstance, rectangle: CanvasRectangle): void{
        if(this.currentState.current.equals(instance)){
            return;
        }
        if(!StateConversionWithClippedPaths.canConvert(this.currentState.current, instance)){
            if(this.currentState.stack.length > 0){
                this.restore();
                this.save();
            }else{
                super.changeCurrentInstanceTo(instance, rectangle);
                return;
            }
        }
        if(instance.clippedPaths){
            const currentState: InfiniteCanvasState = this.currentState;
            const currentInstance: InfiniteCanvasStateInstance = currentState.current;
            const previouslyClippedPaths: ClippedPaths = currentInstance.clippedPaths;
            const instanceClippedPathsEqualsPreviouslyClippedPaths: boolean = instance.clippedPaths === previouslyClippedPaths;
            if(instanceClippedPathsEqualsPreviouslyClippedPaths){
                super.changeCurrentInstanceTo(instance, rectangle);
            }else{
                const clippedPathsToRecreate: ClippedPaths = instance.clippedPaths.except(previouslyClippedPaths);
                this.convertToState(clippedPathsToRecreate.initialState, rectangle);
                this.addChangeToState(clippedPathsToRecreate.latestClippedPath.state, clippedPathsToRecreate.getInstructionToRecreate(rectangle));
                this.convertToState(currentState.replaceCurrent(instance), rectangle);
            }
        }else{
            super.changeCurrentInstanceTo(instance, rectangle);
        }
    }
    private convertToState(state: InfiniteCanvasState, rectangle: CanvasRectangle): void{
        const instructionToConvert: Instruction = this.currentState.getInstructionToConvertToState(state, rectangle);
        this.addChangeToState(state, instructionToConvert);
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
