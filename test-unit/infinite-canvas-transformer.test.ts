import { afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import { InfiniteCanvasTransformer } from "src/transformer/infinite-canvas-transformer";
import { Transformation } from "src/transformation";
import { Point } from "src/geometry/point";
import { Config } from "api/config";
import { Anchor } from "src/transformer/anchor";
import { InfiniteCanvasAnchor } from "src/transformer/infinite-canvas-anchor";
import { Transformable } from 'src/transformable';

function expectPointToBeTransformedTo(point: Point, transformation: Transformation, expectedPoint: Point): void{
	const actualTransformedPoint: Point = transformation.apply(point);
	expect(actualTransformedPoint.x).toBeCloseTo(expectedPoint.x);
	expect(actualTransformedPoint.y).toBeCloseTo(expectedPoint.y);
}

function createAnchor(x: number, y: number): Anchor{
    return new InfiniteCanvasAnchor(new Point(x, y));
}

describe("an infinite canvas transformer", () => {
    let transformer: InfiniteCanvasTransformer;
    let currentTransformation: Transformation;
    let viewBox: Transformable;
    let config: Partial<Config>;

    beforeEach(() => {
        vi.useFakeTimers();
        config = {};
        currentTransformation = Transformation.identity;
        viewBox = {
            get transformation(): Transformation{return currentTransformation;},
            set transformation(value: Transformation){currentTransformation = value;}
        };
        transformer = new InfiniteCanvasTransformer(viewBox, config);
    });

    afterEach(() => {
        vi.clearAllMocks();
    })

    describe("that has rotation enabled and creates two anchors and moves them", () => {

        beforeEach(() => {
            config.rotationEnabled = true;
            const anchor1: Anchor = createAnchor(1, 0);
            transformer.addAnchor(anchor1);
            const anchor2: Anchor = createAnchor(2, 0);
            transformer.addAnchor(anchor2);
            anchor1.moveTo(0, 0);
            anchor2.moveTo(0, 2);
        });

        it.each([
            [{x:1, y: 0}, {x: 0, y: 0}],
            [{x:2, y: 0}, {x: 0, y: 2}],
            [{x:2, y: 1}, {x: -2, y: 2}],
            [{x:1, y: 1}, {x: -2, y: 0}]
        ])("should result in a translation, zoom and rotation", (fromPoint: Point, toPoint: Point) => {
            expectPointToBeTransformedTo(fromPoint, currentTransformation, toPoint);
        });
    });

    describe("that creates a rotation anchor and moves it", () => {
        let anchor: Anchor;

        beforeEach(() => {
            anchor = createAnchor(1, 1);
            transformer.addRotationAnchor(anchor);
            anchor.moveTo(-24, 1);
        });

        it.each([
            [{x: 0, y: 0}, {x: 1, y:  1 - Math.sqrt(2)}],
            [{x: 0, y: 2}, {x: 1 - Math.sqrt(2), y:  1}],
            [{x: 2, y: 2}, {x: 1, y:  Math.sqrt(2) + 1}],
            [{x: 2, y: 0}, {x: 1 + Math.sqrt(2), y:  1}]
        ])("should result in a rotation", (fromPoint: Point, toPoint: Point) => {
            expectPointToBeTransformedTo(fromPoint, currentTransformation, toPoint);
        });
    });

    describe("that zooms", () => {

        beforeEach(() => {
            transformer.zoom(1, 1, 2);
            vi.advanceTimersByTime(1000);
        });

        it.each([
            [{x:0, y: 0}, {x: -1, y: -1}],
            [{x:2, y: 0}, {x: 3, y: -1}],
            [{x:2, y: 2}, {x: 3, y: 3}],
            [{x:0, y: 2}, {x: -1, y: 3}]
        ])("should result in a zoom", (fromPoint: Point, toPoint: Point) => {
            expectPointToBeTransformedTo(fromPoint, currentTransformation, toPoint);
        });
    });

    describe("that creates an anchor", () => {
        let anchor: Anchor;

        beforeEach(() => {
            anchor = createAnchor(1, 1);
            transformer.addAnchor(anchor);
        });

        describe("and then moves it", () => {

            beforeEach(() => {
                anchor.moveTo(2, 2);
            });

            it("should have resulted in a transformation that translates", () => {
                expectPointToBeTransformedTo(new Point(1, 1), currentTransformation, new Point(2, 2));
            });

            describe("and then releases it and creates another", () => {
                let newAnchor: Anchor;

                beforeEach(() => {
                    transformer.releaseAnchor(anchor);
                    newAnchor = createAnchor(2, 2);
                    transformer.addAnchor(newAnchor);
                });

                describe("and moves that one", () => {
                    
                    beforeEach(() => {
                        newAnchor.moveTo(3, 2);
                    });

                    it("should have resulted in a transformation that translates", () => {
                        expectPointToBeTransformedTo(new Point(1, 1), currentTransformation, new Point(3, 2));
                    });
                });
            });

            describe("and creates another anchor and moves it", () => {
                let secondAnchor: Anchor;

                beforeEach(() => {
                    secondAnchor = createAnchor(2, 1);
                    transformer.addAnchor(secondAnchor);
                    secondAnchor.moveTo(2, 0);
                });

                it.each([
                    [{x:0, y: 0}, {x: 0, y: 0}],
                    [{x:1, y: 0}, {x: 2, y: 0}],
                    [{x:1, y: 1}, {x: 2, y: 2}],
                    [{x:0, y: 1}, {x: 0, y: 2}]
                ])("should result in a zoom and a translate", (fromPoint: Point, toPoint: Point) => {
                    expectPointToBeTransformedTo(fromPoint, currentTransformation, toPoint);
                });

                describe("and then moves the first anchor", () => {

                    beforeEach(() => {
                        anchor.moveTo(2, 3);
                    });

                    it.each([
                        [{x:0, y: 0}, {x: -1, y: 0}],
                        [{x:1, y: 0}, {x: 2, y: 0}],
                        [{x:1, y: 1}, {x: 2, y: 3}],
                        [{x:0, y: 1}, {x: -1, y: 3}]
                    ])("should result in a zoom and a translate", (fromPoint: Point, toPoint: Point) => {
                        expectPointToBeTransformedTo(fromPoint, currentTransformation, toPoint);
                    });

                    describe("and the releases the first anchor and moves the second", () => {

                        beforeEach(() => {
                            transformer.releaseAnchor(anchor);
                            secondAnchor.moveTo(2, 1);
                        });

                        it.each([
                            [{x:0, y: 0}, {x: -1, y: 1}],
                            [{x:1, y: 0}, {x: 2, y: 1}],
                            [{x:1, y: 1}, {x: 2, y: 4}],
                            [{x:0, y: 1}, {x: -1, y: 4}]
                        ])("should result in an additional translation", (fromPoint: Point, toPoint: Point) => {
                            expectPointToBeTransformedTo(fromPoint, currentTransformation, toPoint);
                        });
                    });

                    describe("and the releases the second anchor and moves the first", () => {

                        beforeEach(() => {
                            transformer.releaseAnchor(secondAnchor);
                            anchor.moveTo(2, 4);
                        });

                        it.each([
                            [{x:0, y: 0}, {x: -1, y: 1}],
                            [{x:1, y: 0}, {x: 2, y: 1}],
                            [{x:1, y: 1}, {x: 2, y: 4}],
                            [{x:0, y: 1}, {x: -1, y: 4}]
                        ])("should result in an additional translation", (fromPoint: Point, toPoint: Point) => {
                            expectPointToBeTransformedTo(fromPoint, currentTransformation, toPoint);
                        });
                    });
                });
            });
        });
    });
});