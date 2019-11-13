import { ClippedPaths } from "../src/instructions/clipped-paths";
import { InstructionsWithPath } from "../src/instructions/instructions-with-path";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { PathInstructions } from "../src/instructions/path-instructions";
import { InstructionSet } from "../src/interfaces/instruction-set";
import { logInstruction } from "./log-instruction";
import { Transformation } from "../src/transformation";
import { defaultState } from "../src/state/default-state";
import {StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState} from "../src/interfaces/state-changing-instruction-set-with-area-and-current-path";

describe("a clipped paths", () => {
    let clippedPaths: ClippedPaths;

    describe("and another one", () => {
        let clippedPath: InstructionsWithPath;
        let otherOne: ClippedPaths;

        beforeEach(() => {
            clippedPath = InstructionsWithPath.create(defaultState);
            clippedPath.addPathInstruction(PathInstructions.moveTo(0, 0));
            clippedPath.addPathInstruction(PathInstructions.lineTo(1, 0));
            clippedPath.addPathInstruction(PathInstructions.lineTo(1, 1));
            let copy: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = clippedPath.recreateClippedPath();
            clippedPaths = new ClippedPaths(copy.getClippedArea(), copy);
            otherOne = new ClippedPaths(copy.getClippedArea(), copy);
        });

        describe("containing the same clipped paths", () => {

            beforeEach(() => {
                clippedPath.addPathInstruction(PathInstructions.lineTo(0, 1));
                let copy: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = clippedPath.recreateClippedPath();
                clippedPaths = clippedPaths.withClippedPath(copy);
                otherOne = otherOne.withClippedPath(copy);
            });

            it("should be equal", () => {
                expect(clippedPaths.equals(otherOne)).toBe(true);
            });
        });

        describe("containing one more clipped path", () => {

            beforeEach(() => {
                clippedPath.addPathInstruction(PathInstructions.lineTo(0, 1));
                let copy: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = clippedPath.recreateClippedPath();
                otherOne = otherOne.withClippedPath(copy);
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
                    clippedPath.addPathInstruction(PathInstructions.lineTo(0, 0));
                    let copy: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = clippedPath.recreateClippedPath();
                    otherOne = otherOne.withClippedPath(copy);
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
                    const otherClippedPath: InstructionsWithPath = InstructionsWithPath.create(clippedPath.state);
                    otherClippedPath.changeState(s => s.setFillStyle("#f00"));
                    otherClippedPath.addPathInstruction(PathInstructions.moveTo(1,1));
                    otherOne = otherOne.withClippedPath(otherClippedPath);
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