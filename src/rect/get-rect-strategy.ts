import { getDimension, getWithStartAndEnd } from "./dimension-impl";
import { Rect, RectWithFourEdges } from './rect'

export function getRectStrategy(x: number, y: number, w: number, h: number): Rect{
    const horizontalSide = getDimension(x, w)
    const verticalSide = getDimension(y, h)
    return horizontalSide.addVerticalDimension(verticalSide)
}

export function getRectWithFourEdges(x: number, y: number, w: number, h: number): RectWithFourEdges{
    const horizontalSide = getWithStartAndEnd(x, w)
    const verticalSide = getWithStartAndEnd(y, h)
    return verticalSide.addHorizontalDimensionWithStartAndEnd(horizontalSide);
}