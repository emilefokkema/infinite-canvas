import { Area } from "../areas/area";
import { plane } from "../areas/plane";
import { InfiniteCanvasPathInfinityProvider } from "../infinite-canvas-path-infinity-provider";
import { DrawablePath } from "../interfaces/drawable-path";
import { DrawnPathProperties } from "../interfaces/drawn-path-properties";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { ExecutableInstructionWithState } from "./executable-instruction-with-state";
import { Instruction } from "./instruction";

class PathAroundViewboxInstruction implements Instruction {
    constructor(
        private readonly infinity: ViewboxInfinity,
        private readonly instruction: Instruction
    ){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        context.beginPath();
        this.infinity.addPathAroundViewbox(context, rectangle, false)
        this.instruction.execute(context, rectangle)
    }
}
class PathAroundViewbox implements DrawablePath{
    public area: Area = plane

    public drawPath(instruction: Instruction, state: InfiniteCanvasState, drawnPathProperties: DrawnPathProperties): ExecutableStateChangingInstructionSet{
        const pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties)
        const infinity = pathInfinityProvider.getInfinity(state)

        return ExecutableInstructionWithState.create(state, new PathAroundViewboxInstruction(infinity, instruction))
    }
}

export const pathAroundViewbox = new PathAroundViewbox();