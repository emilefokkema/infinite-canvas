import { Instruction } from "./instruction";
import { Transformation } from "../transformation";
import { Rectangle } from "../rectangle";
import { AreaChange } from "../area-change";
import { Point } from "../point";
import { drawRect } from "../infinite-context/draw-rect";
import { PathInstruction } from "../interfaces/path-instruction";
import { transformInstructionRelatively } from "../instruction-utils";

export class PathInstructions{

    public static clearRect(x: number, y: number, width: number, height: number): PathInstruction{
        return {
            instruction:transformInstructionRelatively((context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.clearRect(x, y, width, height);
            }),
            changeArea: AreaChange.to(new Rectangle(x, y, width, height))
        };
    }

    public static arc(_x: number, _y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): PathInstruction{
        const instruction: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const transformationAngle: number = transformation.getRotationAngle();
            const {x, y} = transformation.apply({x:_x,y:_y});
            context.arc(x, y, radius * transformation.scale, startAngle + transformationAngle, endAngle + transformationAngle, anticlockwise);
        };
        const changeArea: AreaChange = AreaChange.to(new Rectangle(_x - radius, _y - radius, 2 * radius, 2 * radius));
        return {
            instruction: instruction,
            changeArea: changeArea
        };
    }

    public static arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): PathInstruction{
        const p1: Point = {x:x1,y:y1};
        const p2: Point = {x:x2,y:y2};
        const newRectangle: Rectangle = Rectangle.create(p1).expandToInclude(p2);
        const instruction: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const tp1: Point = transformation.apply(p1);
            const tp2: Point = transformation.apply(p2);
            context.arcTo(tp1.x, tp1.y, tp2.x, tp2.y, radius * transformation.scale);
        };
        const changeArea: AreaChange = AreaChange.to(newRectangle);
        return {
            instruction: instruction,
            changeArea: changeArea
        };
    }

    public static bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PathInstruction{
        return undefined;
    }

    public static closePath(): PathInstruction{
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.closePath();
            },
            changeArea: AreaChange.to()
        };
    }

    public static ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): PathInstruction{
        const newRectangle: Rectangle = new Rectangle(x - radiusX, y - radiusY, 2 * radiusX, 2 * radiusY).transform(Transformation.rotation(x, y, rotation));
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const tCenter: Point = transformation.apply({x:x,y:y});
                const transformationAngle: number = transformation.getRotationAngle();
                context.ellipse(tCenter.x, tCenter.y, radiusX * transformation.scale, radiusY * transformation.scale, rotation + transformationAngle, startAngle, endAngle, anticlockwise);
            },
            changeArea: AreaChange.to(newRectangle)
        };
    }

    public static lineTo(_x: number, _y: number): PathInstruction{
        const point: Point = {x: _x, y: _y};
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {x, y} = transformation.apply(point);
                context.lineTo(x, y);
            },
            changeArea: AreaChange.to(point)
        };
    }

    public static moveTo(_x: number, _y: number): PathInstruction{
        const point: Point = {x: _x, y: _y};
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {x, y} = transformation.apply(point);
                context.moveTo(x, y);
            },
            changeArea: AreaChange.to(point)
        };
    }

    public static quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PathInstruction{
        return undefined;
    }

    public static rect(x: number, y: number, w: number, h: number): PathInstruction{
        const rectangle: Rectangle = new Rectangle(x, y, w, h);
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                drawRect(x, y, w, h, context, transformation);
            },
            changeArea: AreaChange.to(rectangle)
        };
    }
}