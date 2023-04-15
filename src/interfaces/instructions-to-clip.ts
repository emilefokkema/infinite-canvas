import { Area } from "../areas/area";
import { ExecutableInstruction } from "./executable-instruction";
import { StateChange } from "./state-change";

export interface InstructionsToClip extends ExecutableInstruction, StateChange{
    readonly area: Area;
}