import { Instruction } from "../../instructions/instruction";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class ImageSmoothingEnabled extends InfiniteCanvasStateInstanceDimension<'imageSmoothingEnabled'>{
    protected valuesAreEqual(oldValue: boolean, newValue: boolean): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: boolean, rectangle: CanvasRectangle): Instruction {
        return (context) => {
            context.imageSmoothingEnabled = newValue;
        }
    }
}

export const imageSmoothingEnabled: TypedStateInstanceDimension<boolean> = new ImageSmoothingEnabled('imageSmoothingEnabled');