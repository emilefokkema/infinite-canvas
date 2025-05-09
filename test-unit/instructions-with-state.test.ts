import { beforeEach, describe, expect, it} from 'vitest'
import { logWithState } from "./log-with-state";
import { defaultState } from "src/state/default-state";
import { fillStyle, strokeStyle } from "src/state/dimensions/fill-stroke-style";
import { ExecutableInstructionWithState } from 'src/instructions/executable-instruction-with-state';
import { InfiniteCanvasState } from "src/state/infinite-canvas-state";

describe("a set of intructions that is only about state", () => {
    let instructionsWithState: ExecutableInstructionWithState;
    let state: InfiniteCanvasState;
    let initialState: InfiniteCanvasState;

    beforeEach(() => {
        state = defaultState;
        initialState = state;
        instructionsWithState = ExecutableInstructionWithState.create(state, () => {});
    });

    describe("that receives a change", () => {

        beforeEach(() => {
            initialState = initialState.withCurrentState(fillStyle.changeInstanceValue(initialState.current, "#f00"))
            instructionsWithState.setInitialState(initialState);
        });

        it("should have recorded the change", () => {
            expect(logWithState(instructionsWithState)).toMatchSnapshot();
        });

        describe("and then receives a change that reverts that one", () => {

            beforeEach(() => {
                initialState = initialState.withCurrentState(fillStyle.changeInstanceValue(initialState.current, "#000"))
                instructionsWithState.setInitialState(initialState);
            });

            it("should contain no instructions anymore", () => {
                expect(logWithState(instructionsWithState)).toMatchSnapshot();
            });
        });

        describe("and then receives a change on a different property", () => {

            beforeEach(() => {
                initialState = initialState.withCurrentState(strokeStyle.changeInstanceValue(initialState.current, "#ff0"))
                instructionsWithState.setInitialState(initialState);
            });

            it("should now contain two instructions", () => {
                expect(logWithState(instructionsWithState)).toMatchSnapshot();
            });
        });

        describe("and then receives a change on the same property", () => {

            beforeEach(() => {
                initialState = initialState.withCurrentState(fillStyle.changeInstanceValue(initialState.current, "#00f"))
                instructionsWithState.setInitialState(initialState);
            });

            it("should still contain only one instruction", () => {
                expect(logWithState(instructionsWithState)).toMatchSnapshot();
            });
        });
    });
});
