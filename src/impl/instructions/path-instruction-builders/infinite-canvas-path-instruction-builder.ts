import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { PathShape } from "./path-shape";
import { Position } from "../../geometry/position";
import { InstructionUsingInfinity } from "../instruction-using-infinity";
import { Point } from "../../geometry/point";
import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

export abstract class InfiniteCanvasPathInstructionBuilder<TPathShape extends PathShape<TPathShape>>{
    constructor(protected readonly shape: TPathShape){}
    protected abstract getInstructionToExtendShapeWithLineTo(shape: TPathShape, position: Position): InstructionUsingInfinity;
    protected abstract getInstructionToMoveToBeginningOfShape(shape: TPathShape): InstructionUsingInfinity;
    public getInstructionToDrawLineTo(position: Position, state: InfiniteCanvasState): InstructionUsingInfinity{
        return this.getInstructionToExtendShapeWithLineTo(this.shape.transform(state.current.transformation.inverse()), position);
    }
    public getInstructionToMoveToBeginning(state: InfiniteCanvasState): InstructionUsingInfinity{
        return this.getInstructionToMoveToBeginningOfShape(this.shape.transform(state.current.transformation.inverse()));
    }
    public get currentPosition(): Position{return this.shape.currentPosition;}

    protected moveToInfinityFromPointInDirection(point: Point, direction: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity) => {
           infinity.moveToInfinityFromPointInDirection(context, rectangle, point, direction);
        };
    }

    protected lineFromInfinityFromPointToInfinityFromPoint(point1: Point, point2: Point, direction: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity) => {
            infinity.drawLineFromInfinityFromPointToInfinityFromPoint(context, rectangle, point1, point2, direction);
        };
    }

    protected lineFromInfinityFromPointToPoint(point: Point, direction: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity) => {
            infinity.drawLineFromInfinityFromPointToPoint(context, rectangle, point, direction);
        };
    }

    protected lineToInfinityFromPointInDirection(point: Point, direction: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity) => {
            infinity.drawLineToInfinityFromPointInDirection(context, rectangle, point, direction);
        };
    }

    protected lineToInfinityFromInfinityFromPoint(point: Point, fromDirection: Point, toDirection: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity) => {
            infinity.drawLineToInfinityFromInfinityFromPoint(context, rectangle, point, fromDirection, toDirection);
        };
    }

    protected lineTo(point: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
            const {x, y} = rectangle.userTransformation.apply(point);
            context.lineTo(x, y);
        };
    }
    
    protected moveTo(point: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
            const {x, y} = rectangle.userTransformation.apply(point);
            context.moveTo(x, y);
        };
    }
}
