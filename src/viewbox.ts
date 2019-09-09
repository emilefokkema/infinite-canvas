import { Transformation } from "./transformation";
import { Rectangle } from "./rectangle";
import { Point } from "./point";

export interface ViewBox{
    addInstruction<T>(instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => T, area?: Point | Rectangle): T;
    clearArea(x: number, y: number, width: number, height: number): void;
    beginArea(): void;
    closeArea(): void;
}