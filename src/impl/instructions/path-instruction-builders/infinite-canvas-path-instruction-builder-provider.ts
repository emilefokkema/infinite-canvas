import { PathInstructionBuilderProvider } from "./path-instruction-builder-provider";
import { isPointAtInfinity } from "../../geometry/is-point-at-infinity";
import { Position } from "../../geometry/position";
import { PathInstructionBuilder } from "./path-instruction-builder";
import { PathInstructionBuilderFromPointAtInfinityToPointAtInfinity } from "./from-point-at-infinity-to-point-at-infinity/path-instruction-builder-from-point-at-infinity-to-point-at-infinity";
import { PathInstructionBuilderFromPointAtInfinityToPoint } from "./from-point-at-infinity-to-point/path-instruction-builder-from-point-at-infinity-to-point";
import { PathInstructionBuilderFromPointToPointAtInfinity } from "./from-point-to-point-at-infinity/path-instruction-builder-from-point-to-point-at-infinity";
import { PathInstructionBuilderFromPointToPoint } from "./from-point-to-point/path-instruction-builder-from-point-to-point";
import { PathInstructionBuilderAtInfinity } from "./at-infinity/path-instruction-builder-at-infinity";
import { FromPointAtInfinityToPointAtInfinity } from "./from-point-at-infinity-to-point-at-infinity/from-point-at-infinity-to-point-at-infinity";
import { FromPointAtInfinityToPoint } from "./from-point-at-infinity-to-point/from-point-at-infinity-to-point";
import { FromPointToPointAtInfinity } from "./from-point-to-point-at-infinity/from-point-to-point-at-infinity";
import { FromPointToPoint } from "./from-point-to-point/from-point-to-point";
import { AtInfinity } from "./at-infinity/at-infinity";

export class InfiniteCanvasPathInstructionBuilderProvider implements PathInstructionBuilderProvider {
    fromPointAtInfinityToPointAtInfinity(shape: FromPointAtInfinityToPointAtInfinity): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointAtInfinityToPointAtInfinity(this, shape);
    }
    fromPointAtInfinityToPoint(shape: FromPointAtInfinityToPoint): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointAtInfinityToPoint(this, shape);
    }
    fromPointToPointAtInfinity(shape: FromPointToPointAtInfinity): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointToPointAtInfinity(this, shape);
    }
    fromPointToPoint(shape: FromPointToPoint): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointToPoint(this, shape);
    }
    atInfinity(shape: AtInfinity): PathInstructionBuilder{
        return new PathInstructionBuilderAtInfinity(this, shape);
    }
    getBuilderFromPosition(position: Position): PathInstructionBuilder{
        if(isPointAtInfinity(position)){
           return new PathInstructionBuilderAtInfinity(this, AtInfinity.create(position));
        }
        return new PathInstructionBuilderFromPointToPoint(this, new FromPointToPoint(position, position));
    }
};