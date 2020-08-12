import { PathInstructionBuilder } from "../path-instruction-builder";
import { Position } from "../../../geometry/position";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { FromPointToPointAtInfinity } from "./from-point-to-point-at-infinity";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
export declare class PathInstructionBuilderFromPointToPointAtInfinity extends InfiniteCanvasPathInstructionBuilder<FromPointToPointAtInfinity> implements PathInstructionBuilder {
    private readonly pathBuilderProvider;
    constructor(pathBuilderProvider: PathInstructionBuilderProvider, shape: FromPointToPointAtInfinity);
    protected getInstructionToMoveToBeginningOfShape(shape: FromPointToPointAtInfinity): InstructionUsingInfinity;
    protected getInstructionToExtendShapeWithLineTo(shape: FromPointToPointAtInfinity, position: Position): InstructionUsingInfinity;
    canAddLineTo(position: Position): boolean;
    containsFinitePoint(): boolean;
    isClosable(): boolean;
    addPosition(position: Position): PathInstructionBuilder;
}
