import { CoordinateSystemCollection } from "./coordinate-system-collection";
import { CoordinateSystem } from "./coordinate-system";
import { Transformation } from "../transformation";

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
    public withUserTransformation(userTransformation: Transformation): CssCoordinateSystemCollection{
        return new CssCoordinateSystemCollection(new CoordinateSystem(userTransformation), this.canvasBitmap)
    }
    public withCanvasBitmapDistortion(canvasBitmapDistortion: Transformation): CssCoordinateSystemCollection{
        return new CssCoordinateSystemCollection(this.userCoordinates, new CoordinateSystem(canvasBitmapDistortion))
    }
    private setDerivedProperties(): void{
        this.userCoordinatesInsideCanvasBitmap = new CoordinateSystem(this.userCoordinates.base.before(this.canvasBitmap.base))
        this.initialBitmapTransformation = this.canvasBitmap.inverseBase;
        this.icContextFromCanvasBitmap = new CoordinateSystem(this.userCoordinates.base.before(this.canvasBitmap.inverseBase))
    }
}