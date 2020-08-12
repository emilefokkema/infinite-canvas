import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasShadowStyles implements CanvasShadowStyles {
    private readonly viewBox;
    constructor(viewBox: ViewBox);
    get shadowBlur(): number;
    set shadowBlur(value: number);
    get shadowOffsetX(): number;
    set shadowOffsetX(value: number);
    get shadowOffsetY(): number;
    set shadowOffsetY(value: number);
    get shadowColor(): string;
    set shadowColor(value: string);
}
