import { Instruction } from "./instruction";
import { AreaChange } from "../area-change";

export interface PathInstruction{
    instruction: Instruction;
    changeArea: AreaChange;
}