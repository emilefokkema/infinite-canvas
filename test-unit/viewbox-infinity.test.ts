import { beforeEach, describe, it, expect} from 'vitest'
import { Transformation } from "../src/transformation";
import { Point } from "../src/geometry/point";
import {ViewboxInfinity} from "../src/interfaces/viewbox-infinity";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { defaultState } from "../src/state/default-state";
import { transformation } from "../src/state/dimensions/transformation";
import { lineWidth } from '../src/state/dimensions/infinite-canvas-transformable-scalar-state-instance-dimension';
import { shadowBlur } from '../src/state/dimensions/shadow-blur';
import { shadowOffset } from '../src/state/dimensions/shadow-offset';
import { PathInfinityProvider } from "../src/interfaces/path-infinity-provider";
import {CanvasContextMock} from "./canvas-context-mock";
import { RectangleManager } from '../src/rectangle/rectangle-manager';
import { RectangleManagerImpl } from "../src/rectangle/rectangle-manager-impl";
import { MockCanvasMeasurementProvider } from "./mock-canvas-measurement-provider";
import { InfiniteCanvasPathInfinityProvider } from '../src/infinite-canvas-path-infinity-provider';
import { DrawnPathProperties } from '../src/interfaces/drawn-path-properties';
import { CanvasRectangle } from '../src/rectangle/canvas-rectangle';
import { CanvasMeasurement } from '../src/rectangle/canvas-measurement';
import { CanvasRectangleImpl } from '../src/rectangle/canvas-rectangle-impl';
import { Units } from '../src/infinite-canvas';
import { TransformationRepresentation } from '../src/api-surface/transformation-representation';

function recordPoints(instruction: (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => void, rectangle: CanvasRectangle): Point[]{
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
function getInfinityFromPointInDirection(infinity: ViewboxInfinity, fromPoint: Point, inDirection: Point, rectangle: CanvasRectangle): Point{
    const recordedPoints: Point[] = recordPoints((context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
        infinity.drawLineToInfinityFromPointInDirection(context, rectangle, fromPoint, inDirection);
    }, rectangle);
    expect(recordedPoints.length).toBe(1);
    return recordedPoints[0];
}
function getInfinitiesFromDirectionFromPointToDirection(infinity: ViewboxInfinity, point: Point, direction1: Point, direction2: Point, rectangle: CanvasRectangle): Point[]{
    return recordPoints((context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
        infinity.drawLineToInfinityFromInfinityFromPoint(context, rectangle, point, direction1, direction2);
    }, rectangle);
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
        const calculated: Point = getInfinityFromPointInDirection(infinity, fromPoint, inDirection, rectangle.rectangle);
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
        const calculated: Point = getInfinityFromPointInDirection(infinity, fromPoint, inDirection, rectangle.rectangle);
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
        const result: Point[] = getInfinitiesFromDirectionFromPointToDirection(infinity, point, direction1, direction2, rectangle.rectangle);
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
        const result: Point = getInfinityFromPointInDirection(infinity, new Point(0, 0), new Point(1, 0), rectangle.rectangle);
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
        const calculated: Point = getInfinityFromPointInDirection(infinity, fromPoint, inDirection, rectangle.rectangle);
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
        const calculated: Point = getInfinityFromPointInDirection(infinity, fromPoint, inDirection, rectangle.rectangle);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});

describe("this particular one", () => {
    let infinity: ViewboxInfinity;
    let rectangle: CanvasRectangle

    beforeEach(() => {
        const drawnPathProperties: DrawnPathProperties = {
            lineWidth: 5.656854249492381,
            lineDashPeriod: 0,
            shadowOffsets: [new Point(20, -20)]
        };
        const measurement: CanvasMeasurement = {
            left: 0,
            top: 0,
            screenWidth: 1073.5999755859375,
            screenHeight: 695.2000122070312,
            viewboxWidth: 1000,
            viewboxHeight: 1000
        };
        const userTransformation: TransformationRepresentation = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 265.59999084472656,
            f: -58.40000915527344
        }
        let state: InfiniteCanvasState = defaultState
        state = state
            .withCurrentState(lineWidth.changeInstanceValue(state.current, 4))
            .withCurrentState(shadowBlur.changeInstanceValue(state.current, 20))
            .withCurrentState(shadowOffset.changeInstanceValue(state.current, new Point(20, -20)))
        rectangle = CanvasRectangleImpl.create(measurement, Units.CSS).withTransformation(userTransformation)
        const pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties);
        infinity = pathInfinityProvider.getInfinity(state)
    })

    it('should pass these point when drawing at infinity', () => {
        const result = getInfinitiesFromDirectionFromPointToDirection(infinity, new Point(100, 300), new Point(0, -1), new Point(1, 1), rectangle)
        expect(result).toEqual([
            new Point(1079.25682983543, -5.65685424949239),
            new Point(1079.25682983543, 700.8568664565237),
            new Point(952.0568481459768, 828.0568481459768)
        ])
    })
})
