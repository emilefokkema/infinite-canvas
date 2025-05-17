import { CanvasMeasurement } from "./canvas-measurement";
import { Transformation } from "../transformation";
import { TransformationRepresentation } from "api/transformation-representation";
import { Units } from "api/units";
import { CanvasCoordinateSystemCollection } from "./canvas-coordinate-system-collection";
import { CoordinateSystemCollection } from './coordinate-system-collection'
import { CssCoordinateSystemCollection } from "./css-coordinate-system-collection";
import { CoordinateSystem } from "./coordinate-system";

function calculateCanvasBitmapDistortion(measurement: CanvasMeasurement): Transformation{
    const { screenWidth, screenHeight, viewboxWidth, viewboxHeight } = measurement;
    return new Transformation(screenWidth / viewboxWidth, 0, 0, screenHeight / viewboxHeight, 0, 0);
}

export class CoordinatesSwitch {
    public get userTransformation(): Transformation{
        return this.coordinates.userCoordinates.base;
    }
    public get infiniteCanvasContext(): CoordinateSystem{
        return this.coordinates.infiniteCanvasContext;
    }
    public get initialBitmapTransformation(): Transformation{
        return this.coordinates.initialBitmapTransformation;
    }
    constructor(private units: Units, private coordinates: CoordinateSystemCollection){

    }
    public getBitmapTransformationToTransformedInfiniteCanvasContext(): Transformation{
        return this.coordinates.userCoordinates.base;
    }
    public getBitmapTransformationToInfiniteCanvasContext(): Transformation{
        return this.coordinates.icContextFromCanvasBitmap.base;
    }
    public translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: TransformationRepresentation): Transformation{
        return this.coordinates.icContextFromCanvasBitmap.getSimilarTransformation(Transformation.create(infiniteCanvasContextTransformation))
    }
    public getTransformationForInstruction(infiniteCanvasContextTransformation: TransformationRepresentation): Transformation{
        const transformedIcContextBase = Transformation.create(infiniteCanvasContextTransformation).before(this.coordinates.infiniteCanvasContext.base);
        const inUserCoordinatesInsideBitmap = this.coordinates.userCoordinatesInsideCanvasBitmap.representBase(transformedIcContextBase)
        return this.coordinates.userCoordinates.getSimilarTransformation(inUserCoordinatesInsideBitmap);
    }
    public withUserTransformation(userTransformation: Transformation): CoordinatesSwitch{
        const newCoordinates = this.coordinates.withUserTransformation(userTransformation)
        return new CoordinatesSwitch(this.units, newCoordinates)
    }
    public withCanvasMeasurement(measurement: CanvasMeasurement): CoordinatesSwitch{
        const canvasBitmapDistortion = calculateCanvasBitmapDistortion(measurement);
        const newCoordinates = this.coordinates.withCanvasBitmapDistortion(canvasBitmapDistortion);
        return new CoordinatesSwitch(this.units, newCoordinates)
    }
    public withUnits(units: Units): CoordinatesSwitch{
        if(units === this.units){
            return this;
        }
        let newCoordinates: CoordinateSystemCollection
        if(units === Units.CANVAS){
            newCoordinates = new CanvasCoordinateSystemCollection(this.coordinates.userCoordinates, this.coordinates.canvasBitmap, this.coordinates.canvasBitmap.base);
        }else{
            newCoordinates = new CssCoordinateSystemCollection(this.coordinates.userCoordinates, this.coordinates.canvasBitmap);
        }
        return new CoordinatesSwitch(units, newCoordinates);
    }
    public static create(units: Units, measurement: CanvasMeasurement): CoordinatesSwitch{
        const canvasBitmapDistortion = calculateCanvasBitmapDistortion(measurement);
        const coordinates = units === Units.CANVAS
            ? new CanvasCoordinateSystemCollection(new CoordinateSystem(Transformation.identity), new CoordinateSystem(canvasBitmapDistortion), canvasBitmapDistortion)
            : new CssCoordinateSystemCollection(new CoordinateSystem(Transformation.identity), new CoordinateSystem(canvasBitmapDistortion))
        return new CoordinatesSwitch(units, coordinates);
    }
}