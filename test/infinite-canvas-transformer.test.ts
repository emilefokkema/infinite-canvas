/**
 * @jest-environment jsdom
 */


import { InfiniteCanvasTransformer } from "../src/transformer/infinite-canvas-transformer";
import { Transformation } from "../src/transformation";
import { Point } from "../src/geometry/point";
import { InfiniteCanvasConfig } from "../src/config/infinite-canvas-config";
import { TransformableBox } from "../src/interfaces/transformable-box";

jest.useFakeTimers();

function expectPointToBeTransformedTo(point: Point, transformation: Transformation, expectedPoint: Point): void{
	const actualTransformedPoint: Point = transformation.apply(point);
	expect(actualTransformedPoint.x).toBeCloseTo(expectedPoint.x);
	expect(actualTransformedPoint.y).toBeCloseTo(expectedPoint.y);
}

describe("an infinite canvas transformer", () => {
    let transformer: InfiniteCanvasTransformer;
    let currentTransformation: Transformation;
    let viewBox: TransformableBox;
    let config: Partial<InfiniteCanvasConfig>;

    beforeEach(() => {
        config = {};
        currentTransformation = Transformation.identity;
        viewBox = {
            width: 16,
            height: 8,
            get transformation(): Transformation{return currentTransformation;},
            set transformation(value: Transformation){currentTransformation = value;}
        };
        transformer = new InfiniteCanvasTransformer(viewBox, config);
    });

    describe("that has rotation enabled and creates two anchors and moves them", () => {
        let anchor1Identifier: number;
        let anchor2Identifier: number;

        beforeEach(() => {
            anchor1Identifier = 1;
            anchor2Identifier = 2;
            config.rotationEnabled = true;
            transformer.createAnchorByExternalIdentifier(anchor1Identifier, 1, 0);
            transformer.createAnchorByExternalIdentifier(anchor2Identifier, 2, 0);
            transformer.moveAnchorByExternalIdentifier(anchor1Identifier, 0, 0);
            transformer.moveAnchorByExternalIdentifier(anchor2Identifier, 0, 2);
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
        let anchorIdentifier: number;

        beforeEach(() => {
            anchorIdentifier = transformer.createRotationAnchor(1, 1);
            transformer.moveAnchorByIdentifier(anchorIdentifier, -24, 1);
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
            jest.advanceTimersByTime(1000);
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
        let anchorIdentifier: number;

        beforeEach(() => {
            anchorIdentifier = 1;
            transformer.createAnchorByExternalIdentifier(anchorIdentifier, 1, 1);
        });

        describe("and then moves it", () => {

            beforeEach(() => {
                transformer.moveAnchorByExternalIdentifier(anchorIdentifier, 2, 2);
            });

            it("should have resulted in a transformation that translates", () => {
                expectPointToBeTransformedTo(new Point(1, 1), currentTransformation, new Point(2, 2));
            });

            describe("and then releases it and creates another", () => {

                beforeEach(() => {
                    transformer.releaseAnchorByExternalIdentifier(anchorIdentifier);
                    transformer.createAnchorByExternalIdentifier(anchorIdentifier, 2, 2);
                });

                describe("and moves that one", () => {
                    
                    beforeEach(() => {
                        transformer.moveAnchorByExternalIdentifier(anchorIdentifier, 3, 2);
                    });

                    it("should have resulted in a transformation that translates", () => {
                        expectPointToBeTransformedTo(new Point(1, 1), currentTransformation, new Point(3, 2));
                    });
                });
            });

            describe("and creates another anchor and moves it", () => {
                let secondAnchorIdentifier: number;

                beforeEach(() => {
                    secondAnchorIdentifier = 2;
                    transformer.createAnchorByExternalIdentifier(secondAnchorIdentifier, 2, 1);
                    transformer.moveAnchorByExternalIdentifier(secondAnchorIdentifier, 2, 0);
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
                        transformer.moveAnchorByExternalIdentifier(anchorIdentifier, 2, 3);
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
                            transformer.releaseAnchorByExternalIdentifier(anchorIdentifier);
                            transformer.moveAnchorByExternalIdentifier(secondAnchorIdentifier, 2, 1);
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
                            transformer.releaseAnchorByExternalIdentifier(secondAnchorIdentifier);
                            transformer.moveAnchorByExternalIdentifier(anchorIdentifier, 2, 4);
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