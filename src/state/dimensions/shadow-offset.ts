import { Point } from "../../point";
import { Instruction } from "../../instructions/instruction";
import { Transformation } from "../../transformation";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";

class ShadowOffset extends InfiniteCanvasStateInstanceDimension<"shadowOffset">{
    protected changeToNewValue(newValue: Point): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {x: origX, y: origY} = transformation.apply({x: 0, y: 0});
            const {x, y} = transformation.before(Transformation.translation(-origX, -origY)).apply(newValue);
            context.shadowOffsetX = x;
            context.shadowOffsetY = y;
        };
    }
    protected valuesAreEqual(oldValue: Point, newValue: Point): boolean{
        return oldValue.x === newValue.x && oldValue.y == newValue.y;
    }
    protected valuesAreEqualWhenTransformed(oldValue: Point, newValue: Point): boolean{
        return oldValue.x === 0 && oldValue.y === 0 && newValue.x === 0 && newValue.y === 0;
    }
}
export const shadowOffset: TypedStateInstanceDimension<Point> = new ShadowOffset("shadowOffset");