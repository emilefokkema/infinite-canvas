import { PathInstructionBuilder } from "../path-instruction-builder";
import { Position } from "../../../geometry/position";
import { PathInstructionBuilderProvider } from "../path-instruction-builder-provider";
import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";
import { AtInfinity } from "./at-infinity";
export declare class PathInstructionBuilderAtInfinity extends InfiniteCanvasPathInstructionBuilder<AtInfinity> implements PathInstructionBuilder {
    private readonly pathBuilderProvider;
    private readonly instructionToGoAroundViewbox;
    constructor(pathBuilderProvider: PathInstructionBuilderProvider, instructionToGoAroundViewbox: InstructionUsingInfinity, shape: AtInfinity);
    protected getInstructionToMoveToBeginningOfShape(shape: AtInfinity): InstructionUsingInfinity;
    protected getInstructionToExtendShapeWithLineTo(shape: AtInfinity, position: Position): InstructionUsingInfinity;
    canAddLineTo(position: Position): boolean;
    containsFinitePoint(): boolean;
    isClosable(): boolean;
    addPosition(position: Position): PathInstructionBuilder;
}
