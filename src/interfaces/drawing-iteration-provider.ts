export interface DrawingIterationProvider{
    provideDrawingIteration(draw: () => void): void;
}