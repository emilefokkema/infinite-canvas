import {InfiniteCanvasAuxiliaryObject} from "./infinite-canvas-auxiliary-object";

export abstract class InfiniteCanvasFillStrokeStyle extends InfiniteCanvasAuxiliaryObject{
    public abstract get fillStrokeStyle(): CanvasGradient | CanvasPattern;
}