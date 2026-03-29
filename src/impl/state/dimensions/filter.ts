import { Instruction, noopInstruction } from "../../instructions/instruction";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TransformableFilter } from "./transformable-filter";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class SetTransformableFilter implements Instruction {
    constructor(private readonly value: TransformableFilter){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        context.filter = this.value.toTransformedString(rectangle);
    }
}
class Filter extends InfiniteCanvasStateInstanceDimension<'filter'>{
    protected valuesAreEqual(oldValue: TransformableFilter, newValue: TransformableFilter): boolean {
        return oldValue.stringRepresentation === newValue.stringRepresentation;
    }
    protected changeToNewValue(newValue: TransformableFilter): Instruction {
        return new SetTransformableFilter(newValue)
    }
}

export const filter: TypedStateInstanceDimension<TransformableFilter> = new Filter('filter', noopInstruction);