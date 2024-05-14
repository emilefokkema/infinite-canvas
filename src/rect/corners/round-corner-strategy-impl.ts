import { Point } from "../../geometry/point";
import { PathInstructions } from "../../instructions/path-instructions";
import { CurrentPath } from "../../interfaces/current-path";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { SingleCornerRadii } from "../corner-radii";
import { EdgeOrientation } from "../edge-orientation";
import { CornerOrientation, invertHorizontal, invertVertical } from "./corner-orientation";
import { Corner, TopLeftCorner } from "./corner-strategy";

interface CornerTerminus{
    angle: number
    point: Point
}

interface CornerLocations{
    center: Point
    start: CornerTerminus
    end: CornerTerminus
}

export class RoundCornerStrategyImpl implements Corner{
    private readonly center: Point
    private readonly start: CornerTerminus
    protected readonly end: CornerTerminus
    private readonly radii: SingleCornerRadii
    private readonly clockwise: boolean

    constructor(
        radii: SingleCornerRadii,
        protected readonly corner: Point,
        orientation: CornerOrientation,
        horizontalOrientation: EdgeOrientation,
        verticalOrientation: EdgeOrientation
    ){
        orientation = getAdjustedOrientation(orientation, horizontalOrientation, verticalOrientation)
        const clockwise = verticalOrientation === horizontalOrientation
        let {center, start, end} = getCornerLocations(orientation, corner, radii)
        if(!clockwise){
            ({start, end} = {start: end, end: start})
        }
        this.radii = radii
        this.clockwise = clockwise
        this.center = center
        this.start = start;
        this.end = end;
    }

    public draw(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.lineTo(this.start.point, state)
        if(this.radii.circular){
            currentPath.addPathInstruction(PathInstructions.arc(
                this.center.x,
                this.center.y,
                this.radii.x,
                this.start.angle,
                this.end.angle,
                !this.clockwise
            ), state)
        }else{
            currentPath.addPathInstruction(PathInstructions.ellipse(
                this.center.x,
                this.center.y,
                this.radii.x,
                this.radii.y,
                0,
                this.start.angle,
                this.end.angle,
                !this.clockwise
            ), state)
        }
    }
}

export class RoundTopLeftCornerStrategyImpl extends RoundCornerStrategyImpl implements TopLeftCorner{

    public moveToEndingPoint(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        currentPath.moveTo(this.end.point, state)
    }

    public finishRect(currentPath: CurrentPath, state: InfiniteCanvasState): void {
        this.draw(currentPath, state)
        currentPath.moveTo(this.corner, state)
    }
}

function getAdjustedOrientation(
    orientation: CornerOrientation,
    horizontalOrientation: EdgeOrientation,
    verticalOrientation: EdgeOrientation
): CornerOrientation{
    if(horizontalOrientation === EdgeOrientation.Negative){
        orientation = invertHorizontal(orientation)
    }
    if(verticalOrientation === EdgeOrientation.Negative){
        orientation = invertVertical(orientation)
    }
    return orientation
}

function getCornerLocations(orientation: CornerOrientation, corner: Point, radii: SingleCornerRadii): CornerLocations{
    switch(orientation){
        case CornerOrientation.TOPLEFT: return {
            center: new Point(corner.x + radii.x, corner.y + radii.y),
            start: {
                angle: Math.PI,
                point: new Point(corner.x, corner.y + radii.y)
            },
            end:  {
                angle: 3 * Math.PI / 2,
                point: new Point(corner.x + radii.x, corner.y)
            }
        }
        case CornerOrientation.TOPRIGHT: return {
            center: new Point(corner.x - radii.x, corner.y + radii.y),
            start: {
                angle: 3 * Math.PI / 2,
                point: new Point(corner.x - radii.x, corner.y)
            },
            end:  {
                angle: 0,
                point: new Point(corner.x, corner.y + radii.y)
            }
        }
        case CornerOrientation.BOTTOMRIGHT: return {
            center: new Point(corner.x - radii.x, corner.y - radii.y),
            start: {
                angle: 0,
                point: new Point(corner.x, corner.y - radii.y)
            },
            end: {
                angle: Math.PI / 2,
                point: new Point(corner.x - radii.x, corner.y)
            }
        }
        case CornerOrientation.BOTTOMLEFT: return {
            center: new Point(corner.x + radii.x, corner.y - radii.y),
            start:  {
                angle: Math.PI / 2,
                point: new Point(corner.x + radii.x, corner.y)
            },
            end: {
                angle: Math.PI,
                point: new Point(corner.x, corner.y - radii.y)
            }
        }
    }
}