import { InfiniteCanvasStateAndInstruction } from "../src/instructions/infinite-canvas-state-and-instruction";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { logWithState } from "./log-with-state";
import { defaultState } from "../src/state/default-state";

describe("a set of intructions that is only about state", () => {
    let instructionsWithState: InfiniteCanvasStateAndInstruction;

    beforeEach(() => {
        instructionsWithState = new InfiniteCanvasStateAndInstruction(defaultState, () => {});
    });

    describe("that receives a change", () => {

        beforeEach(() => {
            instructionsWithState.changeState(s => s.setFillStyle("#f00"));
        });

        it("should have recorded the change", () => {
            expect(logWithState(instructionsWithState)).toMatchSnapshot();
        });

        describe("and then receives a change that reverts that one", () => {

            beforeEach(() => {
                instructionsWithState.changeState(s => s.setFillStyle("#000"));
            });

            it("should contain no instructions anymore", () => {
                expect(logWithState(instructionsWithState)).toMatchSnapshot();
            });
        });

        describe("and then receives a change on a different property", () => {

            beforeEach(() => {
                instructionsWithState.changeState(s => s.setStrokeStyle("#ff0"));
            });

            it("should now contain two instructions", () => {
                expect(logWithState(instructionsWithState)).toMatchSnapshot();
            });
        });

        describe("and then receives a change on the same property", () => {

            beforeEach(() => {
                instructionsWithState.changeState(s => s.setFillStyle("#00f"));
            });

            it("should still contain only one instruction", () => {
                expect(logWithState(instructionsWithState)).toMatchSnapshot();
            });
        });
    });
});