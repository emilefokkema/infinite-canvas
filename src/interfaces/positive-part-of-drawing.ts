import { Area } from "../areas/area";
import { PositiveDrawingArea } from "../areas/positive-drawing-area";
import { PartOfDrawing } from "./part-of-drawing";

export interface PositivePartOfDrawing extends PartOfDrawing{
    drawingArea: PositiveDrawingArea
    setArea(area: Area): void
}