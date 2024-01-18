import { beforeEach, describe, it, expect} from 'vitest'
import { Transformation } from "../src/transformation";
import { Point } from "../src/geometry/point";
import {ViewboxInfinity} from "../src/interfaces/viewbox-infinity";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { defaultState } from "../src/state/default-state";
import { transformation } from "../src/state/dimensions/transformation";
import { PathInfinityProvider } from "../src/interfaces/path-infinity-provider";
import {CanvasContextMock} from "./canvas-context-mock";
import { RectangleManager } from '../src/rectangle/rectangle-manager';
import { RectangleManagerImpl } from "../src/rectangle/rectangle-manager-impl";
import { MockCanvasMeasurementProvider } from "./mock-canvas-measurement-provider";
import { InfiniteCanvasPathInfinityProvider } from '../src/infinite-canvas-path-infinity-provider';
import { DrawnPathProperties } from '../src/interfaces/drawn-path-properties';
import { CanvasRectangle } from '../src/rectangle/canvas-rectangle';

function recordPoints(instruction: (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => void, transformation: Transformation, rectangle: CanvasRectangle): Point[]{
    const contextMock: any = new CanvasContextMock();
    const result: Point[] = [];
    contextMock.lineTo = function(x: number, y: number){
        result.push(new Point(x, y));
    }
    instruction(contextMock, rectangle);
    return result;
}
function getStateWithTransformation(_transformation: Transformation): InfiniteCanvasState{
    let result: InfiniteCanvasState = defaultState;
    result = result.withCurrentState(transformation.changeInstanceValue(result.current, _transformation));
    return result;
}
function getInfinityFromPointInDirection(infinity: ViewboxInfinity, fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, rectangle: CanvasRectangle): Point{
    const recordedPoints: Point[] = recordPoints((context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
        infinity.drawLineToInfinityFromPointInDirection(context, rectangle, fromPoint, inDirection);
    }, viewboxTransformation, rectangle);
    expect(recordedPoints.length).toBe(1);
    return recordedPoints[0];
}
function getInfinitiesFromDirectionFromPointToDirection(infinity: ViewboxInfinity, point: Point, direction1: Point, direction2: Point, viewboxTransformation: Transformation, rectangle: CanvasRectangle): Point[]{
    return recordPoints((context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
        infinity.drawLineToInfinityFromInfinityFromPoint(context, rectangle, point, direction1, direction2);
    }, viewboxTransformation, rectangle);
}

describe('a viewbox infinity for an untransformed context and with shadow offsets', () => {
    let infinity: ViewboxInfinity;
    let rectangle: RectangleManager;

    beforeEach(() => {
        const drawnPathProperties: DrawnPathProperties = {
            lineWidth: 1,
            lineDashPeriod: 0,
            shadowOffsets: [new Point(-1, 1), new Point(1, 1)]
        };
        rectangle = new RectangleManagerImpl(new MockCanvasMeasurementProvider(10, 10), {});
        rectangle.measure();
        const pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties);
        infinity = pathInfinityProvider.getInfinity(getStateWithTransformation(Transformation.identity));
    })

    it.each([
        [new Point(0, 0), new Point(0, 1), Transformation.identity, new Point(0, 11)],
        [new Point(5, 5), new Point(0, 1), Transformation.identity, new Point(5, 11)],
        [new Point(0, 0), new Point(1, 0), Transformation.identity, new Point(12, 0)],
        [new Point(5, 5), new Point(1, 0), Transformation.identity, new Point(12, 5)],
        [new Point(0, 0), new Point(0, 1), Transformation.scale(2), new Point(0, 12)],
        [new Point(0, 0), new Point(1, 0), Transformation.scale(2), new Point(14, 0)],
        [new Point(0, 0), new Point(0, -1), Transformation.scale(2), new Point(0, -6)],
        [new Point(0, 0), new Point(-1, 0), Transformation.scale(2), new Point(-4, 0)],
        [new Point(0, 0), new Point(0, 1), Transformation.rotation(0, 0, -Math.PI / 4), new Point(11, 11)]
    ])("should return the right infinities along the x and y axes", (fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, expected: Point) => {
        rectangle.setTransformation(viewboxTransformation);
        const calculated: Point = getInfinityFromPointInDirection(infinity, fromPoint, inDirection, viewboxTransformation, rectangle.rectangle);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});

describe("a viewbox infinity for an untransformed context", () => {
    let infinity: ViewboxInfinity;
    let pathInfinityProvider: PathInfinityProvider;
    let rectangle: RectangleManager;
    let drawnPathProperties: DrawnPathProperties;

    beforeEach(() => {
        drawnPathProperties = {
            lineWidth: 0,
            lineDashPeriod: 0,
            shadowOffsets: []
        };
        rectangle = new RectangleManagerImpl(new MockCanvasMeasurementProvider(10, 10), {});
        rectangle.measure();
        pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties);
        infinity = pathInfinityProvider.getInfinity(getStateWithTransformation(Transformation.identity));
    });

    it.each([
        [new Point(0, 0), new Point(0, 1), Transformation.identity, new Point(0, 10)],
        [new Point(5, 5), new Point(0, 1), Transformation.identity, new Point(5, 10)],
        [new Point(0, 0), new Point(1, 0), Transformation.identity, new Point(10, 0)],
        [new Point(5, 5), new Point(1, 0), Transformation.identity, new Point(10, 5)],
        [new Point(0, 0), new Point(0, 1), Transformation.scale(2), new Point(0, 10)],
        [new Point(0, 0), new Point(0, 1), Transformation.rotation(0, 0, -Math.PI / 4), new Point(10, 10)]
    ])("should return the right infinities along the x and y axes", (fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, expected: Point) => {
        rectangle.setTransformation(viewboxTransformation);
        const calculated: Point = getInfinityFromPointInDirection(infinity, fromPoint, inDirection, viewboxTransformation, rectangle.rectangle);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });

    it.each([
        [new Point(9, 7), new Point(1, 0), new Point(10, 1), Transformation.identity, [new Point(10.287128712871286, 7.128712871287129)]],
        [new Point(5, 5), new Point(0, 1), new Point(1, 0), Transformation.identity, [new Point(10, 10), new Point(10, 5)]],
        [new Point(20, 20), new Point(0, 1), new Point(1, 0), Transformation.identity, [new Point(20, 20)]],
        [new Point(5, 20), new Point(0, 1), new Point(1, 0), Transformation.identity, [new Point(10, 20)]],
        [new Point(-10, 5), new Point(0, 1), new Point(1, 0), Transformation.identity, [new Point(10, 10), new Point(10, 5)]],
        [new Point(-10, 5), new Point(1, 0), new Point(0, 1), Transformation.identity, [new Point(10, 10), new Point(-10, 10)]],
        [new Point(-10, -5), new Point(0, 1), new Point(1, 0), Transformation.identity, [new Point(10, 10), new Point(10, -5)]],
        [new Point(5, -5), new Point(0, 1), new Point(1, 0), Transformation.identity, [new Point(10, 10), new Point(10, -5)]],
        [new Point(15, -5), new Point(0, 1), new Point(1, 0), Transformation.identity, [new Point(15, -5)]],
        [new Point(5, 5), new Point(0, 1), new Point(1, 0), Transformation.scale(0.9), [new Point(10, 10), new Point(10, 4.5)]],
        [new Point(5, 5), new Point(0, -1), new Point(1, 0), new Transformation(0.8, 0.6, -0.6, 0.8, 0, 0), [new Point(10, 0), new Point(10, 10), new Point(8.2, 12.4)]],
        [new Point(5, 5), new Point(1, 0), new Point(0, -1), new Transformation(0.8, 0.6, -0.6, 0.8, 0, 0), [new Point(10, 10), new Point(10, 0), new Point(7.6, -1.8)]],
        [new Point(5, 5), new Point(0, 1), new Point(-1, 0), Transformation.identity, [new Point(0, 10), new Point(0, 5)]],
        [new Point(-5, 5), new Point(1, 1), new Point(1, -1), Transformation.identity, [new Point(10, 10), new Point(10, 0), new Point(5, -5)]],
        [new Point(-25, 5), new Point(1, 1), new Point(1, -1), Transformation.identity, [new Point(10, 10), new Point(10, 0), new Point(-5, -15)]]
    ])("should get the right infinities from direction from point to direction", (point: Point, direction1: Point, direction2: Point, viewboxTransformation: Transformation, expectedPoints: Point[]) => {
        rectangle.setTransformation(viewboxTransformation);
        const result: Point[] = getInfinitiesFromDirectionFromPointToDirection(infinity, point, direction1, direction2, viewboxTransformation, rectangle.rectangle);
        expect(result.length).toBe(expectedPoints.length);
        for(let i: number = 0; i < expectedPoints.length; i++){
            expect(result[i].x).toBeCloseTo(expectedPoints[i].x);
            expect(result[i].y).toBeCloseTo(expectedPoints[i].y);
        }
    });
});

describe("a viewbox infinity for a translated context", () => {
    let infinity: ViewboxInfinity;
    let pathInfinityProvider: PathInfinityProvider;
    let rectangle: RectangleManager;
    let drawnPathProperties: DrawnPathProperties;

    beforeEach(() => {
        drawnPathProperties = {
            lineWidth: 0,
            lineDashPeriod: 0,
            shadowOffsets: []
        };
        rectangle = new RectangleManagerImpl(new MockCanvasMeasurementProvider(10, 10), {});
        rectangle.measure();
        pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties);
        infinity = pathInfinityProvider.getInfinity(getStateWithTransformation(new Transformation(1, 0, 0, 1, 5, 5)));
    });

    it("should return the right infinity", () => {
        rectangle.setTransformation(Transformation.identity);
        const result: Point = getInfinityFromPointInDirection(infinity, new Point(0, 0), new Point(1, 0), Transformation.identity, rectangle.rectangle);
        const expectedResult: Point = new Point(5, 0);
        expect(result.x).toBeCloseTo(expectedResult.x);
        expect(result.y).toBeCloseTo(expectedResult.y);
    });
});

describe("a viewbox infinity for skewed context", () => {
    let infinity: ViewboxInfinity;
    let pathInfinityProvider: PathInfinityProvider;
    let rectangle: RectangleManager;
    let drawnPathProperties: DrawnPathProperties;

    beforeEach(() => {
        drawnPathProperties = {
            lineWidth: 0,
            lineDashPeriod: 0,
            shadowOffsets: []
        };
        rectangle = new RectangleManagerImpl(new MockCanvasMeasurementProvider(10, 10), {});
        rectangle.measure();
        pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties);
        infinity = pathInfinityProvider.getInfinity(getStateWithTransformation(new Transformation(1, 0.2, 0, 1, 0, 0)));
    });

    it.each([
        [new Point(0, 0), new Point(0, 1), Transformation.identity, new Point(0, 10)],
    ])("should return the right infinities along the x and y axes", (fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, expected: Point) => {
        rectangle.setTransformation(viewboxTransformation);
        const calculated: Point = getInfinityFromPointInDirection(infinity, fromPoint, inDirection, viewboxTransformation, rectangle.rectangle);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});

describe("a viewbox infinity for a scaled context", () => {
    let infinity: ViewboxInfinity;
    let pathInfinityProvider: PathInfinityProvider;
    let rectangle: RectangleManager;
    let drawnPathProperties: DrawnPathProperties;

    beforeEach(() => {
        drawnPathProperties = {
            lineWidth: 0,
            lineDashPeriod: 0,
            shadowOffsets: []
        };
        rectangle = new RectangleManagerImpl(new MockCanvasMeasurementProvider(10, 10), {});
        rectangle.measure();
        pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties);
        infinity = pathInfinityProvider.getInfinity(getStateWithTransformation(Transformation.scale(2)));
    });

    it.each([
        [new Point(0, 0), new Point(0, 1), Transformation.identity, new Point(0, 5)],
        [new Point(2, 2), new Point(0, 1), Transformation.identity, new Point(2, 5)],
        [new Point(0, 0), new Point(1, 0), Transformation.identity, new Point(5, 0)],
        [new Point(2, 2), new Point(1, 0), Transformation.identity, new Point(5, 2)],
        [new Point(0, 0), new Point(0, 1), Transformation.scale(2), new Point(0, 5)],
        [new Point(0, 0), new Point(0, 1), Transformation.rotation(0, 0, -Math.PI / 4), new Point(5, 5)]
    ])("should return the right infinities along the x and y axes", (fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, expected: Point) => {
        rectangle.setTransformation(viewboxTransformation);
        const calculated: Point = getInfinityFromPointInDirection(infinity, fromPoint, inDirection, viewboxTransformation, rectangle.rectangle);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});
