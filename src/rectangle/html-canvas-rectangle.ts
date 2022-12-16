import {ConvexPolygon} from "../areas/polygons/convex-polygon";
import {Point} from "../geometry/point";
import {CanvasRectangle} from "./canvas-rectangle";
import {InfiniteCanvasState} from "../state/infinite-canvas-state";
import {Transformation} from "../transformation";
import {CanvasMeasurementProvider} from "./canvas-measurement-provider";
import {PathInfinityProvider} from "../interfaces/path-infinity-provider";
import {InfiniteCanvasPathInfinityProvider} from "../infinite-canvas-path-infinity-provider";
import {Instruction} from "../instructions/instruction";
import {Config} from "../api-surface/config";
import {Units} from "../api-surface/units";
import {CanvasMeasurement} from "./canvas-measurement";
import {RectangleMeasurement} from "./rectangle-measurement";
import {CoordinateSystems} from "./coordinate-systems/coordinate-systems";
import {CssCoordinateSystemStack} from "./coordinate-systems/css/css-coordinate-system-stack";
import {CanvasCoordinateSystemStack} from "./coordinate-systems/canvas/canvas-coordinate-system-stack";
import {
    convertToStackForCanvasUnits,
    convertToStackForCssUnits
} from "./coordinate-systems/coordinate-system-conversion";

function createRectangleMeasurement(canvasMeasurement: CanvasMeasurement): RectangleMeasurement{
    const {viewboxWidth, viewboxHeight, screenWidth, screenHeight} = canvasMeasurement;
    const polygon: ConvexPolygon = ConvexPolygon.createRectangle(0, 0, viewboxWidth, viewboxHeight);
    const screenTransformation: Transformation = new Transformation(screenWidth / viewboxWidth, 0, 0, screenHeight / viewboxHeight, 0, 0);
    return {screenWidth, screenHeight, viewboxWidth, viewboxHeight, polygon, screenTransformation, inverseScreenTransformation: screenTransformation.inverse()};
}

export class HTMLCanvasRectangle implements CanvasRectangle{
    public viewboxWidth: number;
    public viewboxHeight: number;
    public polygon: ConvexPolygon;
    private unitsUsed: Units;
    private screenWidth: number;
    private screenHeight: number;
    private coordinateSystems: CoordinateSystems;
    public get transformation(): Transformation{return this.coordinateSystems.userTransformation;}
    public set transformation(value: Transformation){
        this.coordinateSystems = this.coordinateSystems.withUserTransformation(value);
    }
    public get infiniteCanvasContextBase(): Transformation{return this.coordinateSystems.infiniteCanvasContextBase;}
    public get inverseInfiniteCanvasContextBase(): Transformation{return this.coordinateSystems.inverseInfiniteCanvasContextBase;}
    constructor(private readonly measurementProvider: CanvasMeasurementProvider, private readonly config: Partial<Config>) {
        this.unitsUsed = config.units === Units.CSS ? Units.CSS : Units.CANVAS;
        const measurement: RectangleMeasurement = createRectangleMeasurement(this.measurementProvider.measure());
        this.addMeasurement(measurement);
        this.coordinateSystems = config.units === Units.CSS ?
            CssCoordinateSystemStack.create(measurement) :
            CanvasCoordinateSystemStack.create(measurement);
    }
    private isChange(measurement: CanvasMeasurement): boolean{
        return measurement.viewboxWidth !== this.viewboxWidth ||
            measurement.viewboxHeight !== this.viewboxHeight ||
            measurement.screenWidth !== this.screenWidth ||
            measurement.screenHeight !== this.screenHeight;
    }
    private addMeasurement(measurement: RectangleMeasurement): void{
        this.viewboxWidth = measurement.viewboxWidth;
        this.viewboxHeight = measurement.viewboxHeight;
        this.screenWidth = measurement.screenWidth;
        this.screenHeight = measurement.screenHeight;
        this.polygon = measurement.polygon;
    }
    public measure(): void{
        const newUnitsToUse: Units = this.config.units === Units.CSS ? Units.CSS : Units.CANVAS;
        if(newUnitsToUse === Units.CANVAS && this.unitsUsed === Units.CSS){
            this.coordinateSystems = convertToStackForCanvasUnits(this.coordinateSystems as CssCoordinateSystemStack);
        }
        if(newUnitsToUse === Units.CSS && this.unitsUsed === Units.CANVAS){
            this.coordinateSystems = convertToStackForCssUnits(this.coordinateSystems as CanvasCoordinateSystemStack);
        }
        this.unitsUsed = newUnitsToUse;
        const newMeasurement: CanvasMeasurement = this.measurementProvider.measure();
        if(!this.isChange(newMeasurement)){
            return;
        }
        const newRectangleMeasurement: RectangleMeasurement = createRectangleMeasurement(newMeasurement);
        this.addMeasurement(newRectangleMeasurement);
        this.coordinateSystems = this.coordinateSystems.withScreenTransformation(newRectangleMeasurement.screenTransformation, newRectangleMeasurement.inverseScreenTransformation);
    }

    public getTransformationInstruction(toTransformation: Transformation): Instruction{
        return (context: CanvasRenderingContext2D) => {
            this.coordinateSystems.setTransformationToTransformInfiniteCanvasContext(context, toTransformation);
        }
    }
    public getCSSPosition(clientX: number, clientY: number): Point{
        const {left, top} = this.measurementProvider.measure();
        return new Point(clientX - left, clientY - top);
    }
    public getForPath(): PathInfinityProvider{
        return new InfiniteCanvasPathInfinityProvider(this);
    }
    public getViewboxFromState(state: InfiniteCanvasState, margin: number): ConvexPolygon{
        return this.coordinateSystems.rebaseFromScreenContextToInfiniteCanvasContext(state.current.transformation, this.polygon.expandByDistance(margin * this.transformation.scale));
    }
    public applyInitialTransformation(context: CanvasRenderingContext2D): void{
        this.coordinateSystems.setCanvasContextTransformation(context);
    }
    public transformRelatively(instruction: Instruction): Instruction{
        return (context: CanvasRenderingContext2D) => {
            this.coordinateSystems.executeInTransformedInfiniteCanvasContext(instruction, context);
        };
    }
    public transformAbsolutely(instruction: Instruction): Instruction{
        return (context: CanvasRenderingContext2D) => {
            this.coordinateSystems.executeInUntransformedInfiniteCanvasContext(instruction, context);
        };
    }
    public addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number): void{
        const width: number = this.viewboxWidth + 2 * margin;
        const height: number = this.viewboxHeight + 2 * margin;
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.rect(-margin, -margin, width, height);
        context.restore();
    }
}
