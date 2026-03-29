import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { SetValue } from "./set-value";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class ImageSmoothingQualityDim extends InfiniteCanvasStateInstanceDimension<'imageSmoothingQuality', MinimalInstruction>{
    protected valuesAreEqual(oldValue: ImageSmoothingQuality, newValue: ImageSmoothingQuality): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: ImageSmoothingQuality): MinimalInstruction {
        return new SetValue('imageSmoothingQuality', newValue)
    }
}

export const imageSmoothingQuality: TypedStateInstanceDimension<ImageSmoothingQuality, MinimalInstruction> = new ImageSmoothingQualityDim('imageSmoothingQuality', noopInstruction);