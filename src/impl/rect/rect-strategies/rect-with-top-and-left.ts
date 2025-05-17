import { Rect, Shape } from '../rect'
import { CornerRadii } from "../corner-radii";
import { Corner, VisibleTopLeftCorner } from "../corners/corner-strategy";
import { RectLikeShape } from "./rect-like-shape";
import { WithStart } from '../dimension';
import { Area } from '../../areas/area';
import { ConvexPolygon } from '../../areas/polygons/convex-polygon';

export class RectWithTopAndLeft extends RectLikeShape implements Rect{
    constructor(
        private readonly horizontal: WithStart,
        private readonly vertical: WithStart,
        private readonly topLeft: VisibleTopLeftCorner,
        private readonly right: Corner,
        private readonly bottom: Corner){
            super(topLeft, right, bottom)
        }
    public getRoundRect(cornerRadii: CornerRadii): Shape{
        const roundCorner = this.topLeft.round(cornerRadii.upperLeft)
        return new RectLikeShape(
            roundCorner,
            this.right,
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