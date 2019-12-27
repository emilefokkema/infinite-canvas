import {InfiniteCanvasAuxiliaryObject} from "./infinite-canvas-auxiliary-object";
import { Instruction } from "./instructions/instruction";

export abstract class InfiniteCanvasFillStrokeStyle extends InfiniteCanvasAuxiliaryObject{
    public abstract get fillStrokeStyle(): CanvasGradient | CanvasPattern;
    public createInstruction(fillOrStrokeInstruction: Instruction): Instruction{
        return fillOrStrokeInstruction;
    }
}