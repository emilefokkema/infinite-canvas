import {PathInstructionBuilder} from "../path-instruction-builder";
import {Position} from "../../../geometry/position";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { FromPointToPoint } from "./from-point-to-point";
import { FromPointToPointAtInfinity } from "../from-point-to-point-at-infinity/from-point-to-point-at-infinity";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
import { sequence } from "../../../instruction-utils";

export class PathInstructionBuilderFromPointToPoint extends InfiniteCanvasPathInstructionBuilder<FromPointToPoint> implements PathInstructionBuilder{
    constructor(private readonly pathBuilderProvider: PathInstructionBuilderProvider, shape: FromPointToPoint) {
        super(shape);
    }
    protected getInstructionToMoveToBeginningOfShape(shape: FromPointToPoint): InstructionUsingInfinity{
        return this.moveTo(shape.initialPoint);
    }
    protected getInstructionToExtendShapeWithLineTo(shape: FromPointToPoint, position: Position): InstructionUsingInfinity{
        if(isPointAtInfinity(position)){
            const lineToInfinityFromCurrent: InstructionUsingInfinity = this.lineToInfinityFromPointInDirection(shape.currentPosition, position.direction);
            if(shape.currentPosition.minus(shape.initialPoint).cross(position.direction) === 0){
                return lineToInfinityFromCurrent;
            }
            const lineToInfinityFromInitial: InstructionUsingInfinity = this.lineFromInfinityFromPointToInfinityFromPoint(shape.currentPosition, shape.initialPoint, position.direction);
            return sequence(lineToInfinityFromCurrent, lineToInfinityFromInitial);
        }
        return this.lineTo(position);
    }
    public canAddLineTo(position: Position): boolean{
        return true;
    }
    public containsFinitePoint(): boolean{
        return true;
    }
    public surroundsFinitePoint(): boolean{
        return true;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathInstructionBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointToPointAtInfinity(new FromPointToPointAtInfinity(this.shape.initialPoint, position));
        }
        return this.pathBuilderProvider.fromPointToPoint(new FromPointToPoint(this.shape.initialPoint, position));
    }
}
