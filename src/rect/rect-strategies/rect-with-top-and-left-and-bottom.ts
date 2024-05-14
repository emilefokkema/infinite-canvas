import { Rect, Shape } from '../rect'
import { CornerRadii, scaleCornerRadii } from "../corner-radii";
import { Corner, VisibleCorner, VisibleTopLeftCorner } from "../corners/corner-strategy";
import { WithStart, WithStartAndEnd } from "../dimension";
import { RectLikeShape } from "./rect-like-shape";
import { Area } from '../../areas/area';
import { ConvexPolygon } from '../../areas/polygons/convex-polygon';

export class RectWithTopAndLeftAndBottom extends RectLikeShape implements Rect{
    constructor(
        private readonly vertical: WithStartAndEnd,
        private readonly horizontal: WithStart,
        private readonly topLeft: VisibleTopLeftCorner,
        private readonly right: Corner,
        private readonly bottomLeftCorner: VisibleCorner){
            super(topLeft, right, bottomLeftCorner)
        }
    public getRoundRect(cornerRadii: CornerRadii): Shape{
        const leftSideLength = this.vertical.getLength()
        const cornerRadiiSum = cornerRadii.upperLeft.y + cornerRadii.lowerLeft.y;
        const ratio = leftSideLength / cornerRadiiSum;
        if(ratio < 1){
            cornerRadii = scaleCornerRadii(cornerRadii, ratio)
        }
        const topLeftRoundCorner = this.topLeft.round(cornerRadii.upperLeft)
        const bottomLeftCorner = this.bottomLeftCorner.round(cornerRadii.lowerLeft)
        return new RectLikeShape(
            topLeftRoundCorner,
            this.right,
            bottomLeftCorner
        )
    }

    public getArea(): Area {
        return new ConvexPolygon([
            ...this.vertical.getHalfPlanesWithVerticalCrossSection(),
            ...this.horizontal.getHalfPlanesWithHorizontalCrossSection()
        ])
    }
}