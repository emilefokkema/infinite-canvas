import { Area } from "./areas/area";
import { DrawingInstructionDefinition } from "./drawing-instruction-definition";
import { Point } from "./geometry/point";
import { getTempStateFnFromTransformationKind, sequence, useTempState } from "./instruction-utils";
import { Instruction } from "./instructions/instruction";
import { StateChangingInstructionSetWithCurrentPath } from "./interfaces/state-changing-instruction-set-with-current-path";
import { StateChangingInstructionSetWithPositiveArea } from "./interfaces/state-changing-instruction-set-with-positive-area";
import { CanvasRectangle } from "./rectangle/canvas-rectangle";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { Transformation } from "./transformation";
import { TransformationKind } from "./transformation-kind";

export class DrawingInstruction{
    constructor(
        private readonly instruction: Instruction,
        private readonly factory: (currentPath: StateChangingInstructionSetWithCurrentPath, instruction: Instruction) =>  StateChangingInstructionSetWithPositiveArea,
        private readonly takeClippingRegionIntoAccount: boolean,
        private readonly transformationKind: TransformationKind,
        private readonly state: InfiniteCanvasState,
        private readonly tempState: InfiniteCanvasState
    ){

    }
    public build(currentPath: StateChangingInstructionSetWithCurrentPath, rectangle: CanvasRectangle): StateChangingInstructionSetWithPositiveArea{
        const instruction = this.getModifiedInstruction(rectangle);
        const newInstruction = this.factory(currentPath, instruction);
        newInstruction.setArea(this.changeAreaOfDrawing(newInstruction.drawingArea.area, this.tempState || this.state, this.takeClippingRegionIntoAccount))
        return newInstruction;
    }
    private getModifiedInstruction(rectangle: CanvasRectangle): Instruction{
        let instruction = this.instruction;
        let tempStateInstruction = getTempStateFnFromTransformationKind(this.transformationKind, rectangle)
        if(this.tempState){
            const stateChangeInstruction = this.takeClippingRegionIntoAccount
            ? this.state.getInstructionToConvertToStateWithClippedPath(this.tempState, rectangle)
            : this.state.getInstructionToConvertToState(this.tempState, rectangle);
            tempStateInstruction = sequence(tempStateInstruction, stateChangeInstruction)
        }
        instruction = useTempState(instruction, tempStateInstruction)
        return instruction;
    }
    private changeAreaOfDrawing(area: Area, state: InfiniteCanvasState, takeClippingRegionIntoAccount: boolean): Area{
        let result = area;
        if(state.current.shadowBlur !== 0 || !state.current.shadowOffset.equals(Point.origin)){
            const shadowArea = result.expandByDistance(state.current.shadowBlur).transform(Transformation.translation(state.current.shadowOffset.x, state.current.shadowOffset.y))
            result = result.join(shadowArea)
        }
        if(state.current.clippingRegion && takeClippingRegionIntoAccount){
            result = result.intersectWith(state.current.clippingRegion);
        }
        return result;
    }
    public static create(definition: DrawingInstructionDefinition): DrawingInstruction{
        return new DrawingInstruction(
            definition.instruction,
            definition.build,
            definition.takeClippingRegionIntoAccount,
            definition.transformationKind,
            definition.state,
            definition.tempState
        )
    }
}