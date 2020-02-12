import { ClippedPaths } from "../src/instructions/clipped-paths";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { PathInstructions } from "../src/instructions/path-instructions";
import { InstructionSet } from "../src/interfaces/instruction-set";
import { logInstruction } from "./log-instruction";
import { Transformation } from "../src/transformation";
import { defaultState } from "../src/state/default-state";
import { fillStyle } from "../src/state/dimensions/fill-stroke-style";
import { InstructionsWithPath } from "../src/instructions/instructions-with-path";

describe("a clipped paths", () => {
    let clippedPaths: ClippedPaths;
    let currentState: InfiniteCanvasState;

    describe("and another one", () => {
        let clippedPath: InstructionsWithPath;
        let otherOne: ClippedPaths;

        beforeEach(() => {
            currentState = defaultState;
            clippedPath = InstructionsWithPath.create(currentState);
            clippedPath.addPathInstruction(PathInstructions.moveTo(0, 0), currentState);
            clippedPath.addPathInstruction(PathInstructions.lineTo(1, 0), currentState);
            clippedPath.addPathInstruction(PathInstructions.lineTo(1, 1), currentState);
            clippedPath.clipPath((context: CanvasRenderingContext2D) => {context.clip();}, currentState);
            currentState = clippedPath.state;
            clippedPaths = currentState.current.clippedPaths;
            otherOne = clippedPaths;
        });

        describe("containing one more clipped path", () => {

            beforeEach(() => {
                clippedPath.addPathInstruction(PathInstructions.lineTo(0, 1), currentState);
                clippedPath.clipPath((context: CanvasRenderingContext2D) => {context.clip();}, currentState);
                otherOne = clippedPath.state.current.clippedPaths;
            });

            it("then one should contain the other, but not the other way around", () => {
                expect(otherOne.contains(clippedPaths)).toBe(true);
                expect(clippedPaths.contains(otherOne)).toBe(false);
            });

            describe("and then the other is recreated, starting from the first", () => {
                let recreation: InstructionSet;

                beforeEach(() => {
                    recreation = otherOne.recreateStartingFrom(clippedPaths);
                });

                it("then the recreation should contain the difference", () => {
                    expect(logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                        recreation.execute(context, transformation);
                    })).toMatchSnapshot();
                });
            });

            describe("and another one, still based on the same path", () => {

                beforeEach(() => {
                    clippedPath.addPathInstruction(PathInstructions.lineTo(0, 0), currentState);
                    clippedPath.clipPath((context: CanvasRenderingContext2D) => {context.clip();}, currentState);
                    otherOne = clippedPath.state.current.clippedPaths;
                });

                describe("and then the other is recreated, starting from the first", () => {
                    let recreation: InstructionSet;
    
                    beforeEach(() => {
                        recreation = otherOne.recreateStartingFrom(clippedPaths);
                    });
    
                    it("then the recreation should contain the difference", () => {
                        expect(logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                            recreation.execute(context, transformation);
                        })).toMatchSnapshot();
                    });
                });
            });

            describe("and another one", () => {

                beforeEach(() => {
                    currentState = clippedPath.state;
                    const otherClippedPath: InstructionsWithPath = InstructionsWithPath.create(currentState);
                    currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#f00"));
                    otherClippedPath.addPathInstruction(PathInstructions.moveTo(1,1), currentState);
                    otherClippedPath.clipPath((context: CanvasRenderingContext2D) => {context.clip();}, currentState);
                    otherOne = otherClippedPath.state.current.clippedPaths;
                });

                describe("and then the other is recreated, starting from the first", () => {
                    let recreation: InstructionSet;
    
                    beforeEach(() => {
                        recreation = otherOne.recreateStartingFrom(clippedPaths);
                    });
    
                    it("then the recreation should contain the difference", () => {
                        expect(logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
                            recreation.execute(context, transformation);
                        })).toMatchSnapshot();
                    });
                });
            });
        });
    });
});