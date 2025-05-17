import { Instruction } from "./instructions/instruction"
import { ExecutableStateChangingInstructionSet } from './interfaces/executable-state-changing-instruction-set'
import { InfiniteCanvasState } from "./state/infinite-canvas-state"
import { TransformationKind } from "./transformation-kind"
import { Area } from './areas/area'
import { Point } from "./geometry/point"
import { Transformation } from "./transformation"
import { getTempStateFnFromTransformationKind, sequence, useTempState } from "./instruction-utils"
import { DrawnPathProperties } from "./interfaces/drawn-path-properties"
import { DrawablePath } from "./interfaces/drawable-path"

function getAreaOfPath(path: DrawablePath, drawnPathProperties: DrawnPathProperties): Area{
    let newlyDrawnArea: Area = path.area
    if(newlyDrawnArea && drawnPathProperties.lineWidth > 0){
        newlyDrawnArea = newlyDrawnArea.expandByDistance(drawnPathProperties.lineWidth / 2)
    }
    return newlyDrawnArea;
}

function getDrawnPathPropertiesWhenStroked(state: InfiniteCanvasState): DrawnPathProperties{
    return {
        lineWidth: state.current.getMaximumLineWidth(),
        lineDashPeriod: state.current.getLineDashPeriod(),
        shadowOffsets: state.current.getShadowOffsets()
    };
}

function getDrawnPathPropertiesWhenFilled(state: InfiniteCanvasState): DrawnPathProperties{
    return {
        lineWidth: 0,
        lineDashPeriod: 0,
        shadowOffsets: state.current.getShadowOffsets()
    };
}

export class DrawingInstruction{
    constructor(
        private readonly instruction: Instruction,
        private readonly area: Area,
        public readonly build: (instruction: Instruction) => ExecutableStateChangingInstructionSet,
        private readonly takeClippingRegionIntoAccount: boolean,
        private readonly transformationKind: TransformationKind,
        public readonly state: InfiniteCanvasState,
        private readonly tempState?: InfiniteCanvasState
    ){

    }
    public static forStrokingPath(
        instruction: Instruction,
        state: InfiniteCanvasState,
        getPath: (state: InfiniteCanvasState) => DrawablePath): DrawingInstruction{
            return DrawingInstruction.forPath(instruction, state, getDrawnPathPropertiesWhenStroked, getPath);
    }
    public static forFillingPath(
        instruction: Instruction,
        state: InfiniteCanvasState,
        getPath: (state: InfiniteCanvasState) => DrawablePath): DrawingInstruction{
            return DrawingInstruction.forPath(instruction, state, getDrawnPathPropertiesWhenFilled, getPath);
    }
    private static forPath(
        instruction: Instruction,
        state: InfiniteCanvasState,
        getDrawnPathProperties: (state: InfiniteCanvasState) => DrawnPathProperties,
        getPath: (state: InfiniteCanvasState) => DrawablePath): DrawingInstruction{
            const stateIsTransformable: boolean = state.current.isTransformable();
            const transformationKind = stateIsTransformable ? TransformationKind.None : TransformationKind.Relative;
            const stateToDrawWith: InfiniteCanvasState = state.currentlyTransformed(stateIsTransformable);
            const drawnPathProperties = getDrawnPathProperties(stateToDrawWith);
            const pathToDraw = getPath(stateToDrawWith);
            const areaToDraw = getAreaOfPath(pathToDraw, drawnPathProperties);
            return new DrawingInstruction(
                instruction,
                areaToDraw,
                (instruction) => {
                    const drawn = pathToDraw.drawPath(instruction, stateToDrawWith, drawnPathProperties)
                    return drawn;
                },
                true,
                transformationKind,
                stateToDrawWith
            )
    }
    public getDrawnArea(): Area{
        let result = this.area;
        const state = this.state;
        if(state.current.shadowBlur !== 0 || !state.current.shadowOffset.equals(Point.origin)){
            const shadowArea = result.expandByDistance(state.current.shadowBlur).transform(Transformation.translation(state.current.shadowOffset.x, state.current.shadowOffset.y))
            result = result.join(shadowArea)
        }
        if(state.current.clippingRegion && this.takeClippingRegionIntoAccount){
            result = result.intersectWith(state.current.clippingRegion);
        }
        return result;
    }
    public getModifiedInstruction(): Instruction{
        let tempStateInstruction = getTempStateFnFromTransformationKind(this.transformationKind)
        if(this.tempState){
            const stateChangeInstruction = this.takeClippingRegionIntoAccount
            ? this.state.getInstructionToConvertToStateWithClippedPath(this.tempState)
            : this.state.getInstructionToConvertToState(this.tempState);
            tempStateInstruction = sequence(tempStateInstruction, stateChangeInstruction)
        }
        const instruction = useTempState(this.instruction, tempStateInstruction)
        return instruction;
    }
}