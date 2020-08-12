import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
declare class FillStrokeStyle<K extends "fillStyle" | "strokeStyle"> implements TypedStateInstanceDimension<string | CanvasGradient | CanvasPattern> {
    private readonly propName;
    constructor(propName: K);
    changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: string | CanvasGradient | CanvasPattern): InfiniteCanvasStateInstance;
    isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean;
    getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): Instruction;
    valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean;
}
export declare const fillStyle: FillStrokeStyle<"fillStyle">;
export declare const strokeStyle: FillStrokeStyle<"strokeStyle">;
export {};
