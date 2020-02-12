import { InfiniteCanvasStateInstance } from "../src/state/infinite-canvas-state-instance";
import { logInstruction } from "./log-instruction";
import { Instruction } from "../src/instructions/instruction";
import { Transformation } from "../src/transformation";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { PathInstructions } from "../src/instructions/path-instructions";
import { defaultState } from "../src/state/default-state";
import { fillStyle, strokeStyle } from "../src/state/dimensions/fill-stroke-style";
import { InstructionsWithPath } from "../src/instructions/instructions-with-path";

function applyChangeToCurrentState(state: InfiniteCanvasState, change: (instance: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): InfiniteCanvasState{
    const newInstance: InfiniteCanvasStateInstance = change(state.current);
    return state.withCurrentState(newInstance);
}

describe("a state with a clipped path", () => {
    let currentPath: InstructionsWithPath;
    let stateWithOneClippedPath: InfiniteCanvasState;
    let currentState: InfiniteCanvasState;

    beforeEach(() => {
        currentState = defaultState;
        currentPath = InstructionsWithPath.create(defaultState);
        currentState = applyChangeToCurrentState(currentState, s => fillStyle.changeInstanceValue(s, "#f00"));
        currentPath.addPathInstruction(PathInstructions.rect(0, 0, 3, 3), currentState);
        currentPath.clipPath((context: CanvasRenderingContext2D) => context.clip(), currentState);
        currentState = currentPath.state;
        stateWithOneClippedPath = currentState;
    });

    describe("and another one with, higher up its stack, another clipped path that is based on the same path", () => {
        let stateWithOneMoreClippedPath: InfiniteCanvasState;

        beforeEach(() => {
            currentState = currentState.saved();
            currentPath.addPathInstruction(PathInstructions.moveTo(0,0), currentState);
            currentPath.clipPath((context: CanvasRenderingContext2D) => context.clip(), currentState);
            currentState = currentPath.state;
            stateWithOneMoreClippedPath = currentState;
        });

        describe("and the other one saves once more and changes state", () => {
            let otherOneSavedAndChanged: InfiniteCanvasState;

            beforeEach(() => {
                currentState = currentState.saved();
                currentState = applyChangeToCurrentState(currentState, s => fillStyle.changeInstanceValue(s, "#ff0"));
                otherOneSavedAndChanged = currentState;
            });

            it("should result in the right changes", () => {
                const stateChangeInstruction: Instruction = stateWithOneClippedPath.getInstructionToConvertToStateWithClippedPath(otherOneSavedAndChanged);
                expect(logInstruction(stateChangeInstruction)).toMatchSnapshot();
            });
        });

        describe("when the one with one clipped path is converted (including clipped paths) to the one with another clipped path", () => {
            let stateChangeInstruction: Instruction;

            beforeEach(() => {
                stateChangeInstruction = stateWithOneClippedPath.getInstructionToConvertToStateWithClippedPath(stateWithOneMoreClippedPath);
            });

            it("should result in the right instructions", () => {
                expect(logInstruction(stateChangeInstruction)).toMatchSnapshot();
            });
        });
    });

    describe("and another one with another clipped path that is based on the same path", () => {
        let stateWithOneMoreClippedPath: InfiniteCanvasState;

        beforeEach(() => {
            currentPath.addPathInstruction(PathInstructions.moveTo(0,0), currentState);
            currentPath.clipPath((context: CanvasRenderingContext2D) => context.clip(), currentState);
            stateWithOneMoreClippedPath = currentPath.state;
        });

        describe("when the one with one clipped path is converted (including clipped paths) to the one with another clipped path", () => {
            let stateChangeInstruction: Instruction;

            beforeEach(() => {
                stateChangeInstruction = stateWithOneClippedPath.getInstructionToConvertToStateWithClippedPath(stateWithOneMoreClippedPath);
            });

            it("should result in the right instructions", () => {
                expect(logInstruction(stateChangeInstruction)).toMatchSnapshot();
            });
        });
    });

    describe("and another one without a clipped path", () => {
        let stateWitoutClippedPath: InfiniteCanvasState;

        beforeEach(() => {
            stateWitoutClippedPath = applyChangeToCurrentState(defaultState, s => fillStyle.changeInstanceValue(s, "#00f"));
        });

        describe("when the one without is converted (including clipped paths) to the one with clipped paths", () => {
            let stateChangeInstruction: Instruction;

            beforeEach(() => {
                stateChangeInstruction = stateWitoutClippedPath.getInstructionToConvertToStateWithClippedPath(stateWithOneClippedPath);
            });

            it("should", () => {
                expect(logInstruction(stateChangeInstruction)).toMatchSnapshot();
            });
        });
    });

    describe("that is saved and to which a clipped path is added", () => {
        let stateWithCurrentlyAnAdditionalClippedPath: InfiniteCanvasState;
        let addedClippedPath: InstructionsWithPath;

        beforeEach(()=> {
            currentState = currentState.saved();
            addedClippedPath = InstructionsWithPath.create(currentState);
            addedClippedPath.addPathInstruction(PathInstructions.moveTo(1, 1), currentState);
            addedClippedPath.clipPath((context, transformation) => {context.clip();}, currentState);
            currentState = addedClippedPath.state;
            stateWithCurrentlyAnAdditionalClippedPath = currentState;
        });

        describe("and that is then restored, saved again and to which another clipped path is added", () => {
            let stateWithCurrentlyADifferentAdditionalClippedPath: InfiniteCanvasState;

            beforeEach(() => {
                currentState = currentState.restored();
                currentState = currentState.saved();
                const differentAddedClippedPath: InstructionsWithPath = InstructionsWithPath.create(currentState);
                differentAddedClippedPath.addPathInstruction(PathInstructions.moveTo(2, 2), currentState);
                differentAddedClippedPath.clipPath((context, transformation) => {context.clip();}, currentState);
                stateWithCurrentlyADifferentAdditionalClippedPath = differentAddedClippedPath.state;
            });

            it("should result in a state change that contains an additional 'restore' and 'save'", () => {
                const stateChangeInstruction: Instruction = stateWithCurrentlyAnAdditionalClippedPath.getInstructionToConvertToStateWithClippedPath(stateWithCurrentlyADifferentAdditionalClippedPath);
                expect(logInstruction(stateChangeInstruction)).toMatchSnapshot();
            });
        });

        describe("and that is then restored and to which another clipped path is added", () => {
            let stateWithCurrentlyADifferentAdditionalClippedPath: InfiniteCanvasState;

            beforeEach(() => {
                currentState = currentState.restored();
                const differentAddedClippedPath: InstructionsWithPath = InstructionsWithPath.create(currentState);
                differentAddedClippedPath.addPathInstruction(PathInstructions.moveTo(2, 2), currentState);
                differentAddedClippedPath.clipPath((context, transformation) => {context.clip();}, currentState);
                stateWithCurrentlyADifferentAdditionalClippedPath = differentAddedClippedPath.state;
            });

            it("should result in a state change that contains an additional 'restore' and 'save'", () => {
                const stateChangeInstruction: Instruction = stateWithCurrentlyAnAdditionalClippedPath.getInstructionToConvertToStateWithClippedPath(stateWithCurrentlyADifferentAdditionalClippedPath);
                expect(logInstruction(stateChangeInstruction)).toMatchSnapshot();
            });
        });
    });

    describe("that is saved and then changed in two ways, leading to two states", () => {
        let changedOneWay: InfiniteCanvasState;
        let changedOtherWay: InfiniteCanvasState;

        beforeEach(() => {
            currentState = currentState.saved();
            currentState = applyChangeToCurrentState(currentState, s => fillStyle.changeInstanceValue(s, "#00f"));
            changedOneWay = currentState;
            currentState = currentState.restored();
            currentState = currentState.saved();
            currentState = applyChangeToCurrentState(currentState, s => fillStyle.changeInstanceValue(s, "#0f0"));
            changedOtherWay = currentState;
        });

        it("should, when one is converted to the other without clipping paths, result in a change of state in that property alone", () => {
            const stateChangeInstruction: Instruction = changedOneWay.getInstructionToConvertToState(changedOtherWay);
            expect(logInstruction(stateChangeInstruction)).toMatchSnapshot();
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
            state = applyChangeToCurrentState(state, s => fillStyle.changeInstanceValue(s, "#f00")).saved();
        });

        describe("and then changes in two different ways", () => {
            let oneWay: InfiniteCanvasState;
            let otherWay: InfiniteCanvasState;

            beforeEach(() => {
                oneWay = applyChangeToCurrentState(state, s => strokeStyle.changeInstanceValue(s, "#f00"));
                otherWay = applyChangeToCurrentState(state, s => fillStyle.changeInstanceValue(s, "#00f"));
            });

            describe("and then one way is converted to the other way", () => {
                let changeInstruction: Instruction;

                beforeEach(() => {
                    changeInstruction = oneWay.getInstructionToConvertToState(otherWay);
                });

                it("should result in instructions that change the state, but no restoring", () => {
                    expect(changeInstruction).toBeTruthy();
                    expect(logInstruction(changeInstruction)).toMatchSnapshot();
                });
            });
        });

        describe("and is then converted to another that also changed and saved", () => {
            let other: InfiniteCanvasState;
            let changeInstruction: Instruction;

            beforeEach(() => {
                other = applyChangeToCurrentState(defaultState, s => fillStyle.changeInstanceValue(s, "#00f")).saved();
                changeInstruction = state.getInstructionToConvertToState(other);
            });

            it("should have created intructions to restore, change and save", () => {
                expect(changeInstruction).toBeTruthy();
                expect(logInstruction(changeInstruction)).toMatchSnapshot();
            });
        });

        describe("and is then converted to another that changed, saved and then changed again", () => {
            let other: InfiniteCanvasState;
            let changeInstruction: Instruction;

            beforeEach(() => {
                other = applyChangeToCurrentState(defaultState, s => fillStyle.changeInstanceValue(s, "#00f"))
                    .saved();
                other = applyChangeToCurrentState(other, s => fillStyle.changeInstanceValue(s, "#ff0"));
                changeInstruction = state.getInstructionToConvertToState(other);
            });

            it("should have created intructions to restore, change, save and change again", () => {
                expect(changeInstruction).toBeTruthy();
                expect(logInstruction(changeInstruction)).toMatchSnapshot();
            });
        });
    });

    describe("that is changed to a non-default state that differs on some fields but not all", () => {
        let changeInstruction: Instruction;
        let otherState: InfiniteCanvasState;

        beforeEach(() => {
            otherState = new InfiniteCanvasState(new InfiniteCanvasStateInstance({
                fillStyle: '#000',                                      //same
                lineWidth: 2,                                           //different
                lineDash: [1,2],                                        //different
                strokeStyle: '#f00',                                    //different
                lineDashOffset: 0,                                      //same
                transformation: new Transformation(2, 0, 0, 2, 0, 0),   //different
                direction: "inherit",                                   //same
                font: "12px sans-serif",                                //different
                textAlign: "start",                                     //same
                textBaseline: "alphabetic",                             //same
                clippedPaths: undefined,                                //same
                fillAndStrokeStylesTransformed: false,
                shadowOffset: {x: 0, y: 0},
                shadowColor: 'rgba(0, 0, 0, 0)',
                shadowBlur: 0
            }));
            changeInstruction = state.getInstructionToConvertToState(otherState);
        });

        it("should have created an instruction that sets the fields that differ", () => {
            expect(changeInstruction).toBeTruthy();
            expect(logInstruction(changeInstruction)).toMatchSnapshot();
        });
    });

    describe("that sets the fill style", () => {
        let changeInstruction: Instruction;
        let newState: InfiniteCanvasState;

        beforeEach(() => {
            const newInstance: InfiniteCanvasStateInstance = fillStyle.changeInstanceValue(state.current, "#f00")
            newState = state.withCurrentState(newInstance);
            changeInstruction = fillStyle.getInstructionToChange(state.current, newInstance);
        });

        it("should have created an instruction", () => {
            expect(changeInstruction).toBeTruthy();
            expect(logInstruction(changeInstruction)).toMatchSnapshot();
        });

        describe("and then sets it again on the new state", () => {
            let newChangeInstruction: Instruction;

            beforeEach(() => {
                const newInstance: InfiniteCanvasStateInstance = fillStyle.changeInstanceValue(newState.current, "#f00")
                newChangeInstruction = fillStyle.getInstructionToChange(newState.current, newInstance);
            });

            it("should not have created an instruction", () => {
                expect(logInstruction(newChangeInstruction)).toMatchSnapshot();
            });
        });
    });
});