import { Area } from "./area";
import { DrawingArea } from "./drawing-area";

export class NegativeDrawingArea implements DrawingArea{
    constructor(private readonly area: Area){

    }
    public hasDrawingAcrossBorderOf(area: Area): boolean{
        return false;
    }
    public intersects(area: Area): boolean{
        return this.area.intersects(area);
    }
    public isContainedBy(area: Area): boolean {
        return area.contains(this.area);
    }
}