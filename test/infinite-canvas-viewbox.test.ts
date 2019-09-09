import { InfiniteCanvasViewBox } from "../src/infinite-canvas-viewbox"
import { Transformation } from "../src/transformation"
import { Rectangle } from "../src/rectangle";

describe("an infinite canvas viewbox", () => {
	let viewbox: InfiniteCanvasViewBox;
	let setFillStyle: jest.Mock;
	let fillRect: jest.Mock;
	let clearRect: jest.Mock;
	let width: number;
	let height: number;
	let setFillStyleInstruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void;
	let fillRectInstruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void;

	beforeEach(() => {
		setFillStyleInstruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.fillStyle = "#f00";
		};
		fillRectInstruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.fillRect(0, 0, 20, 20);
		};
		setFillStyle = jest.fn();
		fillRect = jest.fn();
		clearRect = jest.fn();
		const context: any = {
			set fillStyle(value: any){setFillStyle(value);},
			clearRect(...args: any[]){clearRect(...args);},
			fillRect(...args: any[]){fillRect(...args);}
		};
		viewbox = new InfiniteCanvasViewBox(width, height, context);
	});

	describe("to which an instruction is added", () => {

		beforeEach(() => {
			viewbox.addInstruction(setFillStyleInstruction);
		});

		it("should have executed the instruction", () => {
			expect(setFillStyle).toHaveBeenCalledTimes(1);
			expect(setFillStyle).toHaveBeenCalledWith("#f00");
		});

		it("should have cleared a rectangle", () => {
			expect(clearRect).toHaveBeenCalledTimes(1);
			expect(clearRect).toHaveBeenCalledWith(0, 0, width, height);
		});

		describe("and then another one", () => {

			beforeEach(() => {
				viewbox.addInstruction(fillRectInstruction);
			});

			it("should have cleared a rectangle again", () => {
				expect(clearRect).toHaveBeenCalledTimes(2);
			});

			it("should have executed the previous instruction again", () => {
				expect(setFillStyle).toHaveBeenCalledTimes(2);
			});

			it("should have executed the new instruction", () => {
				expect(fillRect).toHaveBeenCalledTimes(1);
				expect(fillRect).toHaveBeenCalledWith(0, 0, 20, 20);
			});
		});
	});

	describe("to which an instruction is added and a rectangle is specified", () => {

		beforeEach(() => {
			viewbox.addInstruction(fillRectInstruction, new Rectangle(1, 1, 2, 2));
		});

		it("should have executed the new instruction", () => {
			expect(fillRect).toHaveBeenCalledTimes(1);
		});

		describe("and which then clears an area containing that instruction", () => {

			beforeEach(() => {
				viewbox.clearArea(0, 0, 4, 4);
			});

			describe("and to which another instruction is then added", () => {

				beforeEach(() => {
					viewbox.addInstruction(setFillStyleInstruction);
				});

				it("should not have executed the old instruction again", () => {
					expect(fillRect).toHaveBeenCalledTimes(1);
				});
			});
		});
	});

	describe("that begins an area", () => {

		beforeEach(() => {
			viewbox.beginArea();
		});

		describe("and then adds several instructions that make up an area", () => {

			beforeEach(() => {
				viewbox.addInstruction(fillRectInstruction, new Rectangle(0, 0, 1, 1));
				viewbox.addInstruction(fillRectInstruction, new Rectangle(3, 0, 1, 1));
				viewbox.addInstruction(fillRectInstruction, new Rectangle(0, 3, 1, 1));
			});

			it("should have executed the new instructions", () => {
				expect(fillRect).toHaveBeenCalledTimes(6); //=== 1 + 2 + 3
			});

			describe("and then closes the area, clears a smaller area than the one that was closed and adds another instruction", () => {

				beforeEach(() => {
					viewbox.closeArea();
					viewbox.clearArea(0, 0, 2, 2);
					viewbox.addInstruction(setFillStyleInstruction);
				});

				it("should still have executed the instructions in the completed area", () => {
					expect(fillRect).toHaveBeenCalledTimes(9); // three more
				});
			});
			
		});
	});
});