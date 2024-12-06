import { CanvasMeasurementProvider } from "./canvas-measurement-provider";
import { RectangleManager } from "./rectangle-manager";
import { Config } from "api/config";
import { TransformationRepresentation } from "api/transformation-representation";
import { Units } from "api/units";
import { CanvasRectangle } from "./canvas-rectangle";
import { CanvasRectangleImpl } from './canvas-rectangle-impl'
import { Transformation } from "../transformation";

export class RectangleManagerImpl implements RectangleManager{
    public rectangle: CanvasRectangle
    private transformation: TransformationRepresentation
    constructor(
            private readonly measurementProvider: CanvasMeasurementProvider,
            private readonly config: Partial<Config>){
        this.transformation = Transformation.identity;
    }
    public setTransformation(transformation: TransformationRepresentation): void {
        if(this.rectangle){
            this.rectangle = this.rectangle.withTransformation(transformation)
        }else{
            this.transformation = transformation;
        }
    }

    public measure(): void {
        const newUnitsToUse = this.config.units === Units.CSS ? Units.CSS : Units.CANVAS;
        const measurement = this.measurementProvider.measure();
        if(measurement.screenWidth === 0 || measurement.screenHeight === 0){
            this.rectangle = undefined;
        }else if(this.rectangle){
            this.rectangle = this.rectangle.withUnits(newUnitsToUse).withMeasurement(measurement)
        }else{
            this.rectangle = CanvasRectangleImpl.create(measurement, newUnitsToUse).withTransformation(this.transformation);
        }
    }
}