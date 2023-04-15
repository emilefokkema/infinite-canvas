import {expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import puppeteer from 'puppeteer';
import { TestPage, InfiniteCanvasProxy, getResultAfter, EventListenerProxy, MouseEventShape, WheelEventShape } from 'e2e-test-page';

declare const __DELTAY_DISTORTION__: number;

function initializeInfiniteCanvas(page: TestPage): Promise<InfiniteCanvasProxy>{
    return page.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        spaceBelowCanvas: 2000,
        drawing: (ctx: any) => {
            ctx.beginPath();
            ctx.moveToInfinityInDirection(-1, 0);
            ctx.lineTo(100, 100);
            ctx.lineToInfinityInDirection(1, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveToInfinityInDirection(0, -1);
            ctx.lineTo(100, 100);
            ctx.lineToInfinityInDirection(0, 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(200, 100, 25, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

describe('after transforming', () => {
    let page: TestPage;
    let mouse: puppeteer.Mouse;
    let mouseMoved: EventListenerProxy<MouseEventShape>;
    let wheeled: EventListenerProxy<WheelEventShape>

    beforeAll(async () => {
        page = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener(300);
        mouseMoved = await infCanvas.addMouseEventListener('mousemove');
        wheeled = await infCanvas.addWheelEventListener();
        mouse = page.getMouse();
        const keyboard: puppeteer.Keyboard = page.getKeyboard();
        await mouse.move(100, 100);
        await keyboard.down('ControlLeft');
        await getResultAfter(() => mouse.wheel({deltaX: 0, deltaY: -300 / __DELTAY_DISTORTION__}), () => drawn.getNext());
        await keyboard.up('ControlLeft');
    });

    afterAll(async () => {
        await page.close();
    });

    it('should emit a mousemove event that is properly transformed', async () => {
        await mouse.move(120, 120);
        const [{
            offsetX,
            offsetY,
            movementX,
            movementY }] = await getResultAfter(() => mouse.move(130, 130), () => mouseMoved.getNext());
        expect(offsetX).toBeCloseTo(115);
        expect(offsetY).toBeCloseTo(115);
        expect(movementX).toBeCloseTo(5);
        expect(movementY).toBeCloseTo(5);
    });

    it('should emit a wheel event that is propertly transformed', async () => {
        const [{
            offsetX,
            offsetY,
            deltaX,
            deltaY }] = await getResultAfter(() => mouse.wheel({deltaY: 100 / __DELTAY_DISTORTION__}), () => wheeled.getNext());
        expect(offsetX).toBeCloseTo(115);
        expect(offsetY).toBeCloseTo(115);
        expect(deltaX).toBeCloseTo(0);
        expect(deltaY).toBeCloseTo(50);
    });
});