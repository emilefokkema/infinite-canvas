import { Transformation } from "../transformation";
import { CoordinateSystem } from "./coordinate-system";
import { CoordinateSystemCollection } from "./coordinate-system-collection";

export class CssCoordinateSystemCollection implements CoordinateSystemCollection{
    public userCoordinatesInsideCanvasBitmap: CoordinateSystem;
    public icContextFromCanvasBitmap: CoordinateSystem;
    public initialBitmapTransformation: Transformation;
    public get infiniteCanvasContext(): CoordinateSystem{
        return this.userCoordinates;
    }
    constructor(
        public userCoordinates: CoordinateSystem,
        public canvasBitmap: CoordinateSystem){
            this.setDerivedProperties();
    }
    public setCanvasBitmapDistortion(canvasBitmapDistortion: Transformation): void{
        this.canvasBitmap = new CoordinateSystem(canvasBitmapDistortion)
        this.setDerivedProperties();
    }
    public setUserTransformation(userTransformation: Transformation): void{
        this.userCoordinates = new CoordinateSystem(userTransformation);
        this.setDerivedProperties();
    }
    private setDerivedProperties(): void{
        this.userCoordinatesInsideCanvasBitmap = new CoordinateSystem(this.userCoordinates.base.before(this.canvasBitmap.base))
        this.initialBitmapTransformation = this.canvasBitmap.inverseBase;
        this.icContextFromCanvasBitmap = new CoordinateSystem(this.userCoordinates.base.before(this.canvasBitmap.inverseBase))
    }
}