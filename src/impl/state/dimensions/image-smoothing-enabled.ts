import { Instruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class ImageSmoothingEnabled extends InfiniteCanvasStateInstanceDimension<'imageSmoothingEnabled'>{
    protected valuesAreEqual(oldValue: boolean, newValue: boolean): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: boolean): Instruction {
        return (context) => {
            context.imageSmoothingEnabled = newValue;
        }
    }
}

export const imageSmoothingEnabled: TypedStateInstanceDimension<boolean> = new ImageSmoothingEnabled('imageSmoothingEnabled', noopInstruction);