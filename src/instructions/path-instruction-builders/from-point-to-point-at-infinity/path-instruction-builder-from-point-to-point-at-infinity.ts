import { PathInstructionBuilder } from "../path-instruction-builder";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { FromPointToPointAtInfinity } from "./from-point-to-point-at-infinity";
import { FromPointToPoint } from "../from-point-to-point/from-point-to-point";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
import { instructionSequence } from "../../../instruction-utils";

export class PathInstructionBuilderFromPointToPointAtInfinity extends InfiniteCanvasPathInstructionBuilder<FromPointToPointAtInfinity> implements PathInstructionBuilder{
    constructor(private readonly pathBuilderProvider: PathInstructionBuilderProvider, shape: FromPointToPointAtInfinity) {
        super(shape);
    }
    protected getInstructionToMoveToBeginningOfShape(shape: FromPointToPointAtInfinity): InstructionUsingInfinity{
        return this.moveTo(shape.initialPoint);
    }
    protected getInstructionToExtendShapeWithLineTo(shape: FromPointToPointAtInfinity, position: Position): InstructionUsingInfinity{
        if(isPointAtInfinity(position)){
            if(position.direction.inSameDirectionAs(shape.currentPosition.direction)){
                return () => {};
            }
            return this.lineToInfinityFromInfinityFromPoint(shape.initialPoint, shape.currentPosition.direction, position.direction);
        }
        return instructionSequence(this.lineFromInfinityFromPointToInfinityFromPoint(this.shape.initialPoint, position, shape.currentPosition.direction), this.lineFromInfinityFromPointToPoint(position, shape.currentPosition.direction));
    }
    public canAddLineTo(position: Position): boolean{
        return !isPointAtInfinity(position) || !position.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
    }
    public containsFinitePoint(): boolean{
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
