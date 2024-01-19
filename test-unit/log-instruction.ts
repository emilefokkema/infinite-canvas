import { Instruction } from "../src/instructions/instruction";
import { CanvasContextMock } from "./canvas-context-mock";
import { MockRectangle } from "./mock-rectangle";

export function logInstruction(instruction: Instruction): string[]{
    const mock: CanvasContextMock = new CanvasContextMock();
    const mockRectangle = new MockRectangle();
    instruction(mock.mock, mockRectangle);
    return mock.getLog();
}