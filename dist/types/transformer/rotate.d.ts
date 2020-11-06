import { Movable } from "./movable";
import { Transformable } from "../transformable";
export declare class Rotate {
    private readonly transformable;
    private point;
    private angularVelocity;
    private initialTransformation;
    constructor(movable: Movable, transformable: Transformable);
    private setTransformation;
    end(): void;
}
