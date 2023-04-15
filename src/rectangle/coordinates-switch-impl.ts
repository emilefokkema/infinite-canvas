import { CanvasMeasurement } from "./canvas-measurement";
import { Transformation } from "../transformation";
import { Units } from "../api-surface/units";
import { CanvasCoordinateSystemCollection } from "./canvas-coordinate-system-collection";
import { CoordinateSystemCollection } from "./coordinate-system-collection";
import { CoordinatesSwitch } from "./coordinates-switch";
import { CssCoordinateSystemCollection } from "./css-coordinate-system-collection";
import { CoordinateSystem } from "./coordinate-system";

function calculateCanvasBitmapDistortion(measurement: CanvasMeasurement): Transformation{
    const { screenWidth, screenHeight, viewboxWidth, viewboxHeight } = measurement;
    return new Transformation(screenWidth / viewboxWidth, 0, 0, screenHeight / viewboxHeight, 0, 0);
}

export class CoordinatesSwitchImpl implements CoordinatesSwitch{
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
    public setCanvasBitmapDistortion(canvasBitmapDistortion: Transformation): void{
        this.coordinates.setCanvasBitmapDistortion(canvasBitmapDistortion);
    }
    public getBitmapTransformationToTransformedInfiniteCanvasContext(): Transformation{
        return this.coordinates.userCoordinates.base;
    }
    public getBitmapTransformationToInfiniteCanvasContext(): Transformation{
        return this.coordinates.icContextFromCanvasBitmap.base;
    }
    public translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: Transformation): Transformation{
        return this.coordinates.icContextFromCanvasBitmap.getSimilarTransformation(infiniteCanvasContextTransformation)
    }
    public getInitialTransformationForTransformedInfiniteCanvasContext(infiniteCanvasContextTransformation: Transformation): Transformation{
        const transformedIcContextBase = infiniteCanvasContextTransformation.before(this.coordinates.infiniteCanvasContext.base);
        const inUserCoordinatesInsideBitmap = this.coordinates.userCoordinatesInsideCanvasBitmap.representBase(transformedIcContextBase)
        return this.coordinates.userCoordinates.getSimilarTransformation(inUserCoordinatesInsideBitmap);
    }
    public setUserTransformation(userTransformation: Transformation): void{
        this.coordinates.setUserTransformation(userTransformation);
    }
    public setCanvasMeasurement(measurement: CanvasMeasurement): void{
        const canvasBitmapDistortion = calculateCanvasBitmapDistortion(measurement);
        this.coordinates.setCanvasBitmapDistortion(canvasBitmapDistortion);
    }
    public useUnits(units: Units): void{
        if(units === this.units){
            return;
        }
        this.units = units;
        if(units === Units.CANVAS){
            this.coordinates = new CanvasCoordinateSystemCollection(this.coordinates.userCoordinates, this.coordinates.canvasBitmap);
        }else{
            this.coordinates = new CssCoordinateSystemCollection(this.coordinates.userCoordinates, this.coordinates.canvasBitmap);
        }
    }
    public static create(units: Units, measurement: CanvasMeasurement): CoordinatesSwitchImpl{
        const canvasBitmapDistortion = calculateCanvasBitmapDistortion(measurement);
        const coordinates = units === Units.CANVAS
            ? new CanvasCoordinateSystemCollection(new CoordinateSystem(Transformation.identity), new CoordinateSystem(canvasBitmapDistortion))
            : new CssCoordinateSystemCollection(new CoordinateSystem(Transformation.identity), new CoordinateSystem(canvasBitmapDistortion))
        return new CoordinatesSwitchImpl(units, coordinates);
    }
}