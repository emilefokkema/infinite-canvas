import { CanvasRectangle } from './canvas-rectangle';
import { CoordinatesSwitch } from './coordinates-switch';
import { CanvasMeasurement } from "./canvas-measurement";
import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Point } from "../geometry/point";
import { TransformationRepresentation } from "api/transformation-representation";
import { Transformation } from "../transformation";
import { Units } from "api/units";
import { CoordinateSystem } from './coordinate-system';
import { getRectWithFourEdges } from '../rect/get-rect-strategy';

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
    public get viewboxWidth(): number{return this.measurement.viewboxWidth;}
    public get viewboxHeight(): number{return this.measurement.viewboxHeight}
    public get userTransformation(): Transformation{return this.coordinates.userTransformation;}
    public get infiniteCanvasContext(): CoordinateSystem{return this.coordinates.infiniteCanvasContext;}
    public get initialBitmapTransformation(): Transformation{return this.coordinates.initialBitmapTransformation;}
    constructor(
        private readonly coordinates: CoordinatesSwitch,
        private readonly measurement: CanvasMeasurement,
        public readonly polygon: ConvexPolygon){
    }

    public withUnits(units: Units): CanvasRectangle{
        const coordinatesSwitch = this.coordinates.withUnits(units);
        return new CanvasRectangleImpl(coordinatesSwitch, this.measurement, this.polygon)
    }

    public withTransformation(transformation: TransformationRepresentation): CanvasRectangle{
        const coordinatesSwitch = this.coordinates.withUserTransformation(Transformation.create(transformation));
        return new CanvasRectangleImpl(coordinatesSwitch, this.measurement, this.polygon);
    }

    public withMeasurement(measurement: CanvasMeasurement): CanvasRectangle{
        const isEqual = measurementsAreOfEqualSize(this.measurement, measurement);
        if(isEqual){
            return this;
        }
        const {viewboxWidth, viewboxHeight} = measurement;
        const polygon = getRectWithFourEdges(0, 0, viewboxWidth, viewboxHeight).getArea();
        const coordinatesSwitch = this.coordinates.withCanvasMeasurement(measurement);
        return new CanvasRectangleImpl(coordinatesSwitch, measurement, polygon)
    }

    public getCSSPosition(clientX: number, clientY: number): Point{
        const {left, top} = this.measurement
        return new Point(clientX - left, clientY - top);
    }

    public getTransformationForInstruction(infiniteCanvasContextTransformation: TransformationRepresentation): Transformation{
        return this.coordinates.getTransformationForInstruction(infiniteCanvasContextTransformation)
    }

    public translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: TransformationRepresentation): Transformation{
        return this.coordinates.translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation)
    }

    public getBitmapTransformationToTransformedInfiniteCanvasContext(): Transformation{
        return this.coordinates.getBitmapTransformationToTransformedInfiniteCanvasContext();
    }

    public getBitmapTransformationToInfiniteCanvasContext(): Transformation{
        return this.coordinates.getBitmapTransformationToInfiniteCanvasContext();
    }

    public addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number): void{
        const width: number = this.viewboxWidth + 2 * margin;
        const height: number = this.viewboxHeight + 2 * margin;
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.rect(-margin, -margin, width, height);
        context.restore();
    }

    public static create(measurement: CanvasMeasurement, units: Units): CanvasRectangleImpl{
        const {viewboxWidth, viewboxHeight} = measurement;
        const polygon = getRectWithFourEdges(0, 0, viewboxWidth, viewboxHeight).getArea();
        const coordinates = CoordinatesSwitch.create(units, measurement);
        return new CanvasRectangleImpl(coordinates, measurement, polygon)
    }
}