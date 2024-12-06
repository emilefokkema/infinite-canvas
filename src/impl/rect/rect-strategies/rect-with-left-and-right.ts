import { Area } from '../../areas/area';
import { ConvexPolygon } from '../../areas/polygons/convex-polygon';
import { Corner, TopLeftCorner } from '../corners/corner-strategy';
import { WithStartAndEnd } from '../dimension';
import { Rect, Shape } from '../rect'
import { RectLikeShape } from "./rect-like-shape";

export class RectWithLeftAndRight extends RectLikeShape implements Rect{
    constructor(
        private readonly horizontal: WithStartAndEnd,
        topLeftCorner: TopLeftCorner,
        ...corners: Corner[]
    ){
        super(topLeftCorner, ...corners)
    }

    public getRoundRect(): Shape{
        return this;
    }

    public getArea(): Area {
        return new ConvexPolygon(this.horizontal.getHalfPlanesWithHorizontalCrossSection())
    }
}