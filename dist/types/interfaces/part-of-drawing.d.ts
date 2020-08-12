import { Area } from "../areas/area";
export interface PartOfDrawing {
    hasDrawingAcrossBorderOf(area: Area): boolean;
    intersects(area: Area): boolean;
    isContainedBy(area: Area): boolean;
}
