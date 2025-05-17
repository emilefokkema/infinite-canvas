import { Area } from "../../areas/area";
import { plane } from "../../areas/plane";
import { DrawingInstruction } from "../../drawing-instruction";
import { Instruction } from "../../instructions/instruction";
import { pathAroundViewbox } from "../../instructions/path-around-viewbox";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { Dimension } from "../dimension";
import { Rect, Shape } from '../rect'
import { throwNoTopLeftLocationError } from "./top-left-location-error";

export class PlaneRect implements Rect{
    constructor(
        private readonly horizontal: Dimension,
        private readonly vertical: Dimension
    ){

    }
    public addSubpaths(): void{
        throwNoTopLeftLocationError(this.horizontal, this.vertical)
    }
    public getRoundRect(): Shape{
        return this;
    }
    public getArea(): Area {
        return plane;
    }
    public stroke(): DrawingInstruction{
        return undefined;
    }
    public fill(state: InfiniteCanvasState, instruction: Instruction): DrawingInstruction{
        return DrawingInstruction.forFillingPath(instruction, state, () => {
            return pathAroundViewbox
        })
    }
}