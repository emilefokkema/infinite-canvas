import { Position } from "../geometry/position"

export interface AreaBuilder{
    addPosition(position: Position): void;
}