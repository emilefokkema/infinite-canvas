import { DrawingInstruction } from "../../drawing-instruction";
import { Instruction } from "../../instructions/instruction";
import { InstructionsWithPath } from "../../instructions/instructions-with-path";
import { CurrentPath } from "../../interfaces/current-path";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { Corner, TopLeftCorner } from "../corners/corner-strategy";
import { Shape } from "../rect";

export class RectLikeShape implements Shape{
    private readonly corners: Corner[]
    constructor(
        private readonly topLeftCorner: TopLeftCorner,
        ...corners: Corner[]
    ){
        this.corners = corners;
    }
    public addSubpaths(currentPath: CurrentPath, state: InfiniteCanvasState): void{
        this.topLeftCorner.moveToEndingPoint(currentPath, state)
        for(const corner of this.corners){
            corner.draw(currentPath, state)
        }
        this.topLeftCorner.finishRect(currentPath, state)
    }
    public stroke(state: InfiniteCanvasState, instruction: Instruction): DrawingInstruction{
        return DrawingInstruction.forStrokingPath(instruction, state, (_state) => {
            const result = InstructionsWithPath.create(_state);
            this.addSubpaths(result, _state)
            return result;
        })
    }
    public fill(state: InfiniteCanvasState, instruction: Instruction): DrawingInstruction{
        return DrawingInstruction.forFillingPath(instruction, state, (_state) => {
            const result = InstructionsWithPath.create(_state);
            this.addSubpaths(result, _state)
            return result;
        })
    }
}