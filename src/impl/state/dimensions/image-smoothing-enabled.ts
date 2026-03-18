import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { SetValue } from "./set-value";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class ImageSmoothingEnabled extends InfiniteCanvasStateInstanceDimension<'imageSmoothingEnabled', MinimalInstruction>{
    protected valuesAreEqual(oldValue: boolean, newValue: boolean): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: boolean): MinimalInstruction {
        return new SetValue('imageSmoothingEnabled', newValue)
    }
}

export const imageSmoothingEnabled: TypedStateInstanceDimension<boolean, MinimalInstruction> = new ImageSmoothingEnabled('imageSmoothingEnabled', noopInstruction);