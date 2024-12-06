import { Point } from "../../geometry/point";
import { PointAtInfinity } from "../../geometry/point-at-infinity";
import { CurrentPath } from "../../interfaces/current-path";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { Corner, VisibleCorner, VisibleTopLeftCorner, TopLeftCorner } from "./corner-strategy";
import { CornerOrientation } from "./corner-orientation";
import { EdgeOrientation } from "../edge-orientation";
import { SingleCornerRadii } from "../corner-radii";
import { RoundCornerStrategyImpl, RoundTopLeftCornerStrategyImpl } from "./round-corner-strategy-impl";

export class VisibleCornerImpl implements VisibleCorner{
    constructor(
        protected readonly corner: Point,
        protected readonly cornerOrientation: CornerOrientation,
        protected readonly horizontalOrientation: EdgeOrientation,
        protected readonly verticalOrientation: EdgeOrientation){}
    public draw(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.lineTo(this.corner, state)
    }
    public round(radii: SingleCornerRadii): Corner{
        if(radii.x === 0 || radii.y === 0){
            return this;
        }
        return new RoundCornerStrategyImpl(
            radii,
            this.corner,
            this.cornerOrientation,
            this.horizontalOrientation,
            this.verticalOrientation
        )
    }
}

export class VisibleTopLeftCornerImpl implements VisibleTopLeftCorner{
    constructor(
        protected readonly corner: Point,
        protected readonly cornerOrientation: CornerOrientation,
        protected readonly horizontalOrientation: EdgeOrientation,
        protected readonly verticalOrientation: EdgeOrientation){}

    public moveToEndingPoint(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.moveTo(this.corner, state)
    }

    public finishRect(currentPath: CurrentPath, state: InfiniteCanvasState): void {
        currentPath.closePath();
        currentPath.moveTo(this.corner, state)
    }

    public round(radii: SingleCornerRadii): TopLeftCorner{
        if(radii.x === 0 || radii.y === 0){
            return this;
        }
        return new RoundTopLeftCornerStrategyImpl(
            radii,
            this.corner,
            this.cornerOrientation,
            this.horizontalOrientation,
            this.verticalOrientation
        )
    }

}

export class InfiniteCornerFromInfinityToInfinity implements Corner{
    constructor(private readonly point: Point, protected readonly direction: PointAtInfinity){}
    public draw(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.lineTo(this.point, state)
        currentPath.lineTo(this.direction, state)
    }
}

export class InfiniteTopLeftCornerFromInfinityToInfinity implements TopLeftCorner{
    constructor(private readonly point: Point, protected readonly direction: PointAtInfinity){}

    public moveToEndingPoint(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.moveTo(this.direction, state)
    }

    public finishRect(currentPath: CurrentPath, state: InfiniteCanvasState): void {
        currentPath.lineTo(this.point, state)
        currentPath.lineTo(this.direction, state)
        currentPath.closePath();
        currentPath.moveTo(this.direction, state)
    }
}

export class InfiniteCorner implements Corner{
    constructor(protected readonly direction: PointAtInfinity){}
    public draw(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.lineTo(this.direction, state)
    }
}

export class InfiniteTopLeftCorner implements TopLeftCorner{
    constructor(private readonly direction: PointAtInfinity){}

    public moveToEndingPoint(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.moveTo(this.direction, state)
    }

    public finishRect(currentPath: CurrentPath, state: InfiniteCanvasState): void {
        currentPath.closePath();
        currentPath.moveTo(this.direction, state)
    }
}