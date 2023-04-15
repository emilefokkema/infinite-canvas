import { Transformation } from "../transformation";
import { CoordinateSystem } from "./coordinate-system";
import { CoordinateSystemCollection } from "./coordinate-system-collection";

export class CanvasCoordinateSystemCollection implements CoordinateSystemCollection{
    public userCoordinatesInsideCanvasBitmap: CoordinateSystem;
    public icContextFromCanvasBitmap: CoordinateSystem;
    public infiniteCanvasContext: CoordinateSystem;
    private virtualBitmapBase: Transformation;
    public initialBitmapTransformation: Transformation;
    constructor(
        public userCoordinates: CoordinateSystem,
        public canvasBitmap: CoordinateSystem){
            this.virtualBitmapBase = canvasBitmap.base;

            this.setDerivedProperties();
    }
    public setCanvasBitmapDistortion(canvasBitmapDistortion: Transformation): void{
        const additionalBitmapDistortion = this.canvasBitmap.representBase(canvasBitmapDistortion);
        const seenFromUserTransformation = this.userCoordinates.representSimilarTransformation(additionalBitmapDistortion);
        const newVirtualBitmapBase = this.virtualBitmapBase.before(seenFromUserTransformation);
        this.virtualBitmapBase = newVirtualBitmapBase;

        this.canvasBitmap = new CoordinateSystem(canvasBitmapDistortion)

        this.setDerivedProperties();
    }
    public setUserTransformation(userTransformation: Transformation): void{
        this.userCoordinates = new CoordinateSystem(userTransformation);
        this.setDerivedProperties();
    }
    private setDerivedProperties(): void{
        this.infiniteCanvasContext = new CoordinateSystem(this.virtualBitmapBase.before(this.userCoordinates.base))
        this.userCoordinatesInsideCanvasBitmap = new CoordinateSystem(this.userCoordinates.base.before(this.canvasBitmap.base))
        this.initialBitmapTransformation = this.canvasBitmap.representBase(this.userCoordinates.getSimilarTransformation(this.virtualBitmapBase));
        this.icContextFromCanvasBitmap = new CoordinateSystem(this.infiniteCanvasContext.base.before(this.canvasBitmap.inverseBase))
    }
}