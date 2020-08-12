import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { PathShape } from "./path-shape";
import { Position } from "../../geometry/position";
import { InstructionUsingInfinity } from "../instruction-using-infinity";
import { Point } from "../../geometry/point";
export declare abstract class InfiniteCanvasPathInstructionBuilder<TPathShape extends PathShape<TPathShape>> {
    protected readonly shape: TPathShape;
    constructor(shape: TPathShape);
    protected abstract getInstructionToExtendShapeWithLineTo(shape: TPathShape, position: Position): InstructionUsingInfinity;
    protected abstract getInstructionToMoveToBeginningOfShape(shape: TPathShape): InstructionUsingInfinity;
    getInstructionToDrawLineTo(position: Position, state: InfiniteCanvasState): InstructionUsingInfinity;
    getInstructionToMoveToBeginning(state: InfiniteCanvasState): InstructionUsingInfinity;
    get currentPosition(): Position;
    protected moveToInfinityFromPointInDirection(point: Point, direction: Point): InstructionUsingInfinity;
    protected lineFromInfinityFromPointToInfinityFromPoint(point1: Point, point2: Point, direction: Point): InstructionUsingInfinity;
    protected lineFromInfinityFromPointToPoint(point: Point, direction: Point): InstructionUsingInfinity;
    protected lineToInfinityFromPointInDirection(point: Point, direction: Point): InstructionUsingInfinity;
    protected lineToInfinityFromInfinityFromPoint(point: Point, fromDirection: Point, toDirection: Point): InstructionUsingInfinity;
    protected lineTo(point: Point): InstructionUsingInfinity;
    protected moveTo(point: Point): InstructionUsingInfinity;
}
