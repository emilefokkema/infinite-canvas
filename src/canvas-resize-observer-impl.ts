import { EventDispatcher } from "./event-utils/event-dispatcher";
import { EventSource } from "./event-utils/event-source";
import { CanvasMeasurement } from "./rectangle/canvas-measurement";

export class CanvasResizes implements EventSource<CanvasMeasurement>{
    private readonly dispatcher: EventDispatcher<CanvasMeasurement> = new EventDispatcher();
    private observer: ResizeObserver;
    private numberOfListeners = 0;

    constructor(private readonly canvas: HTMLCanvasElement){
    }

    public addListener(listener: (event: CanvasMeasurement) => void, onRemoved?: () => void): void {
        this.dispatcher.addListener(listener, () => {
            onRemoved?.();
            this.numberOfListeners = Math.max(this.numberOfListeners - 1, 0)
            if(this.numberOfListeners === 0){
                this.disconnect();
            }
        })
        this.numberOfListeners++;
        this.connectIfNeeded();
    }

    public removeListener(listener: (event: CanvasMeasurement) => void): void {
        this.dispatcher.removeListener(listener)
    }

    private connectIfNeeded(): void{
        if(!!this.observer){
            return;
        }
        this.observer = new ResizeObserver((entries) => this.dispatcher.dispatch(this.createCanvasMeasurement(entries)))
        this.observer.observe(this.canvas)
    }

    private createCanvasMeasurement([{contentRect}]: ResizeObserverEntry[]): CanvasMeasurement{
        return {
            left: contentRect.left,
            top: contentRect.top,
            screenWidth: contentRect.width,
            screenHeight: contentRect.height,
            viewboxWidth: this.canvas.width,
            viewboxHeight: this.canvas.height
        }
    }

    private disconnect(): void{
        if(!this.observer){
            return;
        }
        this.observer.disconnect();
        this.observer = undefined;
    }
}