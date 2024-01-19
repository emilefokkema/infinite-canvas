import { Instruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class GlobalAlpha extends InfiniteCanvasStateInstanceDimension<'globalAlpha'>{
    protected valuesAreEqual(oldValue: number, newValue: number): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: number): Instruction {
        return (ctx) => ctx.globalAlpha = newValue;
    }
}

export const globalAlpha: TypedStateInstanceDimension<number> = new GlobalAlpha('globalAlpha', noopInstruction);