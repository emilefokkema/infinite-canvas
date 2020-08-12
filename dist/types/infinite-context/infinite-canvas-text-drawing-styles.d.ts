import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasTextDrawingStyles implements CanvasTextDrawingStyles {
    private readonly viewBox;
    constructor(viewBox: ViewBox);
    set direction(value: CanvasDirection);
    set font(value: string);
    set textAlign(value: CanvasTextAlign);
    set textBaseline(value: CanvasTextBaseline);
}
