import { RectWithFourEdges, Shape } from '../rect'
import { CornerRadii, scaleCornerRadii } from "../corner-radii";
import { VisibleCorner, VisibleTopLeftCorner } from "../corners/corner-strategy";
import { WithStartAndEnd } from "../dimension";
import { RectLikeShape } from "./rect-like-shape";
import { ConvexPolygon } from '../../areas/polygons/convex-polygon';

export class RectWithFourEdgesImpl extends RectLikeShape implements RectWithFourEdges{
    constructor(
        private readonly vertical: WithStartAndEnd,
        private readonly horizontal: WithStartAndEnd,
        private readonly topLeft: VisibleTopLeftCorner,
        private readonly topRight: VisibleCorner,
        private readonly bottomRight: VisibleCorner,
        private readonly bottomLeft: VisibleCorner){
            super(topLeft, topRight, bottomRight, bottomLeft)
        }
    public getRoundRect(cornerRadii: CornerRadii): Shape{
        const leftSideLength = this.vertical.getLength();
        const topSideLength = this.horizontal.getLength()
        const minRatio = Math.min(
            leftSideLength / (cornerRadii.upperLeft.y + cornerRadii.lowerLeft.y),
            leftSideLength / (cornerRadii.upperRight.y + cornerRadii.lowerRight.y),
            topSideLength / (cornerRadii.upperLeft.x + cornerRadii.upperRight.x),
            topSideLength / (cornerRadii.lowerLeft.x + cornerRadii.lowerRight.x)
        )
        if(minRatio < 1){
            cornerRadii = scaleCornerRadii(cornerRadii, minRatio)
        }
        const bottomRightCorner = this.bottomRight.round(cornerRadii.lowerRight)
        const topLeftCorner = this.topLeft.round(cornerRadii.upperLeft)
        const topRightCorner = this.topRight.round(cornerRadii.upperRight)
        const bottomLeftCorner = this.bottomLeft.round(cornerRadii.lowerLeft)
        return new RectLikeShape(
            topLeftCorner,
            topRightCorner,
            bottomRightCorner,
            bottomLeftCorner
        )
    }
    public getArea(): ConvexPolygon {
        return new ConvexPolygon([
            ...this.horizontal.getHalfPlanesWithHorizontalCrossSection(),
            ...this.vertical.getHalfPlanesWithVerticalCrossSection()
        ])
    }
}
