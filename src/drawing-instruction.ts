import { Rectangle } from "./rectangle";
import { Instruction } from "./instruction";
import { ImmutablePathInstructionSet } from "./immutable-path-instruction-set";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";

export interface DrawingInstruction extends Instruction{
	state: InfiniteCanvasState;
    pathInstructions: ImmutablePathInstructionSet;
	area?: Rectangle;
	useLeadingInstructionsFrom(previousInstruction: DrawingInstruction): void;
	useAllLeadingInstructions(): void;
}