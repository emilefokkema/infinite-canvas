export interface DrawingIterationProvider{
    provideDrawingIteration(draw: () => boolean): void;
}