import { beforeEach, describe, expect, it} from 'vitest'
import { ClippedPaths } from "../src/instructions/clipped-paths";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { logInstruction } from "./log-instruction";
import { defaultState } from "../src/state/default-state";
import { fillStyle } from "../src/state/dimensions/fill-stroke-style";
import { InstructionsWithPath } from "../src/instructions/instructions-with-path";
import { Point } from "../src/geometry/point";
import { Instruction } from "../src/instructions/instruction";
import { CanvasRectangle } from "../src/rectangle/canvas-rectangle";
import { CanvasRectangleImpl } from "../src/rectangle/canvas-rectangle-impl";
import { MockCanvasMeasurementProvider } from "./mock-canvas-measurement-provider";

describe("a clipped paths", () => {
    let clippedPaths: ClippedPaths;
    let currentState: InfiniteCanvasState;
    let rectangle: CanvasRectangle;

    beforeEach(() => {
        rectangle = new CanvasRectangleImpl(new MockCanvasMeasurementProvider(200, 200), {});
    });

    describe("and another one", () => {
        let clippedPath: InstructionsWithPath;
        let otherOne: ClippedPaths;

        beforeEach(() => {
            currentState = defaultState;
            clippedPath = InstructionsWithPath.create(currentState, rectangle);
            clippedPath.moveTo(new Point(0, 0), currentState);
            clippedPath.lineTo(new Point(1, 0), currentState);
            clippedPath.lineTo(new Point(1, 1), currentState);
            clippedPath.clipPath((context: CanvasRenderingContext2D) => {context.clip();}, currentState);
            currentState = clippedPath.state;
            clippedPaths = currentState.current.clippedPaths;
            otherOne = clippedPaths;
        });

        describe("containing one more clipped path", () => {

            beforeEach(() => {
                clippedPath.lineTo(new Point(0, 1), currentState);
                clippedPath.clipPath((context: CanvasRenderingContext2D) => {context.clip();}, currentState);
                otherOne = clippedPath.state.current.clippedPaths;
            });

            it("then one should contain the other, but not the other way around", () => {
                expect(otherOne.contains(clippedPaths)).toBe(true);
                expect(clippedPaths.contains(otherOne)).toBe(false);
            });

            describe("and then the other is recreated, starting from the first", () => {
                let recreation: Instruction;

                beforeEach(() => {
                    recreation = otherOne.except(clippedPaths).getInstructionToRecreate(rectangle);
                });

                it("then the recreation should contain the difference", () => {
                    expect(logInstruction(recreation)).toMatchSnapshot();
                });
            });

            describe("and another one, still based on the same path", () => {

                beforeEach(() => {
                    clippedPath.lineTo(new Point(0, 0), currentState);
                    clippedPath.clipPath((context: CanvasRenderingContext2D) => {context.clip();}, currentState);
                    otherOne = clippedPath.state.current.clippedPaths;
                });

                describe("and then the other is recreated, starting from the first", () => {
                    let recreation: Instruction;
    
                    beforeEach(() => {
                        recreation = otherOne.except(clippedPaths).getInstructionToRecreate(rectangle);
                    });
    
                    it("then the recreation should contain the difference", () => {
                        expect(logInstruction(recreation)).toMatchSnapshot();
                    });
                });
            });

            describe("and another one", () => {

                beforeEach(() => {
                    currentState = clippedPath.state;
                    const otherClippedPath: InstructionsWithPath = InstructionsWithPath.create(currentState, rectangle);
                    currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#f00"));
                    otherClippedPath.moveTo(new Point(1, 1), currentState);
                    otherClippedPath.clipPath((context: CanvasRenderingContext2D) => {context.clip();}, currentState);
                    otherOne = otherClippedPath.state.current.clippedPaths;
                });

                describe("and then the other is recreated, starting from the first", () => {
                    let recreation: Instruction;
    
                    beforeEach(() => {
                        recreation = otherOne.except(clippedPaths).getInstructionToRecreate(rectangle);
                    });
    
                    it("then the recreation should contain the difference", () => {
                        expect(logInstruction(recreation)).toMatchSnapshot();
                    });
                });
            });
        });
    });
});
