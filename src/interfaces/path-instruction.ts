import { Instruction } from "../instructions/instruction";
import { AreaChange } from "../area-change";

export interface PathInstruction{
    instruction: Instruction;
    changeArea: AreaChange;
}