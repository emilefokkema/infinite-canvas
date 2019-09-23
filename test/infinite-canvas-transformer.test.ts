import { InfiniteCanvasTransformer } from "../src/transformer/infinite-canvas-transformer";
import { Transformation } from "../src/transformation";
import { Anchor } from "../src/transformer/anchor";
import { Point } from "../src/point";
import { ViewBox } from "../src/viewbox";
import { InfiniteCanvasConfig } from "../src/config/infinite-canvas-config";

jest.useFakeTimers();

function expectPointToBeTransformedTo(point: Point, transformation: Transformation, expectedPoint: Point): void{
	const actualTransformedPoint: Point = transformation.apply(point);
	expect(actualTransformedPoint.x).toBeCloseTo(expectedPoint.x);
	expect(actualTransformedPoint.y).toBeCloseTo(expectedPoint.y);
}

describe("an infinite canvas transformer", () => {
    let transformer: InfiniteCanvasTransformer;
    let currentTransformation: Transformation;
    let viewBox: ViewBox;
    let config: InfiniteCanvasConfig;

    beforeEach(() => {
        config = {};
        currentTransformation = Transformation.identity();
        viewBox = {
            width: 16,
            height: 8,
            state: undefined,
            changeState(){},
            saveState(){},
            restoreState(){},
            clearArea(){},
            beginPath(){},
            addToPath(){},
            drawPath(){},
            get transformation(): Transformation{return currentTransformation;},
            set transformation(value: Transformation){currentTransformation = value;}
        };
        transformer = new InfiniteCanvasTransformer(viewBox, config);
    });

    describe("that has rotation enabled and creates two anchors and moves them", () => {
        let anchor1: Anchor;
        let anchor2: Anchor;

        beforeEach(() => {
            config.rotationEnabled = true;
            anchor1 = transformer.getAnchor(1, 0);
            anchor2 = transformer.getAnchor(2, 0);
            anchor1.moveTo(0,0);
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
            anchor = transformer.getRotationAnchor(1, 1);
            anchor.moveTo(0, 1);
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
        let anchor: Anchor;

        beforeEach(() => {
            anchor = transformer.getAnchor(1, 1);
        });

        describe("and then moves it", () => {

            beforeEach(() => {
                anchor.moveTo(2, 2);
            });

            it("should have resulted in a transformation that translates", () => {
                expectPointToBeTransformedTo({x: 1, y: 1}, currentTransformation, {x: 2, y: 2});
            });

            describe("and then releases it and creates another", () => {

                beforeEach(() => {
                    anchor.release();
                    anchor = transformer.getAnchor(2, 2);
                });

                describe("and moves that one", () => {
                    
                    beforeEach(() => {
                        anchor.moveTo(3, 2);
                    });

                    it("should have resulted in a transformation that translates", () => {
                        expectPointToBeTransformedTo({x: 1, y: 1}, currentTransformation, {x: 3, y: 2});
                    });
                });
            });

            describe("and creates another anchor and moves it", () => {
                let secondAnchor: Anchor;

                beforeEach(() => {
                    secondAnchor = transformer.getAnchor(2, 1);
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
                            anchor.release();
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
                            secondAnchor.release();
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