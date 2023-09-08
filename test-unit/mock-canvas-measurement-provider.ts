import { CanvasMeasurement } from "../src/rectangle/canvas-measurement";
import { CanvasMeasurementProvider } from "../src/rectangle/canvas-measurement-provider";

export class MockCanvasMeasurementProvider implements CanvasMeasurementProvider{
    public measurement: CanvasMeasurement;
    constructor(private readonly width: number, private readonly height: number){
        this.measurement = {
            left: 0,
            top: 0,
            screenWidth: this.width,
            screenHeight: this.height,
            viewboxWidth: this.width,
            viewboxHeight: this.height
        };
    }

    public measure(): CanvasMeasurement{
        return this.measurement;
    }
}
