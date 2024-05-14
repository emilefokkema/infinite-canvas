import { Rect, Shape } from '../rect'
import { CornerRadii, scaleCornerRadii } from "../corner-radii";
import { Corner, VisibleCorner, VisibleTopLeftCorner } from "../corners/corner-strategy";
import { WithStart, WithStartAndEnd } from "../dimension";
import { RectLikeShape } from "./rect-like-shape";
import { Area } from '../../areas/area';
import { ConvexPolygon } from '../../areas/polygons/convex-polygon';

export class RectWithTopAndLeftAndRight extends RectLikeShape implements Rect{
    constructor(
        private readonly horizontal: WithStartAndEnd,
        private readonly vertical: WithStart,
        private readonly topLeft: VisibleTopLeftCorner,
        private readonly topRightCorner: VisibleCorner,
        private readonly bottom: Corner
        ){
            super(topLeft, topRightCorner, bottom)
        }
    public getRoundRect(cornerRadii: CornerRadii): Shape{
        const topSideLength = this.horizontal.getLength()
        const cornerRadiiSum = cornerRadii.upperLeft.x + cornerRadii.upperRight.x;
        const ratio = topSideLength / cornerRadiiSum;
        if(ratio < 1){
            cornerRadii = scaleCornerRadii(cornerRadii, ratio)
        }
        const topRightCorner = this.topRightCorner.round(cornerRadii.upperRight)
        const topLeftCorner = this.topLeft.round(cornerRadii.upperLeft)
        return new RectLikeShape(
            topLeftCorner,
            topRightCorner,
            this.bottom
        )
    }

    public getArea(): Area {
        return new ConvexPolygon([
            ...this.vertical.getHalfPlanesWithVerticalCrossSection(),
            ...this.horizontal.getHalfPlanesWithHorizontalCrossSection()
        ])
    }
}