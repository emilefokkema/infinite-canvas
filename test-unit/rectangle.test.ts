/// <reference types="../test-utils/custom-matchers"/>

import { beforeEach, describe, it, expect} from 'vitest'
import '../test-utils/expect-extensions';
import { Units } from "api/units";
import { RectangleManager } from 'src/rectangle/rectangle-manager';
import { CanvasMeasurementProvider } from 'src/rectangle/canvas-measurement-provider';
import { TransformationRepresentation } from 'api/transformation-representation';
import { RectangleManagerImpl } from 'src/rectangle/rectangle-manager-impl';

const identity: TransformationRepresentation = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}

describe('given these dimensions for the rectangle and this user transformation', () => {
    let userTransformation: TransformationRepresentation;
    let measurementProvider: CanvasMeasurementProvider
    let screenWidth: number;
    let screenHeight: number;
    let viewboxWidth: number;
    let viewboxHeight: number;

    beforeEach(() => {
        screenWidth = 400;
        screenHeight = 400;
        viewboxWidth = 300;
        viewboxHeight = 150;
        measurementProvider = {
            measure(){
                return {top: 0, left: 0, screenWidth, screenHeight, viewboxWidth, viewboxHeight}
            }
        };
        userTransformation = identity;
    })

    describe('and a canvas rectangle that uses canvas units', () => {
        let rectangle: RectangleManager;        

        beforeEach(() => {
            rectangle = new RectangleManagerImpl(measurementProvider, {units: Units.CANVAS});
            rectangle.measure()
        })

        it('should have these transformations', () => {
            expect(rectangle.rectangle.userTransformation).toBeCloseToTransformation(identity)
            expect(rectangle.rectangle.infiniteCanvasContext.base).toBeCloseToTransformation({
                a: screenWidth / viewboxWidth,
                b: 0,
                c: 0, 
                d: screenHeight / viewboxHeight,
                e: 0,
                f: 0
            })
            expect(rectangle.rectangle.infiniteCanvasContext.inverseBase).toBeCloseToTransformation({
                a: viewboxWidth / screenWidth,
                b: 0,
                c: 0,
                d: viewboxHeight / screenHeight,
                e: 0,
                f: 0
            });
        })

        it('should generate this initial transformation', () => {
            expect(rectangle.rectangle.initialBitmapTransformation).toBeCloseToTransformation(identity)
        })

        it('should generate this transformation of bitmap to infinite canvas context', () => {
            expect(rectangle.rectangle.getBitmapTransformationToInfiniteCanvasContext()).toBeCloseToTransformation(identity);
        })

        it('should generate this transformation for instruction', () => {
            const desiredTransformation: TransformationRepresentation = {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: 20,
                f: 20
            };
            expect(rectangle.rectangle.getTransformationForInstruction(desiredTransformation)).toBeCloseToTransformation(desiredTransformation)
        })

        it('should generate this translation of an infinite canvas context transformation', () => {
            const desiredTransformation: TransformationRepresentation = {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: 20,
                f: 20
            };
            expect(rectangle.rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(desiredTransformation)).toBeCloseToTransformation(desiredTransformation)
        })

        describe('that receives the user transformation', () => {
            
            beforeEach(() => {
                userTransformation = {
                    a: 0,
                    b: -2,
                    c: 2,
                    d: 0,
                    e: 50,
                    f: 200
                };
                rectangle.setTransformation(userTransformation);
            })

            it('should have these transformations', () => {
                expect(rectangle.rectangle.userTransformation).toBeCloseToTransformation(userTransformation)
                expect(rectangle.rectangle.infiniteCanvasContext.base).toBeCloseToTransformation({
                    a: 0,
                    b: -2.66666,
                    c: 5.33333,
                    d: 0,
                    e: 50,
                    f: 200
                })
                expect(rectangle.rectangle.infiniteCanvasContext.inverseBase).toBeCloseToTransformation({
                    a: 0,
                    b: .1875,
                    c: -.375,
                    d: 0,
                    e: 75,
                    f: -9.375
                });
            })

            it('should generate this initial transformation', () => {
                expect(rectangle.rectangle.initialBitmapTransformation).toBeCloseToTransformation({
                    a: 2,
                    b: 0,
                    c: 0,
                    d: .5,
                    e: -62.5,
                    f: -25
                })
            })

            it('should generate this transformation of bitmap to infinite canvas context', () => {
                expect(rectangle.rectangle.getBitmapTransformationToInfiniteCanvasContext()).toBeCloseToTransformation({
                    a: 0,
                    b: -1,
                    c: 4,
                    d: 0,
                    e: 37.5,
                    f: 75
                });
            })

            it('should generate this transformation for instruction', () => {
                const desiredTransformation: TransformationRepresentation = {
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: 20,
                    f: 20
                };
                expect(rectangle.rectangle.getTransformationForInstruction(desiredTransformation)).toBeCloseToTransformation({
                    a: 2,
                    b: 0,
                    c: 0,
                    d: .5,
                    e: 17.5,
                    f: -45
                })
            })

            it('should generate this translation of an infinite canvas context transformation', () => {
                const desiredTransformation: TransformationRepresentation = {
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: 20,
                    f: 20
                };
                expect(rectangle.rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(desiredTransformation)).toBeCloseToTransformation({
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: 80,
                    f: -20
                })
            })

            describe('and then the screen dimensions change', () => {

                beforeEach(() => {
                    screenWidth = 500;
                    rectangle.measure();
                })

                it('should have these transformations', () => {
                    expect(rectangle.rectangle.userTransformation).toBeCloseToTransformation(userTransformation)
                    expect(rectangle.rectangle.infiniteCanvasContext.base).toBeCloseToTransformation({
                        a: 0,
                        b: -2.666666,
                        c: 6.666666,
                        d: 0,
                        e: 62.5,
                        f: 200
                    })
                    expect(rectangle.rectangle.infiniteCanvasContext.inverseBase).toBeCloseToTransformation({
                        a: 0,
                        b: .15,
                        c: -.375,
                        d: 0,
                        e: 75,
                        f: -9.375
                    });
                })

                it('should generate this initial transformation', () => {
                    expect(rectangle.rectangle.initialBitmapTransformation).toBeCloseToTransformation({
                        a: 2,
                        b: 0,
                        c: 0,
                        d: .5,
                        e: -62.5,
                        f: -25
                    })
                })

                it('should generate this transformation of bitmap to infinite canvas context', () => {
                    expect(rectangle.rectangle.getBitmapTransformationToInfiniteCanvasContext()).toBeCloseToTransformation({
                        a: 0,
                        b: -1,
                        c: 4,
                        d: 0,
                        e: 37.5,
                        f: 75
                    });
                })

                it('should generate this transformation for instruction', () => {
                    const desiredTransformation: TransformationRepresentation = {
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        e: 20,
                        f: 20
                    };

                    expect(rectangle.rectangle.getTransformationForInstruction(desiredTransformation)).toBeCloseToTransformation({
                        a: 2,
                        b: 0,
                        c: 0,
                        d: .5,
                        e: 17.5,
                        f: -45
                    })
                })

                it('should generate this translation of an infinite canvas context transformation', () => {
                    const desiredTransformation: TransformationRepresentation = {
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        e: 20,
                        f: 20
                    };
                    expect(rectangle.rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(desiredTransformation)).toBeCloseToTransformation({
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        e: 80,
                        f: -20
                    })
                })

                describe('and then the user transformation changes', () => {

                    beforeEach(() => {
                        userTransformation = {
                            a: -1,
                            b: 0,
                            c: 0,
                            d: -1,
                            e: 100,
                            f: 200
                        }
                        rectangle.setTransformation(userTransformation);
                    })

                    it('should have these transformations', () => {
                        expect(rectangle.rectangle.userTransformation).toBeCloseToTransformation(userTransformation)
                        expect(rectangle.rectangle.infiniteCanvasContext.base).toBeCloseToTransformation({
                            a: -1.333333,
                            b: 0,
                            c: 0,
                            d: -3.333333,
                            e: 100,
                            f: 193.75
                        })
                        expect(rectangle.rectangle.infiniteCanvasContext.inverseBase).toBeCloseToTransformation({
                            a: -.75,
                            b: 0,
                            c: 0,
                            d: -.3,
                            e: 75,
                            f: 58.125
                        });
                    })

                    it('should generate this initial transformation', () => {
                        expect(rectangle.rectangle.initialBitmapTransformation).toBeCloseToTransformation({
                            a: .8,
                            b: 0,
                            c: 0,
                            d: 1.25,
                            e: -20,
                            f: -177.34375
                        })
                    })

                    it('should generate this transformation of bitmap to infinite canvas context', () => {
                        expect(rectangle.rectangle.getBitmapTransformationToInfiniteCanvasContext()).toBeCloseToTransformation({
                            a: -.8,
                            b: 0,
                            c: 0,
                            d: -1.25,
                            e: 60,
                            f: 72.65625
                        });
                    })

                    it('should generate this transformation for instruction', () => {
                        const desiredTransformation: TransformationRepresentation = {
                            a: 1,
                            b: 0,
                            c: 0,
                            d: 1,
                            e: 20,
                            f: 20
                        };
                        expect(rectangle.rectangle.getTransformationForInstruction(desiredTransformation)).toBeCloseToTransformation({
                            a: .8,
                            b: 0,
                            c: 0,
                            d: 1.25,
                            e: -36,
                            f: -202.34375
                        })
                    })

                    it('should generate this translation of an infinite canvas context transformation', () => {
                        const desiredTransformation: TransformationRepresentation = {
                            a: 1,
                            b: 0,
                            c: 0,
                            d: 1,
                            e: 20,
                            f: 20
                        }
                        expect(rectangle.rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(desiredTransformation)).toBeCloseToTransformation({
                            a: 1,
                            b: 0,
                            c: 0,
                            d: 1,
                            e: -16,
                            f: -25
                        })
                    })
                })
            })
        })
    })

    describe('and a canvas rectangle that uses css units', () => {
        let rectangle: RectangleManager;

        beforeEach(() => {
            rectangle = new RectangleManagerImpl(measurementProvider, {units: Units.CSS});
            rectangle.measure()
        })

        it('should have these transformations', () => {
            expect(rectangle.rectangle.userTransformation).toBeCloseToTransformation(identity)
            expect(rectangle.rectangle.infiniteCanvasContext.base).toBeCloseToTransformation(identity)
            expect(rectangle.rectangle.infiniteCanvasContext.inverseBase).toBeCloseToTransformation(identity);
        })

        it('should generate this initial transformation', () => {
            expect(rectangle.rectangle.initialBitmapTransformation).toBeCloseToTransformation({
                a: .75,
                b: 0,
                c: 0,
                d: .375,
                e: 0,
                f: 0
            })
        })

        it('should generate this transformation of bitmap to infinite canvas context', () => {
            expect(rectangle.rectangle.getBitmapTransformationToInfiniteCanvasContext()).toBeCloseToTransformation({
                a: .75,
                b: 0,
                c: 0,
                d: .375,
                e: 0,
                f: 0
            });
        })

        it('should generate this transformation for instruction', () => {
            const desiredTransformation: TransformationRepresentation = {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: 20,
                f: 20
            };
            expect(rectangle.rectangle.getTransformationForInstruction(desiredTransformation)).toBeCloseToTransformation({
                a: .75,
                b: 0,
                c: 0,
                d: .375,
                e: 15,
                f: 7.5
            })
        })

        it('should generate this translation of an infinite canvas context transformation', () => {
            const desiredTransformation: TransformationRepresentation = {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: 20,
                f: 20
            }
            expect(rectangle.rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(desiredTransformation)).toBeCloseToTransformation({
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: 15,
                f: 7.5
            })
        })

        describe('that receives the user transformation', () => {

            beforeEach(() => {
                userTransformation = {
                    a: 0,
                    b: -2,
                    c: 2,
                    d: 0,
                    e: 50,
                    f: 200
                }
                rectangle.setTransformation(userTransformation);
            })

            it('should have these transformations', () => {
                expect(rectangle.rectangle.userTransformation).toBeCloseToTransformation(userTransformation)
                expect(rectangle.rectangle.infiniteCanvasContext.base).toBeCloseToTransformation({
                    a: 0,
                    b: -2,
                    c: 2,
                    d: 0,
                    e: 50,
                    f: 200
                })
                expect(rectangle.rectangle.infiniteCanvasContext.inverseBase).toBeCloseToTransformation({
                    a: 0,
                    b: .5,
                    c: -.5,
                    d: 0,
                    e: 100,
                    f: -25
                });
            })

            it('should generate this initial transformation', () => {
                expect(rectangle.rectangle.initialBitmapTransformation).toBeCloseToTransformation({
                    a: .75,
                    b: 0,
                    c: 0,
                    d: .375,
                    e: 0,
                    f: 0
                })
            })

            it('should generate this transformation of bitmap to infinite canvas context', () => {
                expect(rectangle.rectangle.getBitmapTransformationToInfiniteCanvasContext()).toBeCloseToTransformation({
                    a: 0,
                    b: -.75,
                    c: 1.5,
                    d: 0,
                    e: 37.5,
                    f: 75
                });
            })

            it('should generate this transformation for instruction', () => {
                const desiredTransformation: TransformationRepresentation = {
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: 20,
                    f: 20
                };
                expect(rectangle.rectangle.getTransformationForInstruction(desiredTransformation)).toBeCloseToTransformation({
                    a: .75,
                    b: 0,
                    c: 0,
                    d: .375,
                    e: 30,
                    f: -15
                })
            })

            it('should generate this translation of an infinite canvas context transformation', () => {
                const desiredTransformation: TransformationRepresentation = {
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: 20,
                    f: 20
                };
                expect(rectangle.rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(desiredTransformation)).toBeCloseToTransformation({
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: 30,
                    f: -15
                })
            })

            describe('and then the screen dimensions change', () => {

                beforeEach(() => {
                    screenWidth = 500;
                    rectangle.measure();
                })

                it('should have these transformations', () => {
                    expect(rectangle.rectangle.userTransformation).toBeCloseToTransformation(userTransformation)
                    expect(rectangle.rectangle.infiniteCanvasContext.base).toBeCloseToTransformation({
                        a: 0,
                        b: -2,
                        c: 2,
                        d: 0,
                        e: 50,
                        f: 200
                    })
                    expect(rectangle.rectangle.infiniteCanvasContext.inverseBase).toBeCloseToTransformation({
                        a: 0,
                        b: .5,
                        c: -.5,
                        d: 0,
                        e: 100,
                        f: -25
                    });
                })

                it('should generate this initial transformation', () => {
                    expect(rectangle.rectangle.initialBitmapTransformation).toBeCloseToTransformation({
                        a: .6,
                        b: 0,
                        c: 0,
                        d: .375,
                        e: 0,
                        f: 0
                    })
                })

                it('should generate this transformation of bitmap to infinite canvas context', () => {
                    expect(rectangle.rectangle.getBitmapTransformationToInfiniteCanvasContext()).toBeCloseToTransformation({
                        a: 0,
                        b: -.75,
                        c: 1.2,
                        d: 0,
                        e: 30,
                        f: 75
                    });
                })

                it('should generate this transformation for instruction', () => {
                    const desiredTransformation: TransformationRepresentation = {
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        e: 20,
                        f: 20
                    };
                    expect(rectangle.rectangle.getTransformationForInstruction(desiredTransformation)).toBeCloseToTransformation({
                        a: .6,
                        b: 0,
                        c: 0,
                        d: .375,
                        e: 24,
                        f: -15
                    })
                })

                it('should generate this translation of an infinite canvas context transformation', () => {
                    const desiredTransformation: TransformationRepresentation = {
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        e: 20,
                        f: 20
                    }
                    
                    expect(rectangle.rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(desiredTransformation)).toBeCloseToTransformation({
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        e: 24,
                        f: -15
                    })
                })
            })
        })
    })
})
