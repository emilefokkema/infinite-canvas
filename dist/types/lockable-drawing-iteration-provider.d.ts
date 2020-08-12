import { DrawingIterationProvider } from "./interfaces/drawing-iteration-provider";
import { DrawingLock } from "./drawing-lock";
export declare class LockableDrawingIterationProvider implements DrawingIterationProvider {
    private readonly drawingIterationProvider;
    private _draw;
    private _locks;
    constructor(drawingIterationProvider: DrawingIterationProvider);
    private removeLock;
    provideDrawingIteration(draw: () => void): void;
    getLock(): DrawingLock;
}
