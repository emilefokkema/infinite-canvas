import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { logWithState } from "./log-with-state";
import { PathInstructions } from "../src/instructions/path-instructions";
import { defaultState } from "../src/state/default-state";
import { fillStyle } from "../src/state/dimensions/fill-stroke-style";
import { InstructionsWithPath } from "../src/instructions/instructions-with-path";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../src/interfaces/state-changing-instruction-set-with-area-and-current-path";

function drawAndLog(instructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPath, state: InfiniteCanvasState): string[]{
    instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {context.fill();}, state);
    return logWithState(instructionsWithPath);
}

describe("a set of instructions that is also about a path", () => {
    let instructionsWithPath: InstructionsWithPath;
    let currentState: InfiniteCanvasState;

    beforeEach(() => {
        currentState = defaultState;
        instructionsWithPath = InstructionsWithPath.create(currentState);
    });

    describe("that receives a change of state", () => {

        beforeEach(() => {
            currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#f00"));
        });

        it("should contain an instruction to begin a path and one to change the state", () => {
            expect(drawAndLog(instructionsWithPath, currentState)).toMatchSnapshot();
        });

        describe("and then receives an instruction that modifies the path", () => {

            beforeEach(() => {
                instructionsWithPath.addPathInstruction(PathInstructions.moveTo(0, 0), currentState);
            });

            it("should contain an instruction to begin a path, change the state and modify the path", () => {
                expect(drawAndLog(instructionsWithPath, currentState)).toMatchSnapshot();
            });

            describe("and then receives a change of state on the same property as the previous change of state", () => {

                beforeEach(() => {
                    currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#00f"));
                });
    
                it("should not have replaced the previous change of state", () => {
                    expect(drawAndLog(instructionsWithPath, currentState)).toMatchSnapshot();
                });

                describe("and then draws the path and receives another change of state on the same property", () => {

                    beforeEach(() => {
                        instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {
                            context.fill();
                        }, currentState);
                        currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#ff0"));
                    });

                    it("should have recorded three changes of state", () => {
                        expect(drawAndLog(instructionsWithPath, currentState)).toMatchSnapshot();
                    });
                });
            });
        });

        describe("and then receives a change of state on the same property", () => {

            beforeEach(() => {
                currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#00f"));
            });

            it("should still contain only two instructions", () => {
                expect(drawAndLog(instructionsWithPath, currentState)).toMatchSnapshot();
            });
        });
    });

    describe("that describes a path that is drawn, altered and then recreated", () => {
        let recreatedPath: StateChangingInstructionSetWithAreaAndCurrentPath;

        beforeEach(() => {
            instructionsWithPath.addPathInstruction(PathInstructions.moveTo(0, 0), currentState);
            instructionsWithPath.addPathInstruction(PathInstructions.lineTo(10,0), currentState);
            instructionsWithPath.addPathInstruction(PathInstructions.lineTo(10,10), currentState);
            instructionsWithPath.addPathInstruction(PathInstructions.lineTo(0,10), currentState);
            currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#00f"));
            instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {context.fill();}, currentState);
            instructionsWithPath.addPathInstruction(PathInstructions.lineTo(5, 5), currentState);
            recreatedPath = instructionsWithPath.recreatePath();
        });

        it("should not contain the intermediate drawing instruction", () => {
            expect(drawAndLog(recreatedPath, currentState)).toMatchSnapshot();
        });

        it("should have the same area", () => {
            expect(recreatedPath.getClippedArea()).toEqual(instructionsWithPath.getClippedArea());
        });

        describe("and then the recreated path changes state", () => {

            beforeEach(() => {
                recreatedPath.setInitialState(defaultState.withCurrentState(fillStyle.changeInstanceValue(defaultState.current, "#00f")));
            });

            it("should not affect the state of the original", () => {
                expect(drawAndLog(instructionsWithPath, currentState)).toMatchSnapshot();
            });
        });
    });
});

describe("a set of instructions that describe a rectangle path that is drawn", () => {
    let instructionsWithPath: InstructionsWithPath;
    let currentState: InfiniteCanvasState;

    beforeEach(() => {
        currentState = defaultState;
        instructionsWithPath = InstructionsWithPath.create(currentState, [PathInstructions.rect(0, 0, 1, 1)]);
        instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {
            context.fill();
        }, currentState)
    });

    describe("and that then changes state", () => {

        beforeEach(() => {
            currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#f00"));
        });

        it("should have recorded everything in the right order", () => {
            expect(drawAndLog(instructionsWithPath, currentState)).toMatchSnapshot();
        });
    });
});