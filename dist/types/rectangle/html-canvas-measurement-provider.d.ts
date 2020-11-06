import { CanvasMeasurement } from "./canvas-measurement";
import { CanvasMeasurementProvider } from "./canvas-measurement-provider";
export declare class HtmlCanvasMeasurementProvider implements CanvasMeasurementProvider {
    private readonly canvas;
    constructor(canvas: HTMLCanvasElement);
    measure(): CanvasMeasurement;
}
