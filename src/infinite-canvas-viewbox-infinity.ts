import {ViewboxInfinity} from "./interfaces/viewbox-infinity";
import {Point} from "./geometry/point";
import {Transformation} from "./transformation";
import { right, left, down, up } from "./geometry/points-at-infinity";
import {CanvasRectangle} from "./rectangle/canvas-rectangle";
import {InfiniteCanvasState} from "./state/infinite-canvas-state";
import { DrawnPathProperties } from "./interfaces/drawn-path-properties";
import { Area } from "./areas/area";
import { getPointInFrontInDirection } from "./geometry/get-point-in-front-in-direction";

function getPointInFront(area: Area, point: Point, direction: Point): Point{
    return getPointInFrontInDirection(area.getVertices(), point, direction);
}

export class InfiniteCanvasViewboxInfinity implements ViewboxInfinity{
    constructor(
        private readonly rectangle: CanvasRectangle,
        private readonly state: InfiniteCanvasState,
        private readonly drawnPathProperties: DrawnPathProperties) {
    }
    public addPathAroundViewbox(context: CanvasRenderingContext2D): void{
        this.rectangle.addPathAroundViewbox(context, this.drawnPathProperties.lineWidth);
    }
    private getTransformedViewbox(): Area{
        const bitmapTransformationToTransformedInfiniteCanvasContext: Transformation = this.state.current.transformation.before(this.rectangle.getBitmapTransformationToInfiniteCanvasContext());
        let rectangle: Area = this.rectangle.polygon;
        rectangle = rectangle.transform(bitmapTransformationToTransformedInfiniteCanvasContext.inverse()).expandByDistance(this.drawnPathProperties.lineWidth)
        for(const shadowOffset of this.drawnPathProperties.shadowOffsets){
            const offsetRectangle = rectangle.transform(Transformation.translation(-shadowOffset.x, -shadowOffset.y));
            rectangle = rectangle.join(offsetRectangle)
        }
        return rectangle;
    }
    public clearRect(context: CanvasRenderingContext2D, transformation: Transformation, x: number, y: number, width: number, height: number): void{
        const transformedViewbox: Area = this.getTransformedViewbox();
        const {a, b, c, d, e, f} = transformation;
        context.save();
        context.transform(a, b, c, d, e, f);
        const xStart: number = Number.isFinite(x) ? x : getPointInFront(transformedViewbox, new Point(0, 0), x > 0 ? right.direction : left.direction).x;
        const xEnd: number = Number.isFinite(width) ? x + width : getPointInFront(transformedViewbox, new Point(0, 0), width > 0 ? right.direction : left.direction).x;
        const yStart: number = Number.isFinite(y) ? y : getPointInFront(transformedViewbox, new Point(0, 0), y > 0 ? down.direction : up.direction).y;
        const yEnd: number = Number.isFinite(height) ? y + height : getPointInFront(transformedViewbox, new Point(0, 0), height > 0 ? down.direction : up.direction).y;
        context.clearRect(xStart, yStart, xEnd - xStart, yEnd - yStart);
        context.restore();
    }
    public moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, transformation: Transformation, fromPoint: Point, direction: Point): void{
        const pointInFront: Point = getPointInFront(this.getTransformedViewbox(), fromPoint, direction);
        this.moveToTransformed(context, pointInFront, transformation);
    }
    public drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, transformation: Transformation, point: Point, fromDirection: Point, toDirection: Point): void{
        const transformedViewbox: Area = this.getTransformedViewbox();
        const startingPoint: Point = getPointInFront(transformedViewbox, point, fromDirection);
        const destinationPoint: Point = getPointInFront(transformedViewbox, point, toDirection);
        let polygonToCircumscribe: Area = transformedViewbox
            .expandToIncludePoint(point)
            .expandToIncludePoint(startingPoint)
            .expandToIncludePoint(destinationPoint);
        const verticesInBetween: Point[] = polygonToCircumscribe.getVertices().filter(p => !p.equals(startingPoint) && !p.equals(destinationPoint) && !p.equals(point) && p.minus(point).isInSmallerAngleBetweenPoints(fromDirection, toDirection));
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
            this.lineToTransformed(context, vertexInBetween, transformation);
            currentPoint = vertexInBetween;
        }
        distanceCovered += destinationPoint.minus(currentPoint).mod();
        this.lineToTransformed(context, destinationPoint, transformation);
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, transformation, distanceCovered, destinationPoint, toDirection);
    }
    public drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, transformation: Transformation, point1: Point, point2: Point, direction: Point): void{
        const transformedViewbox: Area = this.getTransformedViewbox();
        const fromPoint: Point = getPointInFront(transformedViewbox, point1, direction);
        const toPoint: Point = getPointInFront(transformedViewbox, point2, direction);
        this.lineToTransformed(context, toPoint, transformation);
        const distanceCovered: number = toPoint.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, transformation, distanceCovered, toPoint, direction);
    }
    public drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, transformation: Transformation, point: Point, direction: Point): void{
        const fromPoint: Point = getPointInFront(this.getTransformedViewbox(), point, direction);
        const distanceToCover: number = point.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, transformation, distanceToCover, fromPoint, direction);
        this.lineToTransformed(context, point, transformation);
    }
    public drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, transformation: Transformation, fromPoint: Point, direction: Point): void{
        const toPoint: Point = getPointInFront(this.getTransformedViewbox(), fromPoint, direction);
        this.lineToTransformed(context, toPoint, transformation);
        const distanceCovered: number = toPoint.minus(fromPoint).mod();
        this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(context, transformation, distanceCovered, toPoint, direction);
    }
    private ensureDistanceCoveredIsMultipleOfLineDashPeriod(context: CanvasRenderingContext2D, viewboxTransformation: Transformation, distanceSoFar: number, lastPoint: Point, directionOfExtraPoint: Point): void{
        const lineDashPeriod: number = this.drawnPathProperties.lineDashPeriod;
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
