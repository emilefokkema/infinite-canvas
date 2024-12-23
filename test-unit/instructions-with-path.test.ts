import { beforeEach, describe, expect, it} from 'vitest'
import { InfiniteCanvasState } from "src/state/infinite-canvas-state";
import { logWithState } from "./log-with-state";
import { defaultState } from 'src/state/default-state';
import { fillStyle } from "src/state/dimensions/fill-stroke-style";
import { InstructionsWithPath } from "src/instructions/instructions-with-path";
import { CurrentPath } from 'src/interfaces/current-path';
import { Point } from "src/geometry/point";
import { getRectStrategy } from 'src/rect/get-rect-strategy';
import { ExecutableStateChangingInstructionSet } from 'src/interfaces/executable-state-changing-instruction-set';

function drawAndLog(instructionsWithPath: CurrentPath, state: InfiniteCanvasState): string[]{
    const result = instructionsWithPath.drawPath(
        (context: CanvasRenderingContext2D) => {context.fill();},
        state,
        {
            lineWidth: 0,
            lineDashPeriod: 0,
            shadowOffsets: []
        });
    return logWithState(result);
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

        describe("and then receives an instruction that modifies the path", () => {

            beforeEach(() => {
                instructionsWithPath.moveTo(new Point(0, 0), currentState);
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
                        }, currentState, {lineWidth: 0, lineDashPeriod: 0, shadowOffsets: []});
                        currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#ff0"));
                    });

                    it("should have recorded three changes of state", () => {
                        expect(drawAndLog(instructionsWithPath, currentState)).toMatchSnapshot();
                    });
                });
            });
        });
    });

    describe("that describes a path that is drawn, altered and then recreated", () => {
        let recreatedPath: ExecutableStateChangingInstructionSet;

        beforeEach(() => {
            instructionsWithPath.moveTo(new Point(0, 0), currentState);
            instructionsWithPath.lineTo(new Point(10, 0), currentState);
            instructionsWithPath.lineTo(new Point(10, 10), currentState);
            instructionsWithPath.lineTo(new Point(0, 10), currentState);
            currentState = currentState.withCurrentState(fillStyle.changeInstanceValue(currentState.current, "#00f"));
            instructionsWithPath.lineTo(new Point(5, 5), currentState);
            recreatedPath = instructionsWithPath.drawPath(
                (context) => context.fill(),
                currentState,
                {lineWidth: 0, lineDashPeriod: 0, shadowOffsets: []});
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
        instructionsWithPath = InstructionsWithPath.create(currentState);
        
        getRectStrategy(0, 0, 1, 1).addSubpaths(instructionsWithPath, currentState)
        instructionsWithPath.drawPath((context: CanvasRenderingContext2D) => {
            context.fill();
        }, currentState, {lineWidth: 0, lineDashPeriod: 0, shadowOffsets: []})
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
