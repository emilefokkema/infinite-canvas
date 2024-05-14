import { Area } from "../areas/area";
import { plane } from "../areas/plane";
import { InfiniteCanvasPathInfinityProvider } from "../infinite-canvas-path-infinity-provider";
import { DrawablePath } from "../interfaces/drawable-path";
import { DrawnPathProperties } from "../interfaces/drawn-path-properties";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { ExecutableInstructionWithState } from "./executable-instruction-with-state";
import { Instruction } from "./instruction";

class PathAroundViewbox implements DrawablePath{
    public area: Area = plane

    public drawPath(instruction: Instruction, state: InfiniteCanvasState, drawnPathProperties: DrawnPathProperties): ExecutableStateChangingInstructionSet{
        const pathInfinityProvider = new InfiniteCanvasPathInfinityProvider(drawnPathProperties)
        const infinity = pathInfinityProvider.getInfinity(state)

        return ExecutableInstructionWithState.create(state, (context, rectangle) => {
            context.beginPath();
            infinity.addPathAroundViewbox(context, rectangle)
            instruction(context, rectangle)
        })
    }
}

export const pathAroundViewbox = new PathAroundViewbox();