import { PathInstructionBuilder } from "../path-instruction-builder";
import { Position } from "../../../geometry/position";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { FromPointAtInfinityToPointAtInfinity } from "./from-point-at-infinity-to-point-at-infinity";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
export declare class PathInstructionBuilderFromPointAtInfinityToPointAtInfinity extends InfiniteCanvasPathInstructionBuilder<FromPointAtInfinityToPointAtInfinity> implements PathInstructionBuilder {
    private readonly pathBuilderProvider;
    constructor(pathBuilderProvider: PathInstructionBuilderProvider, shape: FromPointAtInfinityToPointAtInfinity);
    protected getInstructionToMoveToBeginningOfShape(shape: FromPointAtInfinityToPointAtInfinity): InstructionUsingInfinity;
    protected getInstructionToExtendShapeWithLineTo(shape: FromPointAtInfinityToPointAtInfinity, position: Position): InstructionUsingInfinity;
    containsFinitePoint(): boolean;
    isClosable(): boolean;
    canAddLineTo(position: Position): boolean;
    addPosition(position: Position): PathInstructionBuilder;
}
