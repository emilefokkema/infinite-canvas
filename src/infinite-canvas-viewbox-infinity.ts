import {ViewboxInfinity} from "./interfaces/viewbox-infinity";
import {Point} from "./geometry/point";
import {Transformation} from "./transformation";
import {ConvexPolygon} from "./areas/polygons/convex-polygon";
import { right, left, down, up } from "./geometry/points-at-infinity";

export class InfiniteCanvasViewboxInfinity implements ViewboxInfinity{
    constructor(private readonly getTransformedViewbox: () => ConvexPolygon, private readonly getViewBoxTransformation: () => Transformation, private readonly getLineDashPeriod: () => number) {
    }
    public clearRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void{
        const viewBoxTransformation: Transformation = this.getViewBoxTransformation();
        const transformedViewbox: ConvexPolygon = this.getTransformedViewbox();
        const {a, b, c, d, e, f} = viewBoxTransformation;
        context.save();
        context.transform(a, b, c, d, e, f);
        const xStart: number = Number.isFinite(x) ? x : transformedViewbox.getPointInFrontInDirection(new Point(0, 0), x > 0 ? right.direction : left.direction).x;
        const xEnd: number = Number.isFinite(width) ? x + width : transformedViewbox.getPointInFrontInDirection(new Point(0, 0), width > 0 ? right.direction : left.direction).x;
        const yStart: number = Number.isFinite(y) ? y : transformedViewbox.getPointInFrontInDirection(new Point(0, 0), y > 0 ? down.direction : up.direction).y;
        const yEnd: number = Number.isFinite(height) ? y + height : transformedViewbox.getPointInFrontInDirection(new Point(0, 0), height > 0 ? down.direction : up.direction).y;
        context.clearRect(xStart, yStart, xEnd - xStart, yEnd - yStart);
        context.restore();
    }
    public moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void{
        const pointInFront: Point = this.getTransformedViewbox().getPointInFrontInDirection(fromPoint, direction);
        this.moveToTransformed(context, pointInFront, this.getViewBoxTransformation());
    }
    public drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, point: Point, fromDirection: Point, toDirection: Point): void{
        const viewBoxTransformation: Transformation = this.getViewBoxTransformation();
        const transformedViewbox: ConvexPolygon = this.getTransformedViewbox();
        const startingPoint: Point = transformedViewbox.getPointInFrontInDirection(point, fromDirection);
        const destinationPoint: Point = transformedViewbox.getPointInFrontInDirection(point, toDirection);
        let polygonToCircumscribe: ConvexPolygon = transformedViewbox
            .expandToIncludePoint(point)
            .expandToIncludePoint(startingPoint)
            .expandToIncludePoint(destinationPoint);
        const verticesInBetween: Point[] = polygonToCircumscribe.vertices.map(v => v.point).filter(p => !p.equals(startingPoint) && !p.equals(destinationPoint) && !p.equals(point) && p.minus(point).isInSmallerAngleBetweenPoints(fromDirection, toDirection));
        verticesInBetween.sort((p1, p2) => {
            if(p1.minus(point).isInSmallerAngleBetweenPoints(p2.minus(point), fromDirection)){
                return -1;
            }
            return 1;
        });
        let currentPoint: Point = startingPoint;
        let distanceCovered: number = 0;
        for(let vertexInBetween of verticesInBetween){
            distanceCovered += vertexInBetween.minus(currentPoint).mod();
            this.lineToTransformed(context, vertexInBetween, viewBoxTransformation);
            currentPoint = vertexInBetween;
        }
        distanceCovered += destinationPoint.minus(currentPoint).mod();
        this.lineToTransformed(context, destinationPoint, viewBoxTransformation);
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, viewBoxTransformation, distanceCovered, destinationPoint, toDirection);
    }
    public drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, point1: Point, point2: Point, direction: Point): void{
        const transformedViewbox: ConvexPolygon = this.getTransformedViewbox();
        const viewboxTransformation: Transformation = this.getViewBoxTransformation();
        const fromPoint: Point = transformedViewbox.getPointInFrontInDirection(point1, direction);
        const toPoint: Point = transformedViewbox.getPointInFrontInDirection(point2, direction);
        this.lineToTransformed(context, toPoint, viewboxTransformation);
        const distanceCovered: number = toPoint.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, viewboxTransformation, distanceCovered, toPoint, direction);
    }
    public drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, point: Point, direction: Point): void{
        const viewboxTransformation: Transformation = this.getViewBoxTransformation();
        const fromPoint: Point = this.getTransformedViewbox().getPointInFrontInDirection(point, direction);
        const distanceToCover: number = point.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, viewboxTransformation, distanceToCover, fromPoint, direction);
        this.lineToTransformed(context, point, viewboxTransformation);
    }
    public drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void{
        const viewboxTransformation: Transformation = this.getViewBoxTransformation();
        const toPoint: Point = this.getTransformedViewbox().getPointInFrontInDirection(fromPoint, direction);
        this.lineToTransformed(context, toPoint, viewboxTransformation);
        const distanceCovered: number = toPoint.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, viewboxTransformation, distanceCovered, toPoint, direction);
    }
    private ensureDistanceCoveredIsMultipleOfLineDashPeriod(context: CanvasRenderingContext2D, viewboxTransformation: Transformation, distanceSoFar: number, lastPoint: Point, directionOfExtraPoint: Point): void{
        const lineDashPeriod: number = this.getLineDashPeriod();
        if(lineDashPeriod === 0){
            return;
        }
        const distanceLeft: number = this.getDistanceLeft(distanceSoFar, lineDashPeriod);
        if(distanceLeft === 0){
            return;
        }
        const extraPoint: Point = lastPoint.plus(directionOfExtraPoint.scale(distanceLeft / (2 * directionOfExtraPoint.mod())));
        this.lineToTransformed(context, extraPoint, viewboxTransformation);
        this.lineToTransformed(context, lastPoint, viewboxTransformation);
    }
    private lineToTransformed(context: CanvasRenderingContext2D, point: Point, transformation: Transformation){
        const {x, y} = transformation.apply(point);
        context.lineTo(x, y);
    }
    private moveToTransformed(context: CanvasRenderingContext2D, point: Point, transformation: Transformation){
        const {x, y} = transformation.apply(point);
        context.moveTo(x, y);
    }
    private getDistanceLeft(distanceSoFar: number, period: number): number{
        if(period === 0){
            return 0;
        }
        const nrOfPeriods: number = (distanceSoFar / period) | 0;
        return distanceSoFar - period * nrOfPeriods === 0 ? 0 : (nrOfPeriods + 1) * period - distanceSoFar;
    }
}
