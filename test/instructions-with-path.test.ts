import { InstructionsWithPath } from "../src/instructions/instructions-with-path";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { logWithState } from "./log-with-state";
import { PathInstructions } from "../src/instructions/path-instructions";

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
            expect(logWithState(instructionsWithPath)).toMatchSnapshot();
        });

        describe("and then receives an instruction that modifies the path", () => {

            beforeEach(() => {
                instructionsWithPath.addPathInstruction(PathInstructions.moveTo(0, 0));
            });

            it("should contain an instruction to begin a path, change the state and modify the path", () => {
                expect(logWithState(instructionsWithPath)).toMatchSnapshot();
            });

            describe("and then receives a change of state on the same property as the previous change of state", () => {

                beforeEach(() => {
                    instructionsWithPath.changeState(s => s.setFillStyle("#00f"));
                });
    
                it("should not have replaced the previous change of state", () => {
                    expect(logWithState(instructionsWithPath)).toMatchSnapshot();
                });

                describe("and then draws the path and receives another change of state on the same property", () => {

                    beforeEach(() => {
                        instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {
                            context.fill();
                        });
                        instructionsWithPath.changeState(s => s.setFillStyle("#ff0"));
                    });

                    it("should have recorded three changes of state", () => {
                        expect(logWithState(instructionsWithPath)).toMatchSnapshot();
                    });
                });
            });
        });

        describe("and then receives a change of state on the same property", () => {

            beforeEach(() => {
                instructionsWithPath.changeState(s => s.setFillStyle("#00f"));
            });

            it("should still contain only two instructions", () => {
                expect(logWithState(instructionsWithPath)).toMatchSnapshot();
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
            expect(logWithState(instructionsWithPath)).toMatchSnapshot();
        });
    });
});