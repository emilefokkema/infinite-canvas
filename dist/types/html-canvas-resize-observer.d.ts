import { CanvasResizeObserver } from "./canvas-resize-observer";
export declare class HtmlCanvasResizeObserver implements CanvasResizeObserver {
    private readonly canvas;
    private listeners;
    private observer;
    constructor(canvas: HTMLCanvasElement);
    private notifyListeners;
    private createObserver;
    addListener(listener: () => void): void;
    removeListener(listener: () => void): void;
}
