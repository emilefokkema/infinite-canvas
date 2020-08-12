import { PathInstructionBuilder } from "../path-instruction-builder";
import { Position } from "../../../geometry/position";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { FromPointAtInfinityToPoint } from "./from-point-at-infinity-to-point";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
export declare class PathInstructionBuilderFromPointAtInfinityToPoint extends InfiniteCanvasPathInstructionBuilder<FromPointAtInfinityToPoint> implements PathInstructionBuilder {
    private readonly pathBuilderProvider;
    constructor(pathBuilderProvider: PathInstructionBuilderProvider, shape: FromPointAtInfinityToPoint);
    protected getInstructionToMoveToBeginningOfShape(shape: FromPointAtInfinityToPoint): InstructionUsingInfinity;
    protected getInstructionToExtendShapeWithLineTo(shape: FromPointAtInfinityToPoint, position: Position): InstructionUsingInfinity;
    canAddLineTo(position: Position): boolean;
    containsFinitePoint(): boolean;
    isClosable(): boolean;
    addPosition(position: Position): PathInstructionBuilder;
}
