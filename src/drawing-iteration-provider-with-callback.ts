import { DrawingIterationProvider } from "./interfaces/drawing-iteration-provider";
import {EventSource} from "./event-utils/event-source";
import {EventDispatcher} from "./event-utils/event-dispatcher";

export class DrawingIterationProviderWithCallback implements DrawingIterationProvider{
    private _drawHappened: EventDispatcher<void> = new EventDispatcher();
    public get drawHappened(): EventSource<void>{return this._drawHappened;}
    constructor(private readonly drawingIterationProvider: DrawingIterationProvider){

    }
    public provideDrawingIteration(draw: () => boolean): void{
        this.drawingIterationProvider.provideDrawingIteration(() => {
            const didDraw = draw();
            if(didDraw){
                this._drawHappened.dispatch();
            }
            return didDraw;
        });
    }
}
