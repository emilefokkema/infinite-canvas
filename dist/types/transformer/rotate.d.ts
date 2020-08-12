import { Movable } from "./movable";
import { TransformableBox } from "../interfaces/transformable-box";
export declare class Rotate {
    private readonly viewBox;
    private point;
    private angularVelocity;
    private initialTransformation;
    constructor(movable: Movable, viewBox: TransformableBox);
    private setTransformation;
    end(): void;
}
