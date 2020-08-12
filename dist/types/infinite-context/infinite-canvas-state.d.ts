import { ViewBox } from "../interfaces/viewbox";
export declare class InfiniteCanvasState implements CanvasState {
    private viewBox;
    constructor(viewBox: ViewBox);
    restore(): void;
    save(): void;
}
