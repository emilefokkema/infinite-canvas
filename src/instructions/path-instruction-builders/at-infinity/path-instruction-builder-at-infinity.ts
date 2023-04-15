import { PathInstructionBuilder } from "../path-instruction-builder";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
import { AtInfinity } from "./at-infinity";
import { FromPointAtInfinityToPoint } from "../from-point-at-infinity-to-point/from-point-at-infinity-to-point";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { sequence } from "../../../instruction-utils";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { Transformation } from "../../../transformation";

export class PathInstructionBuilderAtInfinity extends InfiniteCanvasPathInstructionBuilder<AtInfinity> implements PathInstructionBuilder{
    constructor(private readonly pathBuilderProvider: PathInstructionBuilderProvider, shape: AtInfinity){
        super(shape);
    }
    protected getInstructionToMoveToBeginningOfShape(shape: AtInfinity): InstructionUsingInfinity{
        if(shape.containsFinitePoint){
            return (context: CanvasRenderingContext2D, transformation: Transformation, infinity: ViewboxInfinity) => infinity.addPathAroundViewbox(context)
        }
        return () => {};
    }
    protected getInstructionToExtendShapeWithLineTo(shape: AtInfinity, position: Position): InstructionUsingInfinity{
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
        return this.shape.containsFinitePoint;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathInstructionBuilder{
        if(isPointAtInfinity(position)){
            const newDirectionOnSameSideAsOrigin: boolean = position.direction.isOnSameSideOfOriginAs(this.shape.initialPosition.direction, this.shape.currentPosition.direction);
            const newContainsFinitePoint: boolean = newDirectionOnSameSideAsOrigin ? this.shape.containsFinitePoint : !this.shape.containsFinitePoint;
            return this.pathBuilderProvider.atInfinity(new AtInfinity(this.shape.initialPosition, newContainsFinitePoint, this.shape.positionsSoFar.concat([position]), position));
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(new FromPointAtInfinityToPoint(this.shape.initialPosition, position, position));
    }
}
