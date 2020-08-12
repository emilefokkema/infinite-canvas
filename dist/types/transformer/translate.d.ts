import { Gesture } from "./gesture";
import { TransformerContext } from "./transformer-context";
import { Movable } from "./movable";
export declare class Translate implements Gesture {
    private readonly context;
    private point;
    private initialTransformation;
    constructor(movable: Movable, context: TransformerContext);
    private setTransformation;
    private getTranslation;
    withMovable(movable: Movable): Gesture;
    withoutMovable(movable: Movable): Gesture;
}
