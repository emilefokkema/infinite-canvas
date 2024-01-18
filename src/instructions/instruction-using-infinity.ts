import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export declare type InstructionUsingInfinity = (context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity) => void;