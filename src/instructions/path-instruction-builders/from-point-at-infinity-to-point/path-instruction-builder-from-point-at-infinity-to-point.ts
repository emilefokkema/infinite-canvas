import {PathInstructionBuilder} from "../path-instruction-builder";
import {Position} from "../../../geometry/position";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { FromPointAtInfinityToPoint } from "./from-point-at-infinity-to-point";
import { FromPointAtInfinityToPointAtInfinity } from "../from-point-at-infinity-to-point-at-infinity/from-point-at-infinity-to-point-at-infinity";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
import { instructionSequence } from "../../../instruction-utils";

export class PathInstructionBuilderFromPointAtInfinityToPoint extends InfiniteCanvasPathInstructionBuilder<FromPointAtInfinityToPoint> implements PathInstructionBuilder{
    constructor(private readonly pathBuilderProvider: PathInstructionBuilderProvider, shape: FromPointAtInfinityToPoint) {
        super(shape);
    }
    protected getInstructionToMoveToBeginningOfShape(shape: FromPointAtInfinityToPoint): InstructionUsingInfinity{
        const moveToInfinityFromCurrentPosition: InstructionUsingInfinity = this.moveToInfinityFromPointInDirection(shape.currentPosition, shape.initialPosition.direction);
        if(shape.currentPosition.equals(shape.firstFinitePoint)){
            return moveToInfinityFromCurrentPosition;
        }
        const lineToInfinityFromFirstFinitePoint: InstructionUsingInfinity = this.lineFromInfinityFromPointToInfinityFromPoint(shape.currentPosition, shape.firstFinitePoint, shape.initialPosition.direction);
        return instructionSequence(moveToInfinityFromCurrentPosition, lineToInfinityFromFirstFinitePoint);
    }
    protected getInstructionToExtendShapeWithLineTo(shape: FromPointAtInfinityToPoint, position: Position): InstructionUsingInfinity{
        if(isPointAtInfinity(position)){
            return this.lineToInfinityFromPointInDirection(shape.currentPosition, position.direction);
        }
        return this.lineTo(position);
    }
    public canAddLineTo(position: Position): boolean{
        return true;
    }
    public containsFinitePoint(): boolean{
        return true;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathInstructionBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new FromPointAtInfinityToPointAtInfinity(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.currentPosition, position));
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(new FromPointAtInfinityToPoint(this.shape.initialPosition, this.shape.firstFinitePoint, position));
    }
}
