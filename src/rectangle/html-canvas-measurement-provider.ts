import { CanvasMeasurement } from "./canvas-measurement";
import { CanvasMeasurementProvider } from "./canvas-measurement-provider";

export class HtmlCanvasMeasurementProvider implements CanvasMeasurementProvider{
    constructor(private readonly canvas: HTMLCanvasElement){}

    public measure(): CanvasMeasurement{
        const rect: DOMRect = this.canvas.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top,
            screenWidth: rect.width,
            screenHeight: rect.height,
            viewboxWidth: this.canvas.width,
            viewboxHeight: this.canvas.height
        };
    }
}