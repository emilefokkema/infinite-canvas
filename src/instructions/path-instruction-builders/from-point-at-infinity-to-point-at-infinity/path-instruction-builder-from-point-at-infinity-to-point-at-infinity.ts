import {PathInstructionBuilder} from "../path-instruction-builder";
import {Position} from "../../../geometry/position";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { FromPointAtInfinityToPointAtInfinity } from "./from-point-at-infinity-to-point-at-infinity";
import { FromPointAtInfinityToPoint } from "../from-point-at-infinity-to-point/from-point-at-infinity-to-point";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
import { instructionSequence } from "../../../instruction-utils";

export class PathInstructionBuilderFromPointAtInfinityToPointAtInfinity extends InfiniteCanvasPathInstructionBuilder<FromPointAtInfinityToPointAtInfinity> implements PathInstructionBuilder{
    constructor(private readonly pathBuilderProvider: PathInstructionBuilderProvider, shape: FromPointAtInfinityToPointAtInfinity) {
        super(shape);
    }
    protected getInstructionToMoveToBeginningOfShape(shape: FromPointAtInfinityToPointAtInfinity): InstructionUsingInfinity{
        if(shape.initialPosition.direction.cross(shape.currentPosition.direction) === 0){
            return this.moveToInfinityFromPointInDirection(shape.firstFinitePoint, shape.initialPosition.direction);
        }
        return instructionSequence(
            this.moveToInfinityFromPointInDirection(shape.lastFinitePoint, shape.currentPosition.direction),
            this.lineToInfinityFromInfinityFromPoint(shape.lastFinitePoint, shape.currentPosition.direction, shape.initialPosition.direction),
            this.lineFromInfinityFromPointToInfinityFromPoint(shape.lastFinitePoint, shape.firstFinitePoint, shape.initialPosition.direction));
    }
    protected getInstructionToExtendShapeWithLineTo(shape: FromPointAtInfinityToPointAtInfinity, position: Position): InstructionUsingInfinity{
        if(isPointAtInfinity(position)){
            return this.lineToInfinityFromInfinityFromPoint(shape.lastFinitePoint, shape.currentPosition.direction, position.direction);
        }
        return instructionSequence(
            this.lineFromInfinityFromPointToInfinityFromPoint(this.shape.lastFinitePoint, position, shape.currentPosition.direction),
            this.lineFromInfinityFromPointToPoint(position, shape.currentPosition.direction));
    }
    public containsFinitePoint(): boolean{
        return true;
    }
    public isClosable(): boolean{
        return !this.shape.initialPosition.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
    }
    public canAddLineTo(position: Position): boolean{
        return !isPointAtInfinity(position) || !position.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
    }
    public addPosition(position: Position): PathInstructionBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new FromPointAtInfinityToPointAtInfinity(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.lastFinitePoint, position));
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(new FromPointAtInfinityToPoint(this.shape.initialPosition, this.shape.firstFinitePoint, position));
    }
}
