import { AreaBuilder } from "./area-builder";
import { Transformation } from "../transformation";
import { InfiniteCanvasAreaBuilder } from "./infinite-canvas-area-builder";
import { Position } from "../geometry/position";
export declare class TransformedAreaBuilder implements AreaBuilder {
    private readonly areaBuilder;
    private readonly transformation;
    constructor(areaBuilder: InfiniteCanvasAreaBuilder, transformation: Transformation);
    addPosition(position: Position): void;
}
