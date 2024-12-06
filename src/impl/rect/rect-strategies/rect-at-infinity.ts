import { Area } from "../../areas/area";
import { DrawingInstruction } from "../../drawing-instruction";
import { PointAtInfinity } from "../../geometry/point-at-infinity";
import { CurrentPath } from "../../interfaces/current-path";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { Rect, Shape } from '../rect'

export class RectAtInfinity implements Rect{
    constructor(private readonly topLeftPosition: PointAtInfinity){}
    public addSubpaths(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.moveTo(this.topLeftPosition, state);
    }
    public getRoundRect(): Shape{
        return this;
    }
    public getArea(): Area {
        return undefined;
    }
    public stroke(): DrawingInstruction{
        return undefined;
    }
    public fill(): DrawingInstruction{
        return undefined;
    }
}