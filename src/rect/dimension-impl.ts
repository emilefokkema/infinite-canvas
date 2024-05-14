import { EdgeOrientation } from "./edge-orientation";
import { down, left, right, up } from "../geometry/points-at-infinity";
import { PointAtInfinity } from "../geometry/point-at-infinity";
import { Dimension, WithStart, WithStartAndEnd } from "./dimension";
import { Rect, RectWithFourEdges } from "./rect";
import { RectWithLeft } from "./rect-strategies/rect-with-left";
import { RectWithTop } from "./rect-strategies/rect-with-top";
import { RectWithTopAndLeft } from "./rect-strategies/rect-with-top-and-left";
import { RectWithLeftAndRight } from "./rect-strategies/rect-with-left-and-right";
import { RectWithTopAndLeftAndRight } from "./rect-strategies/rect-with-top-and-left-and-right";
import { RectWithTopAndBottom } from "./rect-strategies/rect-with-top-and-bottom";
import { RectWithTopAndLeftAndBottom } from "./rect-strategies/rect-with-top-and-left-and-bottom";
import { RectWithFourEdgesImpl } from "./rect-strategies/rect-with-four-edges";
import { RectAtInfinity } from "./rect-strategies/rect-at-infinity";
import { PlaneRect } from "./rect-strategies/plane-rect";
import { UndrawableRectangle } from "./rect-strategies/undrawable-rectangle";
import { VisibleTopLeftCornerImpl, InfiniteCorner, InfiniteTopLeftCornerFromInfinityToInfinity, InfiniteTopLeftCorner, InfiniteCornerFromInfinityToInfinity, VisibleCornerImpl } from "./corners/corner-strategy-impl";
import { Corner, VisibleCorner, VisibleTopLeftCorner, TopLeftCorner } from "./corners/corner-strategy";
import { Point } from "../geometry/point";
import { CornerOrientation } from "./corners/corner-orientation";
import { HalfPlane } from "../areas/polygons/half-plane";

class LineImpl implements Dimension{
    public readonly horizontalLineEnd: PointAtInfinity
    public readonly horizontalLineStart: PointAtInfinity
    public readonly verticalLineEnd: PointAtInfinity
    public readonly verticalLineStart: PointAtInfinity
    constructor(
        public readonly start: number,
        public readonly orientation: EdgeOrientation){
            this.horizontalLineStart = orientation === EdgeOrientation.Positive ? left : right;
            this.horizontalLineEnd = orientation === EdgeOrientation.Positive ? right : left;
            this.verticalLineStart = orientation === EdgeOrientation.Positive ? up : down;
            this.verticalLineEnd = orientation === EdgeOrientation.Positive ? down : up;
    }
    private createTopLeftAtVerticalInfinity(horizontal: WithStart): TopLeftCorner{
        return new InfiniteTopLeftCornerFromInfinityToInfinity(new Point(horizontal.finiteStart, 0), this.verticalLineStart);
    }
    private createBottomRightAtInfinity(horizontal: WithStartAndEnd): Corner{
        return new InfiniteCornerFromInfinityToInfinity(new Point(horizontal.end, 0), this.verticalLineEnd);
    }
    protected createRightAtInfinity(horizontal: WithStart): Corner{
        return new InfiniteCorner(horizontal.horizontalLineEnd)
    }
    protected createBottomAtInfinity(): Corner{
        return new InfiniteCorner(this.verticalLineEnd)
    }
    public addVerticalDimension(verticalSide: Dimension): Rect{
        return verticalSide.addEntireHorizontalDimension(this)
    }
    public addEntireHorizontalDimension(horizontal: Dimension): Rect{
        return new PlaneRect(horizontal, this);
    }
    public addHorizontalDimensionAtInfinity(horizontal: Dimension): Rect{
        return new UndrawableRectangle(horizontal, this);
    }
    public addHorizontalDimensionWithStart(horizontal: WithStart): Rect{
        const topLeft = this.createTopLeftAtVerticalInfinity(horizontal)
        const right = this.createRightAtInfinity(horizontal)
        const bottom = this.createBottomAtInfinity()
        return new RectWithLeft(horizontal, topLeft, right, bottom);
    }
    public addHorizontalDimensionWithStartAndEnd(horizontal: WithStartAndEnd): Rect{
        const topLeft = this.createTopLeftAtVerticalInfinity(horizontal)
        const bottomRight = this.createBottomRightAtInfinity(horizontal)
        return new RectWithLeftAndRight(horizontal, topLeft, bottomRight)
    }
}

class DimensionAtInfinity extends LineImpl implements Dimension{

    public addVerticalDimension(verticalSide: Dimension): Rect{
        return verticalSide.addHorizontalDimensionAtInfinity(this)
    }
    public addEntireHorizontalDimension(horizontal: Dimension): Rect{
        return new UndrawableRectangle(horizontal, this);
    }
    public addHorizontalDimensionAtInfinity(horizontal: Dimension): Rect{
        return new UndrawableRectangle(horizontal, this);
    }
    public addHorizontalDimensionWithStart(): Rect{
        return new RectAtInfinity(this.verticalLineEnd)
    }
    public addHorizontalDimensionWithStartAndEnd(): Rect{
        return new RectAtInfinity(this.verticalLineEnd)
    }
}

class WithStartImpl extends LineImpl implements WithStart{
    constructor(
        orientation: EdgeOrientation,
        public readonly finiteStart: number){
            super(finiteStart, orientation)
        }
    private createBottomLeftAtInfinity(horizontal: Dimension): Corner{
        return new InfiniteCorner(horizontal.horizontalLineStart)
    }
    protected createLeftAtInfinity(horizontal: Dimension): TopLeftCorner{
        return new InfiniteTopLeftCorner(horizontal.horizontalLineStart)
    }
    protected createTopRightAtHorizontalInfinity(horizontal: Dimension): Corner{
        return new InfiniteCornerFromInfinityToInfinity(new Point(0, this.finiteStart), horizontal.horizontalLineEnd);
    }
    protected createTopLeft(horizontal: WithStart): VisibleTopLeftCorner{
        return new VisibleTopLeftCornerImpl(
            new Point(horizontal.finiteStart, this.finiteStart),
            CornerOrientation.TOPLEFT,
            horizontal.orientation,
            this.orientation)
    }
    protected createTopRight(horizontal: WithStartAndEnd): VisibleCorner{
        return new VisibleCornerImpl(
            new Point(horizontal.end, this.finiteStart),
            CornerOrientation.TOPRIGHT,
            horizontal.orientation,
            this.orientation)
    }
    protected getStartingHalfPlaneWithHorizontalCrossSection(): HalfPlane {
        const normal = this.orientation === EdgeOrientation.Positive ? new Point(1, 0) : new Point(-1, 0)
        const base = new Point(this.finiteStart, 0)
        return new HalfPlane(base, normal)
    }
    protected getStartingHalfPlaneWithVerticalCrossSection(): HalfPlane {
        const normal = this.orientation === EdgeOrientation.Positive ? new Point(0, 1) : new Point(0, -1)
        const base = new Point(0, this.finiteStart)
        return new HalfPlane(base, normal)
    }
    public addVerticalDimension(verticalSide: Dimension): Rect{
        return verticalSide.addHorizontalDimensionWithStart(this)
    }
    public addEntireHorizontalDimension(horizontal: Dimension): Rect{
        const left = this.createLeftAtInfinity(horizontal)
        const topRight = this.createTopRightAtHorizontalInfinity(horizontal)
        const bottomRight = this.createBottomAtInfinity()
        const bottomLeft = this.createBottomLeftAtInfinity(horizontal)
        return new RectWithTop(this, left, topRight, bottomRight, bottomLeft);
    }
    public addHorizontalDimensionAtInfinity(horizontal: Dimension): Rect{
        return new RectAtInfinity(horizontal.horizontalLineEnd)
    }
    public addHorizontalDimensionWithStart(horizontal: WithStart): Rect{
        const right = this.createRightAtInfinity(horizontal)
        const bottom = this.createBottomAtInfinity()
        const topLeft = this.createTopLeft(horizontal)
        return new RectWithTopAndLeft(horizontal, this, topLeft, right, bottom);
    }
    public addHorizontalDimensionWithStartAndEnd(horizontal: WithStartAndEnd): Rect{
        const bottom = this.createBottomAtInfinity()
        const finiteTopLeft = this.createTopLeft(horizontal)
        const topRight = this.createTopRight(horizontal)
        return new RectWithTopAndLeftAndRight(horizontal, this, finiteTopLeft, topRight, bottom);
    }
    public getHalfPlanesWithHorizontalCrossSection(): HalfPlane[] {
        return [this.getStartingHalfPlaneWithHorizontalCrossSection()]
    }
    public getHalfPlanesWithVerticalCrossSection(): HalfPlane[] {
        return [this.getStartingHalfPlaneWithVerticalCrossSection()]
    }
}

class RectSideWithStartAndEndImpl extends WithStartImpl implements WithStartAndEnd{
    constructor(
        orientation: EdgeOrientation,
        start: number,
        public readonly end: number){
            super(orientation, start)
        }
    private createBottomLeftAtHorizontalInfinity(horizontal: Dimension): Corner{
        return new InfiniteCornerFromInfinityToInfinity(new Point(0, this.end), horizontal.horizontalLineStart);
    }
    private getEndingHalfPlaneWithHorizontalCrossSection(): HalfPlane {
        const normal = this.orientation === EdgeOrientation.Positive ? new Point(-1, 0) : new Point(1, 0)
        const base = new Point(this.end, 0)
        return new HalfPlane(base, normal)
    }
    private getEndingHalfPlaneWithVerticalCrossSection(): HalfPlane {
        const normal = this.orientation === EdgeOrientation.Positive ? new Point(0, -1) : new Point(0, 1)
        const base = new Point(0, this.end)
        return new HalfPlane(base, normal)
    }
    private createBottomLeft(horizontal: WithStart): VisibleCorner{
        return new VisibleCornerImpl(
            new Point(horizontal.finiteStart, this.end),
            CornerOrientation.BOTTOMLEFT,
            horizontal.orientation,
            this.orientation)
    }
    private createBottomRight(horizontal: WithStartAndEnd): VisibleCorner{
        return new VisibleCornerImpl(
            new Point(horizontal.end, this.end),
            CornerOrientation.BOTTOMRIGHT,
            horizontal.orientation,
            this.orientation)
    }
    public getLength(): number{
        return Math.abs(this.end - this.finiteStart)
    }
    public addEntireHorizontalDimension(horizontal: Dimension): Rect{
        const left = this.createLeftAtInfinity(horizontal)
        const topRight = this.createTopRightAtHorizontalInfinity(horizontal)
        const bottomLeft = this.createBottomLeftAtHorizontalInfinity(horizontal)
        return new RectWithTopAndBottom(this, left, topRight, bottomLeft)
    }
    public addHorizontalDimensionAtInfinity(horizontal: Dimension): Rect{
        return new RectAtInfinity(horizontal.horizontalLineEnd)
    }
    public addVerticalDimension(verticalSide: Dimension): Rect{
        return verticalSide.addHorizontalDimensionWithStartAndEnd(this)
    }
    public addHorizontalDimensionWithStart(horizontal: WithStart): Rect{
        const right = this.createRightAtInfinity(horizontal)
        const finiteTopLeft = this.createTopLeft(horizontal)
        const bottomLeft = this.createBottomLeft(horizontal)
        return new RectWithTopAndLeftAndBottom(this, horizontal, finiteTopLeft, right, bottomLeft);
    }
    public addHorizontalDimensionWithStartAndEnd(horizontal: WithStartAndEnd): RectWithFourEdges{
        const topLeft = this.createTopLeft(horizontal)
        const topRight = this.createTopRight(horizontal)
        const bottomLeft = this.createBottomLeft(horizontal)
        const bottomRight = this.createBottomRight(horizontal)
        return new RectWithFourEdgesImpl(
            this,
            horizontal,
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        );
    }
    public getHalfPlanesWithHorizontalCrossSection(): HalfPlane[] {
        return [
            this.getStartingHalfPlaneWithHorizontalCrossSection(),
            this.getEndingHalfPlaneWithHorizontalCrossSection()
        ]
    }
    public getHalfPlanesWithVerticalCrossSection(): HalfPlane[] {
        return [
            this.getStartingHalfPlaneWithVerticalCrossSection(),
            this.getEndingHalfPlaneWithVerticalCrossSection()
        ]
    }
}

export function getWithStartAndEnd(start: number, length: number): WithStartAndEnd{
    const orientation = length > 0 ? EdgeOrientation.Positive : EdgeOrientation.Negative;
    return new RectSideWithStartAndEndImpl(orientation, start, start + length)
}

export function getDimension(start: number, length: number): Dimension{
    const orientation = length > 0 ? EdgeOrientation.Positive : EdgeOrientation.Negative;
    const line = new LineImpl(start, orientation)
    if(Number.isFinite(start)){
        if(Number.isFinite(length)){
            return new RectSideWithStartAndEndImpl(orientation, start, start + length)
        }
        return new WithStartImpl(orientation, start);
    }
    if(Number.isFinite(length)){
        if(start < 0){
            return new DimensionAtInfinity(start, EdgeOrientation.Negative)
        }
        return new DimensionAtInfinity(start, EdgeOrientation.Positive)
    }
    if(start > 0){
        if(orientation === EdgeOrientation.Positive){
            return new DimensionAtInfinity(start, EdgeOrientation.Positive)
        }
        return line
    }
    if(orientation === EdgeOrientation.Positive){
        return line
    }
    return new DimensionAtInfinity(start, EdgeOrientation.Negative)
}