import {DrawingIterationProvider} from "./interfaces/drawing-iteration-provider";

export class AnimationFrameDrawingIterationProvider implements DrawingIterationProvider{
    private animationFrameRequested: boolean = false;
    public provideDrawingIteration(draw: () => void): void {
        if(this.animationFrameRequested){
            return;
        }
        this.animationFrameRequested = true;
        requestAnimationFrame(() => {
           draw();
           this.animationFrameRequested = false;
        });
    }
}