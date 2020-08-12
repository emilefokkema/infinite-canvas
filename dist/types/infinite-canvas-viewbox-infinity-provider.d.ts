import { ConvexPolygon } from "./areas/polygons/convex-polygon";
import { Transformation } from "./transformation";
import { ViewboxInfinityProvider } from "./interfaces/viewbox-infinity-provider";
import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
export declare class InfiniteCanvasViewboxInfinityProvider implements ViewboxInfinityProvider {
    readonly viewBoxWidth: number;
    readonly viewBoxHeight: number;
    viewBoxRectangle: ConvexPolygon;
    viewBoxTransformation: Transformation;
    constructor(viewBoxWidth: number, viewBoxHeight: number);
    getForPath(): PathInfinityProvider;
}
