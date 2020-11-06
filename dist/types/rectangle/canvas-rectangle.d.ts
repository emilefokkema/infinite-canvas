import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Point } from "../geometry/point";
import { Instruction } from "../instructions/instruction";
import { ViewboxInfinityProvider } from "../interfaces/viewbox-infinity-provider";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Transformable } from "../transformable";
import { Transformation } from "../transformation";
export interface CanvasRectangle extends Transformable, ViewboxInfinityProvider {
    viewboxWidth: number;
    viewboxHeight: number;
    readonly infiniteCanvasContextBase: Transformation;
    readonly inverseInfiniteCanvasContextBase: Transformation;
    measure(): void;
    getCSSPosition(screenX: number, screenY: number): Point;
    getTransformationInstruction(toTransformation: Transformation): Instruction;
    applyInitialTransformation(context: CanvasRenderingContext2D): void;
    getViewboxFromState(state: InfiniteCanvasState, margin: number): ConvexPolygon;
    transformRelatively(instruction: Instruction): Instruction;
    transformAbsolutely(instruction: Instruction): Instruction;
    addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number): void;
}
