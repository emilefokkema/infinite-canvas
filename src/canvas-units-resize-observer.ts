import { CanvasMeasurementProvider } from "./rectangle/canvas-measurement-provider";
import { EventSource } from "./event-utils/event-source";
import { CanvasMeasurement } from "./rectangle/canvas-measurement";
import { ViewBox } from "./interfaces/viewbox";

function canvasIsVisible(measurement: CanvasMeasurement): boolean{
    const { screenWidth, screenHeight } = measurement;
    return screenWidth > 0 && screenHeight > 0;
}

export class CanvasUnitsResizeObserver{
    private currentlyVisible: boolean = false;
    private listener: (measurement: CanvasMeasurement) => void;
    constructor(
        private readonly measurementProvider: CanvasMeasurementProvider,
        private readonly resizes: EventSource<CanvasMeasurement>,
        private readonly viewBox: ViewBox){

    }
    public observe(): void{
        const measurement = this.measurementProvider.measure();
        this.currentlyVisible = canvasIsVisible(measurement);
        const listener = (newMeasurement: CanvasMeasurement) => {
            const newlyVisible = canvasIsVisible(newMeasurement);
            if(newlyVisible && !this.currentlyVisible){
                this.viewBox.draw();
            }
            this.currentlyVisible = newlyVisible;
        }
        this.resizes.addListener(listener)
        this.listener = listener;
    }
    public disconnect(): void{
        if(!this.listener){
            return;
        }
        this.resizes.removeListener(this.listener)
        this.listener = undefined;
    }
}