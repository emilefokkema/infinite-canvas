import { Area } from "./area";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { AreaBuilder } from "./area-builder";
import { TransformedAreaBuilder } from "./transformed-area-builder";
import { empty } from "./empty";
import { LineSegment } from "./line/line-segment";
import { Ray } from "./line/ray";
import { SubsetOfLineAtInfinity } from "./infinity/subset-of-line-at-infinity";
import { PointAtInfinity } from "./infinity/point-at-infinity";
import { lineAtInfinity } from "./infinity/line-at-infinity";
import { plane } from "./plane";
import { isPointAtInfinity } from "../geometry/is-point-at-infinity";
import { Position } from "../geometry/position"

export class InfiniteCanvasAreaBuilder {
    constructor(private _area?: Area, private firstPoint?: Point, private subsetOfLineAtInfinity?: SubsetOfLineAtInfinity){}
    public get area(): Area{return this._area || empty;}
    public addPoint(point: Point): void{
        if(this._area){
            this._area = this._area.expandToIncludePoint(point);
        }else{
            if(this.firstPoint){
                if(!point.equals(this.firstPoint)){
                    this._area = new LineSegment(this.firstPoint, point);
                }
            }else if(this.subsetOfLineAtInfinity){
                this._area = this.subsetOfLineAtInfinity.addPoint(point);
            }else{
                this.firstPoint = point;
            }
        }
    }
    public addPosition(position: Position): void{
        if(isPointAtInfinity(position)){
            this.addInfinityInDirection(position.direction);
        }else{
            this.addPoint(position);
        }
    }
    public addInfinityInDirection(direction: Point): void{
        if(this._area){
            this._area = this._area.expandToIncludeInfinityInDirection(direction);
        }else{
            if(this.firstPoint){
                this._area = new Ray(this.firstPoint, direction);
            }else if(this.subsetOfLineAtInfinity){
                this.subsetOfLineAtInfinity = this.subsetOfLineAtInfinity.addPointAtInfinity(direction);
                if(this.subsetOfLineAtInfinity === lineAtInfinity){
                    this._area = plane;
                }
            }else{
                this.subsetOfLineAtInfinity = new PointAtInfinity(direction);
            }
        }
    }

    public transformedWith(transformation: Transformation): AreaBuilder{
        return new TransformedAreaBuilder(this, transformation);
    }
    public copy(): InfiniteCanvasAreaBuilder{
        return new InfiniteCanvasAreaBuilder(this._area, this.firstPoint, this.subsetOfLineAtInfinity);
    }
}
