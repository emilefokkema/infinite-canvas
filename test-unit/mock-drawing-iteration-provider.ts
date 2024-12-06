import { DrawingIterationProvider } from "src/interfaces/drawing-iteration-provider";

export class MockDrawingIterationProvider implements DrawingIterationProvider{
    private latestDrawCall: () => void;
    private halted: boolean = false;

    public execute(): void{
        this.latestDrawCall?.();
    }
    public resume(): void{
        this.halted = false;
        this.execute();
    }
    public halt(): void{
        this.halted = true;
    }
    public provideDrawingIteration(draw: () => void): void{
        this.latestDrawCall = draw;
        if(this.halted){
            return;
        }
        this.execute();
    }
}