import { Instruction } from "../../instructions/instruction";
import { Transformation } from "../../transformation";
import { CoordinateSystem } from "./coordinate-system";
export declare class CanvasContextSystem extends CoordinateSystem {
    readonly infiniteCanvasContext: CoordinateSystem;
    constructor(base: Transformation, inverseBase: Transformation, infiniteCanvasContext: CoordinateSystem);
    get userTransformation(): Transformation;
    get infiniteCanvasContextBase(): Transformation;
    get inverseInfiniteCanvasContextBase(): Transformation;
    representInfiniteCanvasContextTransformation(infiniteCanvasContextTransformation: Transformation): Transformation;
    executeInTransformedInfiniteCanvasContext(instruction: Instruction, context: CanvasRenderingContext2D): void;
}
