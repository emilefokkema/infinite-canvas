import { Area } from "./area";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { AreaBuilder } from "./area-builder";
import { SubsetOfLineAtInfinity } from "./infinity/subset-of-line-at-infinity";
import { Position } from "../geometry/position";
export declare class InfiniteCanvasAreaBuilder {
    private _area?;
    private firstPoint?;
    private subsetOfLineAtInfinity?;
    constructor(_area?: Area, firstPoint?: Point, subsetOfLineAtInfinity?: SubsetOfLineAtInfinity);
    get area(): Area;
    addPoint(point: Point): void;
    addPosition(position: Position): void;
    addInfinityInDirection(direction: Point): void;
    transformedWith(transformation: Transformation): AreaBuilder;
    copy(): InfiniteCanvasAreaBuilder;
}
