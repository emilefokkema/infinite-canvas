export interface CanvasResizeObserver {
    addListener(listener: () => void): void;
    removeListener(listener: () => void): void;
}
