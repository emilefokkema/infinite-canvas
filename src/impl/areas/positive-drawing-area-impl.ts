import { Area } from "./area";
import { PositiveDrawingArea } from "./positive-drawing-area";

export class PositiveDrawingAreaImpl implements PositiveDrawingArea{
    constructor(public readonly area: Area){

    }
    public hasDrawingAcrossBorderOf(area: Area): boolean{
        if(this.isContainedBy(area)){
            return false;
        }
        return this.intersects(area)
    }
    public isContainedBy(area: Area): boolean {
        return area.contains(this.area);
    }
    public intersects(area: Area): boolean{
        return this.area.intersects(area);
    }
}