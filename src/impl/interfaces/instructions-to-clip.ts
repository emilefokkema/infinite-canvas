import { Area } from "../areas/area";
import { Instruction } from "../instructions/instruction";
import { StateChange } from "./state-change";

export interface InstructionsToClip extends Instruction, StateChange{
    readonly area: Area;
}