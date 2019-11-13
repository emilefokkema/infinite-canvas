import { Rectangle } from "../rectangle";

export interface PartOfDrawing{
    hasDrawingAcrossBorderOf(area: Rectangle): boolean;
    intersects(area: Rectangle): boolean;
    isContainedBy(area: Rectangle): boolean;
}