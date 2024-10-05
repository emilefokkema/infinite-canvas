import { beforeEach, describe, expect, it} from 'vitest'
import {ViewBox} from "../src/interfaces/viewbox";
import {CanvasContextMock} from "./canvas-context-mock";
import {Transformation} from "../src/transformation";
import {InfiniteCanvasRenderingContext2D} from "../src/api-surface/infinite-canvas-rendering-context-2d";
import { createInfiniteCanvasTestFixture } from './infinite-canvas-test-fixture';

describe('an infinite canvas context', () => {
	let infiniteContext: InfiniteCanvasRenderingContext2D;
	let contextMock: CanvasContextMock;
	let viewbox: ViewBox;

    beforeEach(() => {
		({contextMock, viewbox, infiniteContext} = createInfiniteCanvasTestFixture());
	});

    describe("that translates and draws this shape using a line dash", () => {

		beforeEach(() => {
			infiniteContext.translate(20, 20);
			infiniteContext.setLineDash([2, 2]);
			infiniteContext.beginPath();
			infiniteContext.moveTo(250, 50);
			infiniteContext.lineToInfinityInDirection(1, 0);
			infiniteContext.lineTo(100, 100);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should make sure the length of the drawn path is a multiple of the line dash period", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that draws a line", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(10, 10);
			infiniteContext.lineTo(10, 20);
		});

		describe("and then draws a line to infinity in the opposite direction and fills the path", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(0, -1);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should not have drawn more lines than necessary", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line to infinity in the same direction and fills the path", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(0, 1);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should not have drawn more lines than necessary", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line to infinity in a different direction and fills the path", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(1, 0);
				contextMock.clear();
				infiniteContext.fill();
			});

			it("should have filled the right shape", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that translates", () => {

		beforeEach(() => {
			infiniteContext.translate(30, 60);
		});

		describe("and then rotates", () => {

			beforeEach(() => {
				infiniteContext.transform(0, 1, -1, 0, 0, 0);
			});

			describe("and then draws a line to inifinity", () => {

				beforeEach(() => {
					infiniteContext.beginPath();
					infiniteContext.moveTo(30, 30);
					infiniteContext.lineToInfinityInDirection(1, 0);
					contextMock.clear();
					infiniteContext.stroke();
				});
		
				it("should draw a line to the right border of the viewbox", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then draws a line to inifinity", () => {

			beforeEach(() => {
				infiniteContext.beginPath();
				infiniteContext.moveTo(30, 30);
				infiniteContext.lineToInfinityInDirection(1, 0);
				contextMock.clear();
				infiniteContext.stroke();
			});
	
			it("should draw a line to the right border of the viewbox", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("draws a line to infinity", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveTo(30, 30);
			infiniteContext.lineToInfinityInDirection(1, 0);
		});

		describe("and then strokes the ray and clears an infinite rectangle partially overlapping the ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(40, 20, Infinity, 20);
			});

			it("should clear a rectangle extending to the edge of the viewbox", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});

			describe("and then the viewbox transformation translates", () => {

				beforeEach(() => {
					contextMock.clear();
					viewbox.transformation = new Transformation(1, 0, 0, 1, -10, 0);
				});

				it("should clear a rectangle extending to the edge of the viewbox", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then the viewbox transformation scales", () => {

				beforeEach(() => {
					contextMock.clear();
					viewbox.transformation = new Transformation(2, 0, 0, 2, 0, 0);
				});

				it("should clear a rectangle extending to the edge of the viewbox", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then strokes the ray and clears a rect overlapping the entire ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(20, 20, Infinity, 20);
			});

			it("should forget about the drawn path and not add a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then strokes the ray and clears a rect overlapping the ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(0, 0, 60, 60);
			});

			it("should have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then strokes the ray and clears a rect overlapping the ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(300, 0, 60, 60);
			});

			it("should have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then strokes the ray and clears a rect not overlapping the ray", () => {

			beforeEach(() => {
				infiniteContext.stroke();
				contextMock.clear();
				infiniteContext.clearRect(0, 40, 60, 60);
			});

			it("should not have added a clearRect", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line to the opposite point at infinity and strokes", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(-1, 0);
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should still have drawn only a ray", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line to another point at infinity", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(0, 1);
			});

			describe("and then fills the path and clears a rect overlapping the drawn area", () => {

				beforeEach(() => {
					infiniteContext.fill();
					contextMock.clear();
					infiniteContext.clearRect(40, 40, 60, 60);
				});

				it("should add a clearRect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then fills the path and clears a rect not overlapping the drawn area", () => {

				beforeEach(() => {
					infiniteContext.fill();
					contextMock.clear();
					infiniteContext.clearRect(-40, -40, 60, 60);
				});

				it("should not add a clearRect", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then draws a line back and fills", () => {

				beforeEach(() => {
					infiniteContext.lineTo(60, 60);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should draw a path that ends coming from the correct direction", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then fills", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.fill();
				});
	
				it("should create a path that covers the correct section of the view box", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then draws a line to a third point at infinity (not in the same half plane) and then fills", () => {

				beforeEach(() => {
					infiniteContext.lineToInfinityInDirection(-1, -1);
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should draw the correct path", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});

				describe("and then clears the entire plane", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(-Infinity, -Infinity, Infinity, Infinity);
					});

					it("should clear everything", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears the entire plane differently", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(Infinity, Infinity, -Infinity, -Infinity);
					});

					it("should clear everything", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with infinite width, infinite height and no left", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(-Infinity, 50, Infinity, Infinity);
					});

					it("should clear a rect extending to the left and right and bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with negative infinite width, infinite height and no right", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(Infinity, 50, -Infinity, Infinity);
					});

					it("should clear a rect extending to the left and right and bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with infinite width, infinite height and no top", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, -Infinity, Infinity, Infinity);
					});

					it("should clear a rect extending to the top and bottom and right of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with infinite width, negative infinite height and no bottom", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, Infinity, Infinity, -Infinity);
					});

					it("should clear a rect extending to the top and bottom and right of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite width, infinite height and no top", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, -Infinity, 50, Infinity);
					});

					it("should clear a rect extending to the top and bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with positive infinite width and positive infinite height", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, Infinity, Infinity);
					});

					it("should clear a rect extending to the right and to the bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite width but located at positive infinity vertically", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, Infinity, 50, 50);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with infinite height but located infinitely far down", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, Infinity, 50, Infinity);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite width but located at negative infinity vertically", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, -Infinity, 50, 50);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite height but located at positive infinity horizontally", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(Infinity, 50, 50, 50);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with finite height but located at negative infinity horizontally", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(-Infinity, 50, 50, 50);
					});

					it("should do nothing", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with positive infinite width", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, Infinity, 50);
					});

					it("should clear a rectangle extending to the right side of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with negative infinite width", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, -Infinity, 50);
					});

					it("should clear a rectangle extending to the left side of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with positive infinite height", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, 50, Infinity);
					});

					it("should clear a rectangle extending to the bottom of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then clears a rect with negative infinite height", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.clearRect(50, 50, 50, -Infinity);
					});

					it("should clear a rectangle extending to the top of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});
		});

		describe("and then strokes the path", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should draw a line to the right border of the viewbox", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});

		describe("and then draws a line back from infinity to a point and then strokes", () => {

			beforeEach(() => {
				infiniteContext.lineTo(30, 60);
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should draw the right line back to the point", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that transforms, begins a path, draws line from a point to infinity, rotates, draws a line to infinity and strokes", () => {

		beforeEach(() => {
			infiniteContext.translate(50, 50);
			infiniteContext.transform(1, 1, 0, 1, 0, 0);
			infiniteContext.beginPath();
			infiniteContext.moveTo(0, 0);
			infiniteContext.lineToInfinityInDirection(1, 1);
			infiniteContext.rotate(Math.PI/8);
			infiniteContext.lineToInfinityInDirection(1, 1);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that translates, begins a path, moves to infinity, and then lines to a point", () => {

		beforeEach(() => {
			infiniteContext.translate(0, 100);
			infiniteContext.beginPath();
			infiniteContext.moveToInfinityInDirection(1, 0);
			infiniteContext.lineTo(100, 100);
		});

		describe("and then lines to a different point", () => {

			beforeEach(() => {
				infiniteContext.lineTo(100, 200);
			});

			describe("and then strokes", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.stroke();
				});
	
				it("should move to and line to the correct points", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then strokes", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should move to and line to the correct points", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that begins a path and moves to infinity", () => {

		beforeEach(() =>{
			infiniteContext.beginPath();
			infiniteContext.moveToInfinityInDirection(1, 0);
		});

		describe("and then adds a line to another point at infinity", () => {

			beforeEach(() => {
				infiniteContext.lineToInfinityInDirection(0, 1);
			});

			describe("and then adds a line to a third point at infinity that is not in the same half plane", () => {

				beforeEach(() => {
					infiniteContext.lineToInfinityInDirection(-1, -1);
				});

				describe("and then fills", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fill();
					});

					it("should draw a path around the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then adds a line to a finite point", () => {

				beforeEach(() => {
					infiniteContext.lineTo(100, 100);
				});

				describe("and then fills", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.fill();
					});

					it("should have drawn the right path", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then fills", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.fill();
				});

				it("should do nothing", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});

		describe("and then adds a line to a finite point", () => {

			beforeEach(() => {
				infiniteContext.lineTo(50, 100);
			});

			describe("and then strokes the line using a line dash", () => {

				beforeEach(() => {
					infiniteContext.setLineDash([3, 2]);
					contextMock.clear();
					infiniteContext.stroke();
				});

				it("should draw a line whose length is a multiple of the line dash period", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});

			describe("and then adds a line to the opposite point at infinity", () => {

				beforeEach(() => {
					infiniteContext.lineToInfinityInDirection(-1, 0);
				});

				describe("and then strokes", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.stroke();
					});

					it("should have added a moveTo", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then adds a line to a different point at infinity", () => {

				beforeEach(() => {
					infiniteContext.lineToInfinityInDirection(0, 1);
				});

				describe("and then strokes the path using a line dash", () => {

					beforeEach(() => {
						infiniteContext.setLineDash([3, 2]);
						contextMock.clear();
						infiniteContext.stroke();
					});

					it("should draw a path whose length is a multiple of the line dash period", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});

				describe("and then adds a line to yet a different point at infinity", () => {

					beforeEach(() => {
						infiniteContext.lineToInfinityInDirection(-1, -1);
					});

					describe("and then strokes", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.stroke();
						});
	
						it("should draw the correct path", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				describe("and then adds a line to a finite point", () => {

					beforeEach(() => {
						infiniteContext.lineTo(50, 150);
					});

					describe("and then strokes", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.stroke();
						});
	
						it("should have drawn the correct path", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				describe("and then strokes", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.stroke();
					});

					it("should begin a path with a move to and then draw a line around a corner of the viewbox", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then adds a line to a different finite point", () => {

				beforeEach(() => {
					infiniteContext.lineTo(100, 200);
				});

				describe("and then adds a line back to the first point at infinity", () => {

					beforeEach(() => {
						infiniteContext.lineToInfinityInDirection(1, 0);
					});

					describe("and then strokes", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.stroke();
						});

						it("should add a moveTo", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				describe("and then adds a line to the point at infinity opposite the starting point", () => {

					beforeEach(() => {
						infiniteContext.lineToInfinityInDirection(-1, 0);
					});

					describe("and then adds a new subpath that is closable and closes it", () => {

						beforeEach(() => {
							infiniteContext.moveTo(150, 0);
							infiniteContext.lineTo(100, 0);
							infiniteContext.lineTo(100, 50);
							infiniteContext.closePath();
						});

						describe("and then strokes", () => {

							beforeEach(() => {
								contextMock.clear();
								infiniteContext.stroke();
							});

							it("should close the second subpath but not the first", () => {
								expect(contextMock.getLog()).toMatchSnapshot();
							});
						});
					});

					describe("and then closes the path and strokes", () => {

						beforeEach(() => {
							infiniteContext.closePath();
							contextMock.clear();
							infiniteContext.stroke();
						});

						it("should have stroked but not closed the path", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
          
          describe("and then transforms and adds a line back to the original point at infinity", () => {
            
            beforeEach(() => {
              infiniteContext.transform(0, 1, 1, 0, 0, 0);
              infiniteContext.lineToInfinityInDirection(0, 1);
            });
            
            describe("and then fills", () => {
              
              beforeEach(() => {
                contextMock.clear();
                infiniteContext.fill();
              });
              
              it("should do nothing", () => {
                expect(contextMock.getLog()).toMatchSnapshot();
              })
            })
          })

					describe("and then adds a line back to the original point at infinity", () => {

						beforeEach(() => {
							infiniteContext.lineToInfinityInDirection(1, 0);
						});

						describe("and then fills", () => {

							beforeEach(() => {
								contextMock.clear();
								infiniteContext.fill();
							});

							it("should do nothing", () => {
								expect(contextMock.getLog()).toMatchSnapshot();
							});
						});
					});

					describe("and then fills", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.fill();
						});

						it("should do nothing", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				describe("and then strokes", () => {

					beforeEach(() => {
						contextMock.clear();
						infiniteContext.stroke();
					});

					describe("and then adds a line to another finite point", () => {

						beforeEach(() => {
							infiniteContext.lineTo(100, 300);
						});

						describe("and then strokes", () => {

							beforeEach(() => {
								contextMock.clear();
								infiniteContext.stroke();
							});

							it("should have created two paths", () => {
								expect(contextMock.getLog()).toMatchSnapshot();
							});
						});
					});

					it("should begin with a moveTo and a lineTo", () => {
						expect(contextMock.getLog()).toMatchSnapshot();
					});
				});
			});

			describe("and then strokes", () => {

				beforeEach(() => {
					contextMock.clear();
					infiniteContext.stroke();
				});

				describe("and then lines to a different finite point", () => {

					beforeEach(() => {
						infiniteContext.lineTo(100, 200);
					});

					describe("and then strokes", () => {

						beforeEach(() => {
							contextMock.clear();
							infiniteContext.stroke();
						});

						it("should have created two paths", () => {
							expect(contextMock.getLog()).toMatchSnapshot();
						});
					});
				});

				it("should have added a moveTo", () => {
					expect(contextMock.getLog()).toMatchSnapshot();
				});
			});
		});
	});

    describe("that creates a rect that extends to infinity and strokes it", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.rect(50, 50, Infinity, 50);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should have taken the current line width into account", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then changes the line width and strokes the rectangle again", () => {

			beforeEach(() => {
				infiniteContext.lineWidth = 4;
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should have taken a different line width into account this time", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that strokes a rect that extends to infinity", () => {

		beforeEach(() => {
			contextMock.clear();
			infiniteContext.strokeRect(50, 50, Infinity, 50);
		});

		it("should have taken the current line width into account", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});

		describe("and then changes the line width and strokes another rect that extends to infinity", () => {

			beforeEach(() => {
				infiniteContext.lineWidth = 4;
				contextMock.clear();
				infiniteContext.strokeRect(50, 50, Infinity, 50);
			});

			it("should have taken a different line width into account for the second rectangle", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe("that strokes a path using a line dash", () => {

		beforeEach(() => {
			infiniteContext.setLineDash([3, 2]);
			infiniteContext.beginPath();
			infiniteContext.moveTo(100, -50);
			infiniteContext.lineToInfinityInDirection(0, -1);
			infiniteContext.lineTo(50, 100);
			contextMock.clear();
			infiniteContext.stroke();
		});

		it("should draw a path whose length is a multiple of the line dash period", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	});

    describe("that makes a path extending to infinity and fills it", () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveToInfinityInDirection(0, -1);
			infiniteContext.lineTo(100, 100);
			infiniteContext.lineToInfinityInDirection(-1, 0);
			infiniteContext.fill();
		});

		describe("and then strokes it", () => {

			beforeEach(() => {
				contextMock.clear();
				infiniteContext.stroke();
			});

			it("should take the line width into account for the stroked path", () => {
				expect(contextMock.getLog()).toMatchSnapshot();
			});
		});
	});

    describe('that draws a path at infinity with four points and fills it', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.moveToInfinityInDirection(0, -1)
			infiniteContext.lineToInfinityInDirection(1, 1)
			infiniteContext.lineToInfinityInDirection(-1, 1)
			infiniteContext.lineToInfinityInDirection(-1, -1)
			infiniteContext.fill()
		})

		it("should have filled the entire plane", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	})
})