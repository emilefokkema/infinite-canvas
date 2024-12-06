import { beforeEach, describe, expect, it} from 'vitest'
import {CanvasContextMock} from "./canvas-context-mock";
import {InfiniteCanvasRenderingContext2D} from "api/infinite-canvas-rendering-context-2d";
import { createInfiniteCanvasTestFixture } from './infinite-canvas-test-fixture';

describe('an infinite canvas context', () => {
	let infiniteContext: InfiniteCanvasRenderingContext2D;
	let contextMock: CanvasContextMock;


    beforeEach(() => {
		({contextMock, infiniteContext} = createInfiniteCanvasTestFixture());
	});

    describe("fills a rect, begins a path, clips it and then fills it", () => {

		beforeEach(() => {
			infiniteContext.fillStyle = "#f00";
			infiniteContext.fillRect(0, 0, 100, 100);
			infiniteContext.beginPath();
			infiniteContext.moveTo(10,10);
			infiniteContext.lineTo(10,90);
			infiniteContext.lineTo(90,90);
			infiniteContext.lineTo(90,10);
			infiniteContext.clip();
			infiniteContext.fillStyle = "#0f0";
			contextMock.clear();
			infiniteContext.fill();
		});

		it("should have added an instruction to clip", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then reduces the path's area, clips again and fills a rect", () => {

			beforeEach(() => {
				infiniteContext.lineTo(70,30);
				infiniteContext.clip();
				infiniteContext.fillStyle = "#00f";
				contextMock.clear();
				infiniteContext.fillRect(0,0,100,100);
			});

			it("should have added a filled rectangle after the clip", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then reduces the path's area again and fills it", () => {

				beforeEach(() => {
					infiniteContext.lineTo(50,90);
					infiniteContext.fillStyle = "#ff0";
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should have recreated the path and filled it", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

    describe("that clips with a rect, fills a rect, clips with another rect and then fills two rects", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(1, 1, 8, 8);
			infiniteContext.clip();
			infiniteContext.fillRect(0, 5, 2, 2);
			infiniteContext.beginPath();
			infiniteContext.rect(2, 2, 6, 6);
			infiniteContext.clip();
			infiniteContext.fillRect(7, 5, 2, 2);
			contextMock.clear();
			infiniteContext.fillRect(5, 5, 1, 2);
		});

		it("should contain two clipping instructions", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then removes the second filled rectangle by clearing a rect", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.clearRect(6.5, 4.5, 2, 3);
			});

			it("should still contain two clipping instructions", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then removes the first filled rectangle by clearing a rect", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(0.5, 4.5, 2, 3);
				});

				it("should still contain two clipping instructions", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

    describe("that saves state, makes a rect and clips it", () => {

		beforeEach(() => {
			infiniteContext.save();
			infiniteContext.beginPath();
			infiniteContext.rect(2, 2, 3, 3);
			infiniteContext.clip();
		});

		describe("and then makes a new rectangular path partly overlapping the clipped area and fills it", () => {

			beforeEach(() => {
				infiniteContext.beginPath();
				infiniteContext.moveTo(0, 0);
				infiniteContext.lineTo(6, 0);
				infiniteContext.lineTo(6, 3);
				infiniteContext.lineTo(0, 3);
				infiniteContext.lineTo(0, 0);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should contain the clipping instruction", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then restores state and fills a rect outside the clipped area", () => {

				beforeEach(() => {
					infiniteContext.restore();
					contextMock.clear();
					infiniteContext.fillRect(7, 0, 1, 1);
				});

				it("should still contain the clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect that contains that partial overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 3);
					});

					it("should forget about the filled rect inside the clipped area, not contain a clipping instruction and not add a clearRect", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then restores state and begins a path outside the clipped area and fills it", () => {

				beforeEach(() => {
					infiniteContext.restore();
					infiniteContext.beginPath();
					infiniteContext.rect(7, 0, 1, 1);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should still contain the clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect that contains that partial overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 3);
					});

					it("should forget about the filled rect inside the clipped area, not contain a clipping instruction and not add a clearRect", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then clears a rect that contains that partial overlap", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(1, 1, 5, 3);
				});

				it("should forget about the filled rect and not add a clearRect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then once again fills the path", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fill();
					});

					it("should contain the clipping instruction again", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then fills a rect partly overlapping the clipped area", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fillRect(0, 0, 6, 3);
					});

					it("should contain the clipping instruction again", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});

		describe("and then fills a rect partly overlapping the clipped area", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fillRect(0, 0, 6, 3);
			});

			it("should contain the clipping instruction", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then fills another rect partly overlapping the clipped area", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.fillRect(0, 4, 6, 2);
				});

				it("should still contain only one clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect containing the second overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 3.5, 5, 3);
					});

					it("should still contain one clipping instruction", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect containing the first overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 2.5);
					});

					it("should still contain one clipping instruction", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then restores state and fills a rect outside the clipped area", () => {

				beforeEach(() => {
					infiniteContext.restore();
					contextMock.clear();
					infiniteContext.fillRect(7, 0, 1, 1);
				});

				it("should still contain the clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect that contains that partial overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 3);
					});

					it("should forget about the filled rect inside the clipped area, not contain a clipping instruction and not add a clearRect", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then restores state and begins a path outside the clipped area and fills it", () => {

				beforeEach(() => {
					infiniteContext.restore();
					infiniteContext.beginPath();
					infiniteContext.rect(7, 0, 1, 1);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should still contain the clipping instruction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears a rect that contains that partial overlap", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(1, 1, 5, 3);
					});

					it("should forget about the filled rect inside the clipped area, not contain a clipping instruction and not add a clearRect", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then clears a rect that contains that partial overlap", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(1, 1, 5, 3);
				});

				it("should forget about the filled rect and not add a clearRect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then once more fills a rect partly overlapping the clipped area", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fillRect(0, 0, 6, 3);
					});

					it("should still contain the clipping instruction", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then makes a new rectangular path partly overlapping the clipped area and fills it", () => {

					beforeEach(() => {
						infiniteContext.beginPath();
						infiniteContext.moveTo(0, 0);
						infiniteContext.lineTo(6, 0);
						infiniteContext.lineTo(6, 3);
						infiniteContext.lineTo(0, 3);
						infiniteContext.lineTo(0, 0);
						contextMock.clear();
						infiniteContext.fill();
					});

					it("should still contain the clipping instruction", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});
	});

    describe("that makes a path, saves state, clips, fills a rect and then strokes the path", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(10, 10, 50, 50);
			infiniteContext.save();
			infiniteContext.clip();
			infiniteContext.fillRect(0, 0, 20, 20);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should set the clipped path before stroking", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe('that clips and then fills a rect outside the clipped area', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(30, 30,20, 20);
			infiniteContext.clip();
			infiniteContext.fillRect(10, 10, 10, 10);
		})

		it("should not have added a fillRect", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe('and then fills a rect inside the clipped area', () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.fillRect(35, 35, 10, 10);

			})

			it("should have added a fillRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe('and then clears the entire area', () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.clearRect(-Infinity, -Infinity, Infinity, Infinity);
				})

				it("should have cleared everything", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			})
		})
	})
})