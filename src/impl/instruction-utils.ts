import { Instruction, InstructionUsingInfinity, MinimalInstruction } from './instructions/instruction';
import { ViewboxInfinity } from './interfaces/viewbox-infinity';
import { CanvasRectangle } from "./rectangle/canvas-rectangle";
import { Transformation } from './transformation';
import { TransformationKind } from './transformation-kind';

class InfinityInstructionSequence implements InstructionUsingInfinity {
    constructor(private readonly instructions: InstructionUsingInfinity[]){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity): void {
        for(const instruction of this.instructions){
            instruction.execute(context, rectangle, infinity)
        }
    }
}

class TempStateInstruction implements Instruction {
    constructor(
        private readonly instruction: Instruction,
        private readonly tempStateInstruction: Instruction){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        context.save();
        this.tempStateInstruction.execute(context, rectangle);
        this.instruction.execute(context, rectangle);
        context.restore();
    }
}

class SetTransform implements Instruction {
    constructor(private readonly getTransformation: (rectangle: CanvasRectangle) => Transformation){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const {a, b, c, d, e, f} = this.getTransformation(rectangle);
        context.setTransform(a, b, c, d, e, f);
    }
}

class Transform implements Instruction {
    constructor(private readonly getTransformation: (rectangle: CanvasRectangle) => Transformation){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const {a, b, c, d, e, f} = this.getTransformation(rectangle);
        context.transform(a, b, c, d, e, f);
    }
}

class UsingInfinity implements Instruction {
    constructor(
        private readonly instruction: InstructionUsingInfinity,
        private readonly infinity: ViewboxInfinity
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        this.instruction.execute(context, rectangle, this.infinity)
    }
}

export function useTempState(instruction: Instruction, tempStateInstruction: Instruction): Instruction {
    if(!tempStateInstruction){
        return instruction;
    }
    return new TempStateInstruction(instruction, tempStateInstruction)
}

export function useInfinity(instruction: InstructionUsingInfinity, infinity: ViewboxInfinity): Instruction {
    return new UsingInfinity(instruction, infinity)
}

export function sequence(...instructions: MinimalInstruction[]): MinimalInstruction
export function sequence(...instructions: Instruction[]): Instruction
export function sequence(...instructions: InstructionUsingInfinity[]): InstructionUsingInfinity
export function sequence(...instructions: InstructionUsingInfinity[]): InstructionUsingInfinity {
    return new InfinityInstructionSequence(instructions);
}

export function getTempStateFnFromTransformationKind(transformationKind: TransformationKind): Instruction{
    if(transformationKind === TransformationKind.Relative){
        return new Transform(r => r.getBitmapTransformationToTransformedInfiniteCanvasContext());
    }else if(transformationKind === TransformationKind.Absolute){
        return new SetTransform(r => r.getBitmapTransformationToInfiniteCanvasContext())
    }
    return null;
}