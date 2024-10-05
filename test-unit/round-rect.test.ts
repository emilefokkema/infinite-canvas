import { beforeEach, describe, expect, it} from 'vitest'
import {CanvasContextMock} from "./canvas-context-mock";
import {InfiniteCanvasRenderingContext2D} from "../src/api-surface/infinite-canvas-rendering-context-2d";
import { createInfiniteCanvasTestFixture } from './infinite-canvas-test-fixture';

describe('an infinite canvas context', () => {
	let infiniteContext: InfiniteCanvasRenderingContext2D;
	let contextMock: CanvasContextMock;

    beforeEach(() => {
		({ contextMock, infiniteContext} = createInfiniteCanvasTestFixture());
	});

    describe('that draws a round rect', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.roundRect(10, 10, 40, 40, 5)
			infiniteContext.stroke();
		})

		it("should have given these instructions", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	})

    describe('that draws a round rect with a radius that is zero', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.roundRect(10, 10, 40, 40, [0, 5])
			infiniteContext.stroke();
		})

		it("should have given these instructions", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	})

    describe('that draws a round rect with big radii', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.roundRect(30, 30, 80, 30, [15, 30, 30, 15]);
			infiniteContext.stroke();
		})

		it("should have scaled the radii", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	})

    describe('that draws a round rect with big radii on invisible corners', () => {

		beforeEach(() => {
			infiniteContext.beginPath();
			infiniteContext.roundRect(30, 30, Infinity, 30, [15, 30, 30, 15]);
			infiniteContext.stroke();
		})

		it("should not have scaled the radii", () => {
			expect(contextMock.getLog()).toMatchSnapshot();
		});
	})

    it.each([
		[20, 20],
		[75, 45],
		[100, 100],
		[Infinity, 20],
		[Infinity, -20],
		[-Infinity, 20],
		[-Infinity, -20],
		[20, Infinity],
		[20, -Infinity],
		[-20, Infinity],
		[-20, -Infinity],
		[Infinity, Infinity],
		[Infinity, -Infinity],
		[-Infinity, Infinity],
		[-Infinity, -Infinity]
	])('should have drawn round rect like this', (w: number, h: number) => {
		const radii = [15, {x: 60, y: 30}, 15, {x: 60, y: 30}]

		infiniteContext.beginPath();
		infiniteContext.roundRect(100, 100, w, h, radii)
		infiniteContext.stroke();

		expect(contextMock.getLog()).toMatchSnapshot();
	})


})