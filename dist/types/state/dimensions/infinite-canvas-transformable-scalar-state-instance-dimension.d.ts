import { InfiniteCanvasTransformableStateInstanceDimension } from "./infinite-canvas-transformable-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
declare type TransformableScalarPropertyName = "lineWidth" | "lineDashOffset" | "shadowBlur";
export declare class InfiniteCanvasTransformableScalarStateInstanceDimension extends InfiniteCanvasTransformableStateInstanceDimension<TransformableScalarPropertyName> {
    constructor(propertyName: TransformableScalarPropertyName);
    protected valuesAreEqual(oldValue: number, newValue: number): boolean;
    protected changeToNewValueTransformed(newValue: number): Instruction;
    protected changeToNewValueUntransformed(newValue: number): Instruction;
    protected valuesAreEqualWhenTransformed(oldValue: number, newValue: number): boolean;
}
export declare const lineWidth: TypedStateInstanceDimension<number>;
export declare const lineDashOffset: TypedStateInstanceDimension<number>;
export {};
