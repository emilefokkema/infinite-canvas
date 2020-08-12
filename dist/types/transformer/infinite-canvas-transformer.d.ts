import { Transformer } from "./transformer";
import { Anchor } from "./anchor";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
import { TransformableBox } from "../interfaces/transformable-box";
export declare class InfiniteCanvasTransformer implements Transformer {
    private readonly viewBox;
    private gesture;
    private context;
    private _zoom;
    constructor(viewBox: TransformableBox, config: InfiniteCanvasConfig);
    private createAnchor;
    zoom(x: number, y: number, scale: number): void;
    getAnchor(x: number, y: number): Anchor;
    getRotationAnchor(x: number, y: number): Anchor;
}
