import { TransformationRepresentation } from "../src/api-surface/transformation-representation";
import { ConvexPolygon } from "../src/areas/polygons/convex-polygon";
import { CoordinateSystem } from "../src/rectangle/coordinate-system";
import { CanvasRectangle } from "../src/rectangle/canvas-rectangle";
import { Transformation } from "../src/transformation";
import { Point } from '../src/geometry/point'
import { createRectangle } from "./create-rectangle";

export class MockRectangle implements CanvasRectangle{
    public viewboxWidth: number = 200;
    public viewboxHeight: number = 200;
    public polygon: ConvexPolygon;
    public userTransformation: Transformation = Transformation.identity;
    public infiniteCanvasContext: CoordinateSystem = new CoordinateSystem(Transformation.identity);
    public initialBitmapTransformation: Transformation = Transformation.identity;

    constructor(){
        this.polygon = createRectangle(0, 0, this.viewboxWidth, this.viewboxHeight);
    }

    public addPathAroundViewbox(): void{

    }

    public getCSSPosition(x: number, y: number){
        return new Point(x, y)
    }

    public getTransformationForInstruction(infiniteCanvasContextTransformation: TransformationRepresentation){
        return Transformation.create(infiniteCanvasContextTransformation);
    }
    public translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: TransformationRepresentation){
        return Transformation.create(infiniteCanvasContextTransformation)
    }
    public getBitmapTransformationToTransformedInfiniteCanvasContext(){
        return Transformation.identity;
    }
    public getBitmapTransformationToInfiniteCanvasContext(){
        return Transformation.identity;
    }

    public withMeasurement(){
        return this;
    }

    public withUnits() {
        return this;
    }

    public withTransformation() {
        return this;
    }
}