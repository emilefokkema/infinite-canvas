import { Position } from "../geometry/position";
import { AreaBuilder } from "./area-builder";

export type AreaChange = (builder: AreaBuilder, currentPosition: Position) => void;