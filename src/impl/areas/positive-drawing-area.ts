import { Area } from "./area";
import { DrawingArea } from "./drawing-area";

export interface PositiveDrawingArea extends DrawingArea{
    area: Area
}