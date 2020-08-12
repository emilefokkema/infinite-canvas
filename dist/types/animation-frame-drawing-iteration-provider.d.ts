import { DrawingIterationProvider } from "./interfaces/drawing-iteration-provider";
export declare class AnimationFrameDrawingIterationProvider implements DrawingIterationProvider {
    private animationFrameRequested;
    provideDrawingIteration(draw: () => void): void;
}
