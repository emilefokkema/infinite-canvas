import { Instruction } from "../src/instructions/instruction";
import { CanvasContextMock } from "./canvas-context-mock";
import { Transformation } from "../src/transformation";

export function logInstruction(instruction: Instruction, transformation: Transformation = Transformation.identity): string[]{
    const mock: CanvasContextMock = new CanvasContextMock();
    instruction(mock.mock, transformation);
    return mock.getLog();
}