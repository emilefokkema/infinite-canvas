import { PathInstructionBuilder } from "../path-instruction-builder";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { AtInfinity } from "./at-infinity";
import { FromPointAtInfinityToPoint } from "../from-point-at-infinity-to-point/from-point-at-infinity-to-point";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { sequence } from "../../../instruction-utils";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { CanvasRectangle } from "../../../rectangle/canvas-rectangle";
import { InstructionUsingInfinity, noopInstruction } from '../../instruction'

class AddPathAroundViewbox implements InstructionUsingInfinity {
    constructor(
        private readonly counterclockwise: boolean
    ){
        
    }

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity): void {
        infinity.addPathAroundViewbox(context, rectangle, this.counterclockwise)
    }
}
export class PathInstructionBuilderAtInfinity extends InfiniteCanvasPathInstructionBuilder<AtInfinity> implements PathInstructionBuilder{
    constructor(private readonly pathBuilderProvider: PathInstructionBuilderProvider, shape: AtInfinity){
        super(shape);
    }
    protected getInstructionToMoveToBeginningOfShape(shape: AtInfinity): InstructionUsingInfinity {
        if(shape.surroundsFinitePoint){
            return new AddPathAroundViewbox(shape.direction === 'counterclockwise')
        }
        return noopInstruction;
    }
    protected getInstructionToExtendShapeWithLineTo(shape: AtInfinity, position: Position): InstructionUsingInfinity {
        if(isPointAtInfinity(position)){
            return undefined;
        }
        if(shape.positionsSoFar.length === 1){
            return this.lineFromInfinityFromPointToPoint(position, shape.positionsSoFar[0].direction);
        }
        const pointsAtInfinityToLineTo: PointAtInfinity[] = shape.positionsSoFar.slice(1);
        let positionToLineFrom: PointAtInfinity = shape.initialPosition;
        const instructionsToCombine: InstructionUsingInfinity[] = [];
        for(let pointAtInfinityToLineTo of pointsAtInfinityToLineTo){
            instructionsToCombine.push(this.lineToInfinityFromInfinityFromPoint(position, positionToLineFrom.direction, pointAtInfinityToLineTo.direction));
            positionToLineFrom = pointAtInfinityToLineTo;
        }
        return sequence(sequence(...instructionsToCombine), this.lineFromInfinityFromPointToPoint(position, positionToLineFrom.direction))
    }
    public canAddLineTo(position: Position): boolean{
        return !isPointAtInfinity(position) || !position.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
    }
    public containsFinitePoint(): boolean{
        return false;
    }
    public surroundsFinitePoint(): boolean{
        return this.shape.surroundsFinitePoint;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathInstructionBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.atInfinity(this.shape.addPosition(position));
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(new FromPointAtInfinityToPoint(this.shape.initialPosition, position, position));
    }
}
