import { Instruction } from "../instructions/instruction";
import { AreaChange } from "../areas/area-change";
import { Position } from "../geometry/position";
import { Point } from "../geometry/point";
export interface PathInstruction {
    instruction: Instruction;
    changeArea: AreaChange;
    positionChange?: Position;
    initialPoint?: Point;
}
