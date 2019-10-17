import { InfiniteCanvasStateInstance } from "../src/state/infinite-canvas-state-instance";
import { StateChange } from "../src/state/state-change";
import { logInstruction } from "./log-instruction";
import { Instruction } from "../src/instructions/instruction";
import { Transformation } from "../src/transformation";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";

describe("a default state", () => {
    let state: InfiniteCanvasState;

    beforeEach(() => {
        state = InfiniteCanvasState.default;
    });

    describe("that changes and saves", () => {

        beforeEach(() => {
            state = state.withChangedState(s => s.setFillStyle("#f00")).newState.save().newState;
        });

        describe("and then changes in two different ways", () => {
            let oneWay: InfiniteCanvasState;
            let otherWay: InfiniteCanvasState;

            beforeEach(() => {
                oneWay = state.withChangedState(s => s.setStrokeStyle("#f00")).newState;
                otherWay = state.withChangedState(s => s.setFillStyle("#00f")).newState;
            });

            describe("and then one way is converted to the other way", () => {
                let change: StateChange<InfiniteCanvasState>;

                beforeEach(() => {
                    change = oneWay.convertTo(otherWay);
                });

                it("should result in instructions that change the state, but no restoring", () => {
                    expect(change.instruction).toBeTruthy();
                    expect(logInstruction(change.instruction)).toMatchSnapshot();
                });
            });
        });

        describe("and is then converted to another that also changed and saved", () => {
            let other: InfiniteCanvasState;
            let change: StateChange<InfiniteCanvasState>;

            beforeEach(() => {
                other = InfiniteCanvasState.default.withChangedState(s => s.setFillStyle("#00f")).newState.save().newState;
                change = state.convertTo(other);
            });

            it("should have created intructions to restore, change and save", () => {
                expect(change.instruction).toBeTruthy();
                expect(logInstruction(change.instruction)).toMatchSnapshot();
            });
        });

        describe("and is then converted to another that changed, saved and then changed again", () => {
            let other: InfiniteCanvasState;
            let change: StateChange<InfiniteCanvasState>;

            beforeEach(() => {
                other = InfiniteCanvasState.default
                    .withChangedState(s => s.setFillStyle("#00f")).newState
                    .save().newState
                    .withChangedState(s => s.setFillStyle("#ff0")).newState;
                change = state.convertTo(other);
            });

            it("should have created intructions to restore, change, save and change again", () => {
                expect(change.instruction).toBeTruthy();
                expect(logInstruction(change.instruction)).toMatchSnapshot();
            });
        });
    });

    describe("that is changed to a non-default state that differs on some fields but not all", () => {
        let change: StateChange<InfiniteCanvasState>;
        let otherState: InfiniteCanvasState;

        beforeEach(() => {
            otherState = new InfiniteCanvasState(new InfiniteCanvasStateInstance(
                "#000",                                 //same
                2,                                      //different
                [1,2],                                  //different
                "#f00",                                 //different
                0,                                      //same
                new Transformation(2, 0, 0, 2, 0, 0)    //different
            ));
            change = state.convertTo(otherState);
        });

        it("should have created an instruction that sets the fields that differ", () => {
            const createdInstruction: Instruction = change.instruction;
            expect(createdInstruction).toBeTruthy();
            expect(logInstruction(createdInstruction)).toMatchSnapshot();
        });

        it("should have created a change with a new state that is equal to the state that it changed to", () => {
            const newState: InfiniteCanvasStateInstance = change.newState.current;
            expect(newState.fillStyle).toBe(otherState.current.fillStyle);
            expect(newState.lineWidth).toBe(otherState.current.lineWidth);
            expect(newState.lineDash).toEqual(otherState.current.lineDash);
            expect(newState.strokeStyle).toBe(otherState.current.strokeStyle);
            expect(newState.lineDashOffset).toBe(otherState.current.lineDashOffset);
            expect(newState.transformation.equals(otherState.current.transformation)).toBe(true);
        });

        describe("and is then changed to that same state again", () => {
            let newChange: StateChange<InfiniteCanvasState>;

            beforeEach(() => {
                newChange = change.newState.convertTo(otherState);
            });

            it("should not have created an instruction", () => {
                expect(newChange.instruction).toBeFalsy();
            });
        });
    });

    describe("that sets the fill style", () => {
        let change: StateChange<InfiniteCanvasState>;

        beforeEach(() => {
            change = state.withChangedState(s => s.setFillStyle("#f00"));
        });

        it("should have created an instruction", () => {
            const createdInstruction: Instruction = change.instruction;
            expect(createdInstruction).toBeTruthy();
            expect(logInstruction(createdInstruction)).toMatchSnapshot();
        });

        describe("and then sets it again on the new state", () => {
            let newChange: StateChange<InfiniteCanvasState>;

            beforeEach(() => {
                newChange = change.newState.withChangedState(s => s.setFillStyle("#f00"));
            });

            it("should not have created an instruction", () => {
                const createdInstruction: Instruction = newChange.instruction;
                expect(createdInstruction).toBeFalsy();
            });
        });
    });
});