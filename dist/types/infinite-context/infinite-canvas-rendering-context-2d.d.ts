export interface InfiniteCanvasRenderingContext2D extends CanvasRenderingContext2D {
    lineToInfinityInDirection(x: number, y: number): void;
    moveToInfinityInDirection(x: number, y: number): void;
}
