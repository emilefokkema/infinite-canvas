import { PathInstructionBuilderProvider } from "./path-instruction-builder-provider";
import { Position } from "../../geometry/position";
import { PathInstructionBuilder } from "./path-instruction-builder";
import { InstructionUsingInfinity } from "../instruction-using-infinity";
import { FromPointAtInfinityToPointAtInfinity } from "./from-point-at-infinity-to-point-at-infinity/from-point-at-infinity-to-point-at-infinity";
import { FromPointAtInfinityToPoint } from "./from-point-at-infinity-to-point/from-point-at-infinity-to-point";
import { FromPointToPointAtInfinity } from "./from-point-to-point-at-infinity/from-point-to-point-at-infinity";
import { FromPointToPoint } from "./from-point-to-point/from-point-to-point";
import { AtInfinity } from "./at-infinity/at-infinity";
export declare class InfiniteCanvasPathInstructionBuilderProvider implements PathInstructionBuilderProvider {
    private readonly instructionToGoAroundViewbox;
    constructor(instructionToGoAroundViewbox: InstructionUsingInfinity);
    fromPointAtInfinityToPointAtInfinity(shape: FromPointAtInfinityToPointAtInfinity): PathInstructionBuilder;
    fromPointAtInfinityToPoint(shape: FromPointAtInfinityToPoint): PathInstructionBuilder;
    fromPointToPointAtInfinity(shape: FromPointToPointAtInfinity): PathInstructionBuilder;
    fromPointToPoint(shape: FromPointToPoint): PathInstructionBuilder;
    atInfinity(shape: AtInfinity): PathInstructionBuilder;
    getBuilderFromPosition(position: Position): PathInstructionBuilder;
}
