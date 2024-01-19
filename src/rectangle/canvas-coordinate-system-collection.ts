import { Transformation } from "../transformation";
import { CoordinateSystem } from "./coordinate-system";
import { CoordinateSystemCollection } from "./coordinate-system-collection";

export class CanvasCoordinateSystemCollection implements CoordinateSystemCollection{
    public userCoordinatesInsideCanvasBitmap: CoordinateSystem;
    public icContextFromCanvasBitmap: CoordinateSystem;
    public infiniteCanvasContext: CoordinateSystem;
    
    public initialBitmapTransformation: Transformation;
    constructor(
        public userCoordinates: CoordinateSystem,
        public canvasBitmap: CoordinateSystem,
        private virtualBitmapBase: Transformation){
            this.setDerivedProperties();
    }

    public withCanvasBitmapDistortion(canvasBitmapDistortion: Transformation): CanvasCoordinateSystemCollection{
        const additionalBitmapDistortion = this.canvasBitmap.representBase(canvasBitmapDistortion);
        const seenFromUserTransformation = this.userCoordinates.representSimilarTransformation(additionalBitmapDistortion);
        const newVirtualBitmapBase = this.virtualBitmapBase.before(seenFromUserTransformation);
        const newCanvasBitmap = new CoordinateSystem(canvasBitmapDistortion)
        return new CanvasCoordinateSystemCollection(this.userCoordinates, newCanvasBitmap, newVirtualBitmapBase);
    }

    public withUserTransformation(userTransformation: Transformation): CanvasCoordinateSystemCollection{
        return new CanvasCoordinateSystemCollection(new CoordinateSystem(userTransformation), this.canvasBitmap, this.virtualBitmapBase);
    }

    private setDerivedProperties(): void{
        this.infiniteCanvasContext = new CoordinateSystem(this.virtualBitmapBase.before(this.userCoordinates.base))
        this.userCoordinatesInsideCanvasBitmap = new CoordinateSystem(this.userCoordinates.base.before(this.canvasBitmap.base))
        this.initialBitmapTransformation = this.canvasBitmap.representBase(this.userCoordinates.getSimilarTransformation(this.virtualBitmapBase));
        this.icContextFromCanvasBitmap = new CoordinateSystem(this.infiniteCanvasContext.base.before(this.canvasBitmap.inverseBase))
    }
}