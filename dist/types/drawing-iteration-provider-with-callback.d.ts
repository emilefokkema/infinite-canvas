import { DrawingIterationProvider } from "./interfaces/drawing-iteration-provider";
export declare class DrawingIterationProviderWithCallback implements DrawingIterationProvider {
    private readonly drawingIterationProvider;
    private _drawCallback;
    constructor(drawingIterationProvider: DrawingIterationProvider);
    provideDrawingIteration(draw: () => void): void;
    onDraw(callback: () => void): void;
}
