import { PathInstructionBuilder } from "../path-instruction-builder";
import { Position } from "../../../geometry/position";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { FromPointToPoint } from "./from-point-to-point";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
export declare class PathInstructionBuilderFromPointToPoint extends InfiniteCanvasPathInstructionBuilder<FromPointToPoint> implements PathInstructionBuilder {
    private readonly pathBuilderProvider;
    constructor(pathBuilderProvider: PathInstructionBuilderProvider, shape: FromPointToPoint);
    protected getInstructionToMoveToBeginningOfShape(shape: FromPointToPoint): InstructionUsingInfinity;
    protected getInstructionToExtendShapeWithLineTo(shape: FromPointToPoint, position: Position): InstructionUsingInfinity;
    canAddLineTo(position: Position): boolean;
    containsFinitePoint(): boolean;
    isClosable(): boolean;
    addPosition(position: Position): PathInstructionBuilder;
}
