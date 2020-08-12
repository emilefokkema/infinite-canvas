import { TransformerContext } from "./transformer-context";
import { Movable } from "./movable";
import { TwoAnchorGesture } from "./two-anchor-gesture";
export declare class TranslateZoom extends TwoAnchorGesture {
    constructor(movable1: Movable, movable2: Movable, context: TransformerContext);
    protected setTransformation(): void;
}
