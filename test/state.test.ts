import { InfiniteCanvasStateInstance } from "../src/state/infinite-canvas-state-instance";
import { StateChange } from "../src/state/state-change";
import { logInstruction } from "./log-instruction";
import { Instruction } from "../src/instructions/instruction";
import { Transformation } from "../src/transformation";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { InstructionsWithPath } from "../src/instructions/instructions-with-path";
import { PathInstructions } from "../src/instructions/path-instructions";
import { defaultState } from "../src/state/default-state";

describe("a state with a clipped path", () => {
    let currentPath: InstructionsWithPath;
    let stateWithOneClippedPath: InfiniteCanvasState;

    beforeEach(() => {
        currentPath = InstructionsWithPath.create(defaultState);
        currentPath.changeState(s => s.setFillStyle("#f00"));
        currentPath.addPathInstruction(PathInstructions.rect(0, 0, 3, 3));
        currentPath.clipPath((context: CanvasRenderingContext2D) => context.clip());
        stateWithOneClippedPath = currentPath.state;
    });

    describe("and another one with, higher up its stack, another clipped path that is based on the same path", () => {
        let stateWithOneMoreClippedPath: InfiniteCanvasState;

        beforeEach(() => {
            currentPath.saveState();
            currentPath.addPathInstruction(PathInstructions.moveTo(0,0));
            currentPath.clipPath((context: CanvasRenderingContext2D) => context.clip());
            stateWithOneMoreClippedPath = currentPath.state;
        });

        describe("and the other one saves once more and changes state", () => {
            let otherOneSavedAndChanged: InfiniteCanvasState;

            beforeEach(() => {
                currentPath.saveState();
                currentPath.changeState(s => s.setFillStyle("#ff0"));
                otherOneSavedAndChanged = currentPath.state;
            });

            it("should result in the right changes", () => {
                const stateChange: StateChange<InfiniteCanvasState> = stateWithOneClippedPath.convertToStateWithClippedPath(otherOneSavedAndChanged);
                expect(logInstruction(stateChange.instruction)).toMatchSnapshot();
            });
        });

        describe("when the one with one clipped path is converted (including clipped paths) to the one with another clipped path", () => {
            let stateChange: StateChange<InfiniteCanvasState>;

            beforeEach(() => {
                stateChange = stateWithOneClippedPath.convertToStateWithClippedPath(stateWithOneMoreClippedPath);
            });

            it("should result in the right instructions", () => {
                expect(logInstruction(stateChange.instruction)).toMatchSnapshot();
            });
        });
    });

    describe("and another one with another clipped path that is based on the same path", () => {
        let stateWithOneMoreClippedPath: InfiniteCanvasState;

        beforeEach(() => {
            currentPath.addPathInstruction(PathInstructions.moveTo(0,0));
            currentPath.clipPath((context: CanvasRenderingContext2D) => context.clip());
            stateWithOneMoreClippedPath = currentPath.state;
        });

        describe("when the one with one clipped path is converted (including clipped paths) to the one with another clipped path", () => {
            let stateChange: StateChange<InfiniteCanvasState>;

            beforeEach(() => {
                stateChange = stateWithOneClippedPath.convertToStateWithClippedPath(stateWithOneMoreClippedPath);
            });

            it("should result in the right instructions", () => {
                expect(logInstruction(stateChange.instruction)).toMatchSnapshot();
            });
        });
    });

    describe("and another one without a clipped path", () => {
        let stateWitoutClippedPath: InfiniteCanvasState;

        beforeEach(() => {
            stateWitoutClippedPath = defaultState.withChangedState(s => s.setFillStyle("#00f")).newState;
        });

        describe("when the one without is converted (including clipped paths) to the one with clipped paths", () => {
            let stateChange: StateChange<InfiniteCanvasState>;

            beforeEach(() => {
                stateChange = stateWitoutClippedPath.convertToStateWithClippedPath(stateWithOneClippedPath);
            });

            it("should", () => {
                expect(logInstruction(stateChange.instruction)).toMatchSnapshot();
            });
        });
    });

    describe("that is saved and to which a clipped path is added", () => {
        let stateWithCurrentlyAnAdditionalClippedPath: InfiniteCanvasState;
        let addedClippedPath: InstructionsWithPath;

        beforeEach(()=> {
            currentPath.saveState();
            addedClippedPath = InstructionsWithPath.create(currentPath.state);
            addedClippedPath.addPathInstruction(PathInstructions.moveTo(1, 1));
            addedClippedPath.clipPath(((context, transformation) => {context.clip();}));
            stateWithCurrentlyAnAdditionalClippedPath = addedClippedPath.state;
        });

        describe("and that is then restored, saved again and to which another clipped path is added", () => {
            let stateWithCurrentlyADifferentAdditionalClippedPath: InfiniteCanvasState;

            beforeEach(() => {
                addedClippedPath.restoreState();
                addedClippedPath.saveState();
                const differentAddedClippedPath: InstructionsWithPath = InstructionsWithPath.create(addedClippedPath.state);
                differentAddedClippedPath.addPathInstruction(PathInstructions.moveTo(2, 2));
                differentAddedClippedPath.clipPath(((context, transformation) => {context.clip();}));
                stateWithCurrentlyADifferentAdditionalClippedPath = differentAddedClippedPath.state;
            });

            it("should result in a state change that contains an additional 'restore' and 'save'", () => {
                const stateChange: StateChange<InfiniteCanvasState> = stateWithCurrentlyAnAdditionalClippedPath.convertToStateWithClippedPath(stateWithCurrentlyADifferentAdditionalClippedPath);
                expect(logInstruction(stateChange.instruction)).toMatchSnapshot();
            });
        });

        describe("and that is then restored and to which another clipped path is added", () => {
            let stateWithCurrentlyADifferentAdditionalClippedPath: InfiniteCanvasState;

            beforeEach(() => {
                addedClippedPath.restoreState();
                const differentAddedClippedPath: InstructionsWithPath = InstructionsWithPath.create(addedClippedPath.state);
                differentAddedClippedPath.addPathInstruction(PathInstructions.moveTo(2, 2));
                differentAddedClippedPath.clipPath(((context, transformation) => {context.clip();}));
                stateWithCurrentlyADifferentAdditionalClippedPath = differentAddedClippedPath.state;
            });

            it("should result in a state change that contains an additional 'restore' and 'save'", () => {
                const stateChange: StateChange<InfiniteCanvasState> = stateWithCurrentlyAnAdditionalClippedPath.convertToStateWithClippedPath(stateWithCurrentlyADifferentAdditionalClippedPath);
                expect(logInstruction(stateChange.instruction)).toMatchSnapshot();
            });
        });
    });

    describe("that is saved and then changed in two ways, leading to two states", () => {
        let changedOneWay: InfiniteCanvasState;
        let changedOtherWay: InfiniteCanvasState;

        beforeEach(() => {
            currentPath.saveState();
            currentPath.changeState(s => s.setFillStyle("#00f"));
            changedOneWay = currentPath.state;
            currentPath.restoreState();
            currentPath.saveState();
            currentPath.changeState(s => s.setFillStyle("#0f0"));
            changedOtherWay = currentPath.state;
        });

        it("should, when one is converted to the other without clipping paths, result in a change of state in that property alone", () => {
            const stateChange: StateChange<InfiniteCanvasState> = changedOneWay.convertToState(changedOtherWay);
            expect(logInstruction(stateChange.instruction)).toMatchSnapshot();
        });
    });

});

describe("a default state", () => {
    let state: InfiniteCanvasState;

    beforeEach(() => {
        state = defaultState;
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
                    change = oneWay.convertToState(otherWay);
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
                other = defaultState.withChangedState(s => s.setFillStyle("#00f")).newState.save().newState;
                change = state.convertToState(other);
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
                other = defaultState
                    .withChangedState(s => s.setFillStyle("#00f")).newState
                    .save().newState
                    .withChangedState(s => s.setFillStyle("#ff0")).newState;
                change = state.convertToState(other);
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
                new Transformation(2, 0, 0, 2, 0, 0),    //different
                "inherit",                              //same
                "12px sans-serif",                      //different
                "start",                                //same
                "alphabetic",                           //same
                undefined
            ));
            change = state.convertToState(otherState);
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
                newChange = change.newState.convertToState(otherState);
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