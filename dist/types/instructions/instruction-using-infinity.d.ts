import { Transformation } from "../transformation";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
export declare type InstructionUsingInfinity = (context: CanvasRenderingContext2D, transformation: Transformation, infinity: ViewboxInfinity) => void;
