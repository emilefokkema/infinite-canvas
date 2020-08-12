import { ViewBox } from "../interfaces/viewbox";
import { Transformer } from "../transformer/transformer";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
export declare class InfiniteCanvasEvents {
    private anchorSet;
    constructor(canvasElement: HTMLCanvasElement, viewbox: ViewBox, transformer: Transformer, config: InfiniteCanvasConfig);
}
