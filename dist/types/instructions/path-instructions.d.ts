import { PathInstruction } from "../interfaces/path-instruction";
export declare class PathInstructions {
    static arc(_x: number, _y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): PathInstruction;
    static arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): PathInstruction;
    static bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PathInstruction;
    static ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): PathInstruction;
    static quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PathInstruction;
}
