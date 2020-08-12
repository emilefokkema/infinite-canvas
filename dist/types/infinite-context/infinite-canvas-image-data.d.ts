import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasImageData implements CanvasImageData {
    private viewBox;
    constructor(viewBox: ViewBox);
    createImageData(swOrImageData: number | ImageData, sh?: number): ImageData;
    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void;
}
