import { Transformation } from "../transformation";

export declare type Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => void;