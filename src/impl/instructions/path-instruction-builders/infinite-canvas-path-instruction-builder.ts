import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { PathShape } from "./path-shape";
import { Position } from "../../geometry/position";
import { Point } from "../../geometry/point";
import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { InstructionUsingInfinity, Instruction } from '../instruction'

class MoveToInfinityFromPointInDirection implements InstructionUsingInfinity {
    constructor(
        private readonly point: Point,
        private readonly direction: Point
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity): void {
        infinity.moveToInfinityFromPointInDirection(context, rectangle, this.point, this.direction);
    }
}

class DrawLineFromInfinityFromPointToInfinityFromPoint implements InstructionUsingInfinity {
    constructor(
        private readonly point1: Point,
        private readonly point2: Point,
        private readonly direction: Point
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity): void {
        infinity.drawLineFromInfinityFromPointToInfinityFromPoint(context, rectangle, this.point1, this.point2, this.direction);
    }
}

class DrawLineFromInfinityFromPointToPoint implements InstructionUsingInfinity{
    constructor(
        private readonly point: Point,
        private readonly direction: Point
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity): void {
        infinity.drawLineFromInfinityFromPointToPoint(context, rectangle, this.point, this.direction);
    }
}

class DrawLineToInfinityFromPointInDirection implements InstructionUsingInfinity {
    constructor(
        private readonly point: Point,
        private readonly direction: Point
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity): void {
        infinity.drawLineToInfinityFromPointInDirection(context, rectangle, this.point, this.direction);
    }
}

class MoveTo implements Instruction {
    constructor(
        private readonly point: Point
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const {x, y} = rectangle.userTransformation.apply(this.point);
        context.moveTo(x, y);
    }
}

class LineTo implements Instruction {
    constructor(
        private readonly point: Point
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const {x, y} = rectangle.userTransformation.apply(this.point);
        context.lineTo(x, y);
    }
}

class DrawLineToInfinityFromInfinityFromPoint implements InstructionUsingInfinity {
    constructor(
        private readonly point: Point,
        private readonly fromDirection: Point,
        private readonly toDirection: Point
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity): void {
        infinity.drawLineToInfinityFromInfinityFromPoint(context, rectangle, this.point, this.fromDirection, this.toDirection);
    }
}
export abstract class InfiniteCanvasPathInstructionBuilder<TPathShape extends PathShape<TPathShape>>{
    constructor(protected readonly shape: TPathShape){}
    protected abstract getInstructionToExtendShapeWithLineTo(shape: TPathShape, position: Position): InstructionUsingInfinity ;
    protected abstract getInstructionToMoveToBeginningOfShape(shape: TPathShape): InstructionUsingInfinity;
    public getInstructionToDrawLineTo(position: Position, state: InfiniteCanvasState): InstructionUsingInfinity {
        return this.getInstructionToExtendShapeWithLineTo(this.shape.transform(state.current.transformation.inverse()), position);
    }
    public getInstructionToMoveToBeginning(state: InfiniteCanvasState): InstructionUsingInfinity {
        return this.getInstructionToMoveToBeginningOfShape(this.shape.transform(state.current.transformation.inverse()));
    }
    public get currentPosition(): Position{return this.shape.currentPosition;}

    protected moveToInfinityFromPointInDirection(point: Point, direction: Point): InstructionUsingInfinity {
        return new MoveToInfinityFromPointInDirection(point, direction);
    }

    protected lineFromInfinityFromPointToInfinityFromPoint(point1: Point, point2: Point, direction: Point): InstructionUsingInfinity {
        return new DrawLineFromInfinityFromPointToInfinityFromPoint(point1, point2, direction);
    }

    protected lineFromInfinityFromPointToPoint(point: Point, direction: Point): InstructionUsingInfinity {
        return new DrawLineFromInfinityFromPointToPoint(point, direction);
    }

    protected lineToInfinityFromPointInDirection(point: Point, direction: Point): InstructionUsingInfinity {
        return new DrawLineToInfinityFromPointInDirection(point, direction)
    }

    protected lineToInfinityFromInfinityFromPoint(point: Point, fromDirection: Point, toDirection: Point): InstructionUsingInfinity {
        return new DrawLineToInfinityFromInfinityFromPoint(point, fromDirection, toDirection);
    }

    protected lineTo(point: Point): Instruction {
        return new LineTo(point);
    }
    
    protected moveTo(point: Point): Instruction {
        return new MoveTo(point);
    }
}
