import { CanvasMeasurement } from "./canvas-measurement";

export interface CanvasMeasurementProvider{
    measure(): CanvasMeasurement;
}