import { Instruction } from "./instruction";
import { Transformation } from "../transformation";
import { AreaChange } from "../areas/area-change";
import { Point } from "../geometry/point";
import { Position } from "../geometry/position"
import { PathInstruction } from "../interfaces/path-instruction";
import { AreaBuilder } from "../areas/area-builder";
import { isPointAtInfinity } from "../geometry/is-point-at-infinity";

export class PathInstructions{

    public static arc(_x: number, _y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): PathInstruction{
        const instruction: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const transformationAngle: number = transformation.getRotationAngle();
            const {x, y} = transformation.apply(new Point(_x, _y));
            context.arc(x, y, radius * transformation.scale, startAngle + transformationAngle, endAngle + transformationAngle, anticlockwise);
        };
        const changeArea: AreaChange = (builder: AreaBuilder) => {
            builder.addPosition(new Point(_x - radius, _y - radius));
            builder.addPosition(new Point(_x - radius, _y + radius));
            builder.addPosition(new Point(_x + radius, _y - radius));
            builder.addPosition(new Point(_x + radius, _y + radius));
        };
        return {
            instruction: instruction,
            changeArea: changeArea,
            positionChange: new Point(_x, _y).plus(Transformation.rotation(0, 0, endAngle).apply(new Point(radius, 0))),
            initialPoint: new Point(_x, _y).plus(Transformation.rotation(0, 0, startAngle).apply(new Point(radius, 0)))
        };
    }

    public static arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): PathInstruction{
        const p1: Point = new Point(x1, y1);
        const p2: Point = new Point(x2, y2);
        const instruction: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const tp1: Point = transformation.apply(p1);
            const tp2: Point = transformation.apply(p2);
            context.arcTo(tp1.x, tp1.y, tp2.x, tp2.y, radius * transformation.scale);
        };
        const changeArea: AreaChange = (builder: AreaBuilder) => {
            builder.addPosition(p1);
            builder.addPosition(p2);
        };
        return {
            instruction: instruction,
            changeArea: changeArea,
            positionChange: new Point(x2, y2)
        };
    }

    public static bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PathInstruction{
        return undefined;
    }

    public static ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): PathInstruction{
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const tCenter: Point = transformation.apply(new Point(x, y));
                const transformationAngle: number = transformation.getRotationAngle();
                context.ellipse(tCenter.x, tCenter.y, radiusX * transformation.scale, radiusY * transformation.scale, rotation + transformationAngle, startAngle, endAngle, anticlockwise);
            },
            changeArea: (builder: AreaBuilder) => {
                builder.addPosition(new Point(x - radiusX, y - radiusY));
                builder.addPosition(new Point(x - radiusX, y + radiusY));
                builder.addPosition(new Point(x + radiusX, y - radiusY));
                builder.addPosition(new Point(x + radiusX, y + radiusY));
            },
            positionChange: new Point(x, y)
                .plus(
                        Transformation.rotation(0, 0, endAngle).before(
                        new Transformation(radiusX, 0, 0, radiusY, 0, 0)).before(
                        Transformation.rotation(0, 0, rotation)
                        )
                    .apply(new Point(1, 0))
                ),
            initialPoint: new Point(x, y)
            .plus(
                    Transformation.rotation(0, 0, startAngle).before(
                    new Transformation(radiusX, 0, 0, radiusY, 0, 0)).before(
                    Transformation.rotation(0, 0, rotation)
                    )
                .apply(new Point(1, 0))
            )
        };
    }

    public static quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PathInstruction{
        return {
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const tControl = transformation.apply(new Point(cpx, cpy));
                const tEnd = transformation.apply(new Point(x, y));
                context.quadraticCurveTo(tControl.x, tControl.y, tEnd.x, tEnd.y);
            },
            changeArea: (builder: AreaBuilder, currentPosition: Position) => {
                if(isPointAtInfinity(currentPosition)){
                    return;
                }
                builder.addPosition(new Point((currentPosition.x + cpx) / 2, (currentPosition.y + cpy) / 2));
                builder.addPosition(new Point((cpx + x) / 2, (cpy + y) / 2));
                builder.addPosition(new Point(x, y))
            },
            positionChange: new Point(x, y)
        };
    }
}
