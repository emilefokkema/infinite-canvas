import { DrawingIterationProvider } from "./interfaces/drawing-iteration-provider";

export class DrawingIterationProviderWithCallback implements DrawingIterationProvider{
    private _drawCallback: () => void = () => {};
    constructor(private readonly drawingIterationProvider: DrawingIterationProvider){

    }
    public provideDrawingIteration(draw: () => void): void{
        this.drawingIterationProvider.provideDrawingIteration(() => {
            draw();
            if(this._drawCallback){
                this._drawCallback();
            }
        });
    }
    public onDraw(callback: () => void): void{
        this._drawCallback = callback;
    }
}