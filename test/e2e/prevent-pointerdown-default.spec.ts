import {describe, it, beforeAll, afterAll } from '@jest/globals';
import puppeteer from 'puppeteer';
import { compareToSnapshot } from './compare-to-snapshot';
import { TestPage, InfiniteCanvasProxy, getResultAfter, MouseEventShape, TouchCollection } from 'e2e-test-page';

function initializeInfiniteCanvas(page: TestPage, greedyGestureHandling?: boolean): Promise<InfiniteCanvasProxy>{
    return page.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        greedyGestureHandling,
        spaceBelowCanvas: 2000,
        drawing: (ctx: any) => {
            ctx.fillRect(100, 100, 100, 100);
        }
    })
}

function pointerIsInArea(ev: MouseEventShape): boolean{
    return ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
}

describe('when default is prevented for pointerdown', () => {
    let page: TestPage;

    beforeAll(async () => {
        page = await TestPage.create();
    });

    it('should not begin to pan in case of a mousedown', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addPointerEventListener('pointerdown', pointerIsInArea);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(150, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(250, 150), () => drawn.ensureNoNext(300));
        await mouse.up({button: 'left'});
        await mouse.move(50, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(200, 150), () => drawn.getNext());
        await compareToSnapshot(page);
        await mouse.up({button: 'left'});
        await mouse.move(300, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(150, 150), () => drawn.ensureNoNext(300));
        await mouse.up({button: 'left'});
        await mouse.move(150, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(50, 150), () => drawn.getNext());
        await compareToSnapshot(page);
    });

    it('should not begin to pan in case of a touch', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addPointerEventListener('pointerdown', pointerIsInArea);
        const touches: TouchCollection = await page.getTouchCollection();
        let touch = await touches.start(150, 150);
        await getResultAfter(() => touch.move(250, 150), () => drawn.ensureNoNext(300));
        await touch.end();
        touch = await touches.start(50, 150);
        await getResultAfter(() => touch.move(200, 150), () => drawn.getNext());
        await compareToSnapshot(page);
    });

    afterAll(async () => {
        await page.close();
    });
})