import { StateChange } from "./state-change";
import { Instruction } from "../instructions/instruction";
import { groupInstructions } from "../instructions/group-instructions";

export class ChainableStateChange<TSTate> implements StateChange<TSTate>{
    public instruction: Instruction;
    constructor(public newState: TSTate, private readonly instructions: Instruction[]){
        if(instructions.length){
            this.instruction = groupInstructions(instructions);
        }
    }
    public change(change: (state: TSTate) => StateChange<TSTate>): ChainableStateChange<TSTate>{
        const newStateChange: StateChange<TSTate> = change(this.newState);
        if(newStateChange.instruction){
            return new ChainableStateChange(newStateChange.newState, this.instructions.concat([newStateChange.instruction]));
        }
        return new ChainableStateChange(newStateChange.newState, this.instructions);
    }
}