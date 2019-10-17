import { Rectangle } from "./rectangle";
import { WithStateAndInstruction } from "./instructions/with-state-and-instruction";

export interface WithStateAndArea extends WithStateAndInstruction{
    area: Rectangle;
}