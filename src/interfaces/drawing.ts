import { Rectangle } from "../rectangle";
import { PartOfDrawing } from "./part-of-drawing";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";

export interface Drawing extends PartOfDrawing{
    clearContentsInsideArea(area: Rectangle): void;
    addClearRect(area: Rectangle, state: InfiniteCanvasState): void;
}