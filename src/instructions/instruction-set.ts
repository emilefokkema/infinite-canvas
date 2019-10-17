import { WithState } from "../state/with-state";
import { PathContainer } from "../path-container";
import { WithInstruction } from "./with-instruction";

export interface InstructionSet extends WithState, WithInstruction, PathContainer{
    
}