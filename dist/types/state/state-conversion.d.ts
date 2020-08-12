import { InfiniteCanvasState } from "./infinite-canvas-state";
import { Instruction } from "../instructions/instruction";
import { InfiniteCanvasStateInstance } from "./infinite-canvas-state-instance";
export declare class StateConversion {
    protected currentState: InfiniteCanvasState;
    private instructions;
    constructor(currentState: InfiniteCanvasState);
    restore(): void;
    save(): void;
    changeCurrentInstanceTo(instance: InfiniteCanvasStateInstance): void;
    protected addChangeToState(newState: InfiniteCanvasState, instruction: Instruction): void;
    get instruction(): Instruction;
}
