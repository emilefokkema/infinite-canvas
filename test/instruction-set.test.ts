import { Transformation } from "../src/transformation";
import { logInstruction } from "./log-instruction";
import { fillStyle } from "../src/state/dimensions/fill-stroke-style";
import { InfiniteCanvasInstructionSet } from "../src/infinite-canvas-instruction-set";
import { Point } from "../src/geometry/point";
import { HTMLCanvasRectangle } from "../src/rectangle/html-canvas-rectangle";
import { MockCanvasMeasurementProvider } from "./mock-canvas-measurement-provider";

describe("an instruction set", () => {
    let instructionSet: InfiniteCanvasInstructionSet;
    let onChangeSpy: jest.Mock;

    beforeEach(() => {
        onChangeSpy = jest.fn();
        instructionSet = new InfiniteCanvasInstructionSet(onChangeSpy, new HTMLCanvasRectangle(new MockCanvasMeasurementProvider(200, 200), {}));
    });

    describe("that begins drawing a path", () => {

        beforeEach(() => {
            instructionSet.beginPath();
            instructionSet.moveTo(new Point(0, 0));
            instructionSet.lineTo(new Point(3, 0));
            instructionSet.lineTo(new Point(0, 3));
        });

        it("should not have called onchange", () => {
            expect(onChangeSpy).not.toHaveBeenCalled();
        });

        describe("and then fills it", () => {

            beforeEach(() => {
                instructionSet.fillPath((context: CanvasRenderingContext2D) => {context.fill();});
            });

            it("should have called onchange", () => {
                expect(onChangeSpy).toHaveBeenCalledTimes(1);
            });

            describe("and then clears part of the drawing", () => {

                beforeEach(() => {
                    onChangeSpy.mockClear();
                    instructionSet.clearArea(0, 0, 1, 1);
                });

                it("should have called onchange", () => {
                    expect(onChangeSpy).toHaveBeenCalledTimes(1);
                });

                it("should have recorded a clearRect", () => {
                    expect(logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                        instructionSet.execute(context, transformation);
                    })).toMatchSnapshot();
                });
            });
        });
    });

    describe("that changes state and draws a rectangle", () => {

        beforeEach(() => {
            instructionSet.changeState(s => fillStyle.changeInstanceValue(s, "#f00"));
            instructionSet.fillRect(0, 0, 1, 1, (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.fill();
            });
        });

        it("should have called onchange", () => {
            expect(onChangeSpy).toHaveBeenCalledTimes(1);
        });

        describe("and then partially clears that rectangle", () => {

            beforeEach(() => {
                onChangeSpy.mockClear();
                instructionSet.clearArea(0.5, 0, 2, 2);
            });

            it("should end up with a rectangle followed by a clearRect", () => {
                expect(logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                    instructionSet.execute(context, transformation);
                })).toMatchSnapshot();
            });

            it("should have called onchange", () => {
                expect(onChangeSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("and then clears a rectangle", () => {

            beforeEach(() => {
                onChangeSpy.mockClear();
                instructionSet.clearArea(-1, -1, 3, 3);
            });

            it("should no longer have recorded the first rectangle", () => {
                expect(logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                    instructionSet.execute(context, transformation);
                })).toMatchSnapshot();
            });

            it("should have called onchange", () => {
                expect(onChangeSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("and changes state and draws another rectangle", () => {

            beforeEach(() => {
                instructionSet.changeState(s => fillStyle.changeInstanceValue(s, "#00f"));
                instructionSet.fillRect(2, 0, 1, 1, (context: CanvasRenderingContext2D, transformation: Transformation) => {
                    context.fill();
                });
            });

            it("should have recorded everything in the right order", () => {
                expect(logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                    instructionSet.execute(context, transformation);
                })).toMatchSnapshot();
            });
        });
    });
});
