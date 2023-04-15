import { CanvasMeasurementProvider } from "./canvas-measurement-provider";
import { CanvasRectangle } from "./canvas-rectangle";
import { Config } from "../api-surface/config";
import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Transformation } from "../transformation";
import { Point } from "../geometry/point";
import { TransformationRepresentation } from "../api-surface/transformation-representation";
import { InfiniteCanvasPathInfinityProvider } from "../infinite-canvas-path-infinity-provider";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { CoordinatesSwitch } from "./coordinates-switch";
import { CanvasMeasurement } from "./canvas-measurement";
import { CoordinatesSwitchImpl } from "./coordinates-switch-impl";
import { Units } from "../api-surface/units";

function measurementsAreOfEqualSize(one: CanvasMeasurement, other: CanvasMeasurement): boolean{
    if(!one){
        return !other;
    }
    if(!other){
        return false;
    }
    return one.viewboxWidth === other.viewboxWidth &&
            one.viewboxHeight === other.viewboxHeight &&
            one.screenWidth === other.screenWidth &&
            one.screenHeight === other.screenHeight;
}

export class CanvasRectangleImpl implements CanvasRectangle{
    private measurement: CanvasMeasurement
    private coordinatesSwitch: CoordinatesSwitch;
    public get viewboxWidth(): number{return this.measurement.viewboxWidth;}
    public get viewboxHeight(): number{return this.measurement.viewboxHeight}
    public polygon: ConvexPolygon;
    public get transformation(): Transformation{return this.coordinatesSwitch.userTransformation;}
    public get infiniteCanvasContextBase(): Transformation{return this.coordinatesSwitch.infiniteCanvasContext.base;}
    public get inverseInfiniteCanvasContextBase(): Transformation{return this.coordinatesSwitch.infiniteCanvasContext.inverseBase;}
    constructor(private readonly measurementProvider: CanvasMeasurementProvider, private readonly config: Partial<Config>){
        const measurement = measurementProvider.measure();
        const units = config.units === Units.CSS ? Units.CSS : Units.CANVAS;
        this.coordinatesSwitch = CoordinatesSwitchImpl.create(units, measurement);
        this.addMeasurement(measurement);
    }
    public setTransformation(transformation: TransformationRepresentation): void {
        this.coordinatesSwitch.setUserTransformation(Transformation.create(transformation))
    }
    public getCSSPosition(clientX: number, clientY: number): Point{
        const {left, top} = this.measurementProvider.measure();
        return new Point(clientX - left, clientY - top);
    }
    public getForPath(): PathInfinityProvider{
        return new InfiniteCanvasPathInfinityProvider(this);
    }
    public measure(): void {
        const newUnitsToUse = this.config.units === Units.CSS ? Units.CSS : Units.CANVAS;
        this.coordinatesSwitch.useUnits(newUnitsToUse);
        const measurement = this.measurementProvider.measure();
        this.addMeasurement(measurement);
    }
    public getTransformationForInstruction(toTransformation: TransformationRepresentation): Transformation{
        return this.coordinatesSwitch.getInitialTransformationForTransformedInfiniteCanvasContext(Transformation.create(toTransformation))
    }
    public translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: TransformationRepresentation): Transformation{
        return this.coordinatesSwitch.translateInfiniteCanvasContextTransformationToBitmapTransformation(Transformation.create(infiniteCanvasContextTransformation))
    }
    public getInitialTransformation(): Transformation{
        return this.coordinatesSwitch.initialBitmapTransformation;
    }
    public getBitmapTransformationToInfiniteCanvasContext(): Transformation{
        return this.coordinatesSwitch.getBitmapTransformationToInfiniteCanvasContext();
    }
    public getBitmapTransformationToTransformedInfiniteCanvasContext(): Transformation{
        return this.coordinatesSwitch.getBitmapTransformationToTransformedInfiniteCanvasContext();
    }
    public addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number): void{
        const width: number = this.viewboxWidth + 2 * margin;
        const height: number = this.viewboxHeight + 2 * margin;
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.rect(-margin, -margin, width, height);
        context.restore();
    }
    private addMeasurement(measurement: CanvasMeasurement): void{
        const isEqual = measurementsAreOfEqualSize(this.measurement, measurement);
        this.measurement = measurement;
        if(isEqual){
            return;
        }
        const {viewboxWidth, viewboxHeight} = measurement;
        this.polygon = ConvexPolygon.createRectangle(0, 0, viewboxWidth, viewboxHeight);
        this.coordinatesSwitch.setCanvasMeasurement(measurement);
    }
}