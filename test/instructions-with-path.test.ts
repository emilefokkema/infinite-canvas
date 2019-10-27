import { InstructionsWithPath } from "../src/instructions/instructions-with-path";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { logWithState } from "./log-with-state";
import { PathInstructions } from "../src/instructions/path-instructions";
import { Transformation } from "../src/transformation";
import { StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState } from "../src/interfaces/state-changing-instruction-set-with-area-and-current-path";

function drawAndLog(instructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState): string[]{
    instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {context.fill();});
    return logWithState(instructionsWithPath);
}

describe("a set of instructions that is also about a path", () => {
    let instructionsWithPath: InstructionsWithPath;

    beforeEach(() => {
        instructionsWithPath = new InstructionsWithPath(InfiniteCanvasState.default);
    });

    describe("that receives a change of state", () => {

        beforeEach(() => {
            instructionsWithPath.changeState(s => s.setFillStyle("#f00"));
        });

        it("should contain an instruction to begin a path and one to change the state", () => {
            expect(drawAndLog(instructionsWithPath)).toMatchSnapshot();
        });

        describe("and then receives an instruction that modifies the path", () => {

            beforeEach(() => {
                instructionsWithPath.addPathInstruction(PathInstructions.moveTo(0, 0));
            });

            it("should contain an instruction to begin a path, change the state and modify the path", () => {
                expect(drawAndLog(instructionsWithPath)).toMatchSnapshot();
            });

            describe("and then receives a change of state on the same property as the previous change of state", () => {

                beforeEach(() => {
                    instructionsWithPath.changeState(s => s.setFillStyle("#00f"));
                });
    
                it("should not have replaced the previous change of state", () => {
                    expect(drawAndLog(instructionsWithPath)).toMatchSnapshot();
                });

                describe("and then draws the path and receives another change of state on the same property", () => {

                    beforeEach(() => {
                        instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {
                            context.fill();
                        });
                        instructionsWithPath.changeState(s => s.setFillStyle("#ff0"));
                    });

                    it("should have recorded three changes of state", () => {
                        expect(drawAndLog(instructionsWithPath)).toMatchSnapshot();
                    });
                });
            });
        });

        describe("and then receives a change of state on the same property", () => {

            beforeEach(() => {
                instructionsWithPath.changeState(s => s.setFillStyle("#00f"));
            });

            it("should still contain only two instructions", () => {
                expect(drawAndLog(instructionsWithPath)).toMatchSnapshot();
            });
        });
    });

    describe("that describes a path that is drawn, altered and then recreated", () => {
        let recreatedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState;

        beforeEach(() => {
            instructionsWithPath.addPathInstruction(PathInstructions.moveTo(0, 0));
            instructionsWithPath.addPathInstruction(PathInstructions.lineTo(10,0));
            instructionsWithPath.addPathInstruction(PathInstructions.lineTo(10,10));
            instructionsWithPath.addPathInstruction(PathInstructions.lineTo(0,10));
            instructionsWithPath.changeState(s => s.setFillStyle("#00f"));
            instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {context.fill();});
            instructionsWithPath.addPathInstruction(PathInstructions.lineTo(5, 5));
            recreatedPath = instructionsWithPath.recreatePath();
        });

        it("should not contain the intermediate drawing instruction", () => {
            expect(drawAndLog(recreatedPath)).toMatchSnapshot();
        });

        describe("and then the recreated path changes state", () => {

            beforeEach(() => {
                recreatedPath.changeState(s => s.setFillStyle("#f00"));
            });

            it("should not affect the state of the original", () => {
                expect(drawAndLog(instructionsWithPath)).toMatchSnapshot();
            });
        });
    });
});

describe("a set of instructions that describe a rectangle path that is drawn", () => {
    let instructionsWithPath: InstructionsWithPath;

    beforeEach(() => {
        const initialState: InfiniteCanvasState = InfiniteCanvasState.default;
        instructionsWithPath = InstructionsWithPath.create(initialState, [PathInstructions.rect(0, 0, 1, 1)]);
        instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {
            context.fill();
        })
    });

    describe("and that then changes state", () => {

        beforeEach(() => {
            instructionsWithPath.changeState(s => s.setFillStyle("#f00"))
        });

        it("should have recorded everything in the right order", () => {
            expect(drawAndLog(instructionsWithPath)).toMatchSnapshot();
        });
    });
});