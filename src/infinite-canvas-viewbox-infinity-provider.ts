import {ConvexPolygon} from "./areas/polygons/convex-polygon";
import {Transformation} from "./transformation";
import {ViewboxInfinityProvider} from "./interfaces/viewbox-infinity-provider";
import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { InfiniteCanvasPathInfinityProvider } from "./infinite-canvas-path-infinity-provider";

export class InfiniteCanvasViewboxInfinityProvider implements ViewboxInfinityProvider{
    public viewBoxRectangle: ConvexPolygon;
    public viewBoxTransformation: Transformation = Transformation.identity;
    constructor(public readonly viewBoxWidth: number, public readonly viewBoxHeight: number) {
        this.viewBoxRectangle = ConvexPolygon.createRectangle(0, 0, viewBoxWidth, viewBoxHeight);
    }
    public getForPath(): PathInfinityProvider{
        return new InfiniteCanvasPathInfinityProvider(this);
    }
}