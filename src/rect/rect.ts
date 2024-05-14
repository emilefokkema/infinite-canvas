import { Area } from "../areas/area"
import { ConvexPolygon } from "../areas/polygons/convex-polygon"
import { DrawingInstruction } from "../drawing-instruction"
import { Instruction } from "../instructions/instruction"
import { CurrentPath } from "../interfaces/current-path"
import { InfiniteCanvasState } from "../state/infinite-canvas-state"
import { CornerRadii } from "./corner-radii"

export interface Shape {
    addSubpaths(currentPath: CurrentPath, state: InfiniteCanvasState): void
    stroke(state: InfiniteCanvasState, instruction: Instruction): DrawingInstruction
    fill(state: InfiniteCanvasState, instruction: Instruction): DrawingInstruction
}

export interface Rect extends Shape{
    getRoundRect(cornerRadii: CornerRadii): Shape
    getArea(): Area | undefined
}

export interface RectWithFourEdges extends Rect{
    getArea(): ConvexPolygon
}