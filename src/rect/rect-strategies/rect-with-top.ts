import { Area } from '../../areas/area';
import { ConvexPolygon } from '../../areas/polygons/convex-polygon';
import { Corner, TopLeftCorner } from '../corners/corner-strategy';
import { WithStart } from '../dimension';
import { Rect, Shape } from '../rect'
import { RectLikeShape } from "./rect-like-shape";

export class RectWithTop extends RectLikeShape implements Rect{

    constructor(
        private readonly vertical: WithStart,
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