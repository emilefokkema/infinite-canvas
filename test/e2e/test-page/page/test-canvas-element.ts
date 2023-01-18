import { CanvasElementOnE2eTestPage, EventListenerOnE2ETestPage, InfiniteCanvasOnE2ETestPage } from "./interfaces";
import { ElementEventMap } from '../shared/element-event-map';
import { WithFunctionsAsStrings } from "../utils";
import { EventListenerConfiguration, InfiniteCanvasE2EInitialization } from "../shared/configuration";
import { AttachedEventListener } from './attached-event-listener';
import { TestCanvas } from './test-canvas';
import InfiniteCanvas from 'infinite-canvas';

export class TestCanvasElement implements CanvasElementOnE2eTestPage{
    constructor(private readonly canvasEl: HTMLCanvasElement){

    }
    public addEventListener<Type extends keyof ElementEventMap>(config: WithFunctionsAsStrings<EventListenerConfiguration<ElementEventMap, Type>>): EventListenerOnE2ETestPage<ElementEventMap[Type]>{
        return new AttachedEventListener(this.canvasEl, config);
    }
    public setAttribute(name: string, value: string): void{
        this.canvasEl.setAttribute(name, value);
    }
    public getCanvasElement(): HTMLCanvasElement{
        return this.canvasEl;
    }
    public initializeInfiniteCanvas(config: WithFunctionsAsStrings<InfiniteCanvasE2EInitialization>): InfiniteCanvasOnE2ETestPage{
        const {
            greedyGestureHandling,
            rotationEnabled,
            units,
            drawing
        } = config;
        const infCanvas = new InfiniteCanvas(this.canvasEl);
        if(greedyGestureHandling !== undefined){
            infCanvas.greedyGestureHandling = greedyGestureHandling;
        }
        if(rotationEnabled !== undefined){
            infCanvas.rotationEnabled = rotationEnabled;
        }
        if(units !== undefined){
            infCanvas.units = units === 0 ? InfiniteCanvas.CSS_UNITS : InfiniteCanvas.CANVAS_UNITS;
        }
        const drawingFn = eval(drawing);
        const context = infCanvas.getContext();
        drawingFn(context);
        return new TestCanvas(infCanvas);
    }
}