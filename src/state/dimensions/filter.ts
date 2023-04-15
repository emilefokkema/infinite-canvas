import { Instruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TransformableFilter } from "./transformable-filter";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class Filter extends InfiniteCanvasStateInstanceDimension<'filter'>{
    protected valuesAreEqual(oldValue: TransformableFilter, newValue: TransformableFilter): boolean {
        return oldValue.stringRepresentation === newValue.stringRepresentation;
    }
    protected changeToNewValue(newValue: TransformableFilter): Instruction {
        return (ctx, transformation) => ctx.filter = newValue.toTransformedString(transformation);
    }
}

export const filter: TypedStateInstanceDimension<TransformableFilter> = new Filter('filter');