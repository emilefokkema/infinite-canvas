import { TransformerContext } from "./transformer-context";
import { Transformation } from "../transformation";
import { Gesture } from "./gesture";
import { Transformable } from "../transformable";
import { Movable } from "./movable";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
export declare class InfiniteCanvasTransformerContext implements TransformerContext {
    private readonly transformable;
    private readonly config;
    constructor(transformable: Transformable, config: InfiniteCanvasConfig);
    get transformation(): Transformation;
    set transformation(value: Transformation);
    getGestureForOneMovable(movable: Movable): Gesture;
    getGestureForTwoMovables(movable1: Movable, movable2: Movable): Gesture;
}
