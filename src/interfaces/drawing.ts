import { Rectangle } from "../rectangle";
import { PartOfDrawing } from "./part-of-drawing";

export interface Drawing extends PartOfDrawing{
    clearContentsInsideArea(area: Rectangle): void;
    addClearRect(area: Rectangle): void;
}