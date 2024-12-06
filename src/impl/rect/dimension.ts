import { HalfPlane } from "../areas/polygons/half-plane"
import { PointAtInfinity } from "../geometry/point-at-infinity"
import { EdgeOrientation } from "./edge-orientation"
import { Rect, RectWithFourEdges } from "./rect"

export interface Dimension{
    start: number
    orientation: EdgeOrientation
    horizontalLineEnd: PointAtInfinity
    horizontalLineStart: PointAtInfinity
    verticalLineEnd: PointAtInfinity
    verticalLineStart: PointAtInfinity
    addVerticalDimension(vertical: Dimension): Rect
    addEntireHorizontalDimension(horizontal: Dimension): Rect
    addHorizontalDimensionAtInfinity(horizontal: Dimension): Rect
    addHorizontalDimensionWithStart(horizontal: WithStart): Rect
    addHorizontalDimensionWithStartAndEnd(horizontal: WithStartAndEnd): Rect
}

export interface WithStart extends Dimension{
    finiteStart: number
    getHalfPlanesWithHorizontalCrossSection(): HalfPlane[]
    getHalfPlanesWithVerticalCrossSection(): HalfPlane[]
}

export interface WithStartAndEnd extends WithStart{
    end: number
    getLength(): number
    addHorizontalDimensionWithStartAndEnd(horizontal: WithStartAndEnd): RectWithFourEdges
}