import { Area } from '../../areas/area';
import { ConvexPolygon } from '../../areas/polygons/convex-polygon';
import { Corner, TopLeftCorner } from '../corners/corner-strategy';
import { WithStartAndEnd } from '../dimension';
import { Rect, Shape } from '../rect'
import { RectLikeShape } from "./rect-like-shape";

export class RectWithTopAndBottom extends RectLikeShape implements Rect{

    constructor(
        private readonly vertical: WithStartAndEnd,
        topLeftCorner: TopLeftCorner,
        ...corners: Corner[]
    ){
        super(topLeftCorner, ...corners)
    }

    public getRoundRect(): Shape{
        return this;
    }

    public getArea(): Area {
        return new ConvexPolygon(this.vertical.getHalfPlanesWithVerticalCrossSection())
    }
}