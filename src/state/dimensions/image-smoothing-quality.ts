import { Instruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class ImageSmoothingQualityDim extends InfiniteCanvasStateInstanceDimension<'imageSmoothingQuality'>{
    protected valuesAreEqual(oldValue: ImageSmoothingQuality, newValue: ImageSmoothingQuality): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: ImageSmoothingQuality): Instruction {
        return (context) => {
            context.imageSmoothingQuality = newValue;
        }
    }
}

export const imageSmoothingQuality: TypedStateInstanceDimension<ImageSmoothingQuality> = new ImageSmoothingQualityDim('imageSmoothingQuality', noopInstruction);