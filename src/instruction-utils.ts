import { Instruction } from "./instructions/instruction";
import { TransformationKind } from "./transformation-kind";

export function sequence<TArgs extends unknown[]>(...fns: ((...args: TArgs) => void)[]): (...args: TArgs) => void{
    return (...args) => {
        for(const fn of fns){
            fn && fn(...args)
        }
    }
}

export function useTempState(instruction: Instruction, tempStateInstruction: Instruction): Instruction{
    if(!tempStateInstruction){
        return instruction;
    }
    return (context, rectangle) => {
        context.save();
        tempStateInstruction(context, rectangle);
        instruction(context, rectangle);
        context.restore();
    }
}

export function getTempStateFnFromTransformationKind(transformationKind: TransformationKind): Instruction{
    if(transformationKind === TransformationKind.Relative){
        return (context, rectangle) => {
            const {a, b, c, d, e, f} = rectangle.getBitmapTransformationToTransformedInfiniteCanvasContext();
            context.transform(a, b, c, d, e, f)
        }
    }else if(transformationKind === TransformationKind.Absolute){
        return (context, rectangle) => {
            const {a, b, c, d, e, f} = rectangle.getBitmapTransformationToInfiniteCanvasContext();
            context.setTransform(a, b, c, d, e, f)
        }
    }
    return null;
}