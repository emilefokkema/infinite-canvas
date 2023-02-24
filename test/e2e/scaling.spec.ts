import {describe, it, beforeAll, afterAll } from '@jest/globals';
import puppeteer from 'puppeteer';
import { compareToSnapshot } from './compare-to-snapshot';
import { TestPage, Units, InfiniteCanvasProxy, getResultAfter, TouchCollection, Touch } from 'e2e-test-page';

function initializeInfiniteCanvas(page: TestPage,
    canvasWidth: number | 'boundingclientrect',
    canvasHeight: number | 'boundingclientrect',
    greedyGestureHandling?: boolean,
    rotationEnabled?: boolean,
    units?: Units): Promise<InfiniteCanvasProxy>{
    return page.initializeInfiniteCanvas({
        styleWidth: '100%',
        styleHeight: '100%',
        canvasWidth,
        canvasHeight,
        greedyGestureHandling,
        rotationEnabled,
        units,
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

describe('when scaling', () => {
    let page: TestPage;

    beforeAll(async () => {
        page = await TestPage.create();
    });

    afterAll(async () => {
        await page.close();
    });

    it('should rotate correctly after resize', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, 'boundingclientrect', 'boundingclientrect');
        const drawn = await infCanvas.addDrawEventListener();
        await page.resize(400, 600);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await getResultAfter(() => mouse.move(120, 100), () => drawn.getNext());
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    });

    it('should rotate-zoom correctly after resize', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, 'boundingclientrect', 'boundingclientrect');
        const drawn = await infCanvas.addDrawEventListener();
        await page.resize(400, 600);
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await getResultAfter(() => touch2.move(200, 200), () => drawn.getNext());
        await compareToSnapshot(page);
        await touch1.end();
        await touch2.end();
    });

    it('should respond to resize in case of css units', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, 'boundingclientrect', 'boundingclientrect', undefined, undefined, Units.CSS);
        const drawn = await infCanvas.addDrawEventListener();
        await getResultAfter(() => page.resize(400, 600), () => drawn.getNext());
        await compareToSnapshot(page);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await getResultAfter(() => mouse.move(120, 100), () => drawn.getNext());
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    })

    it('should behave in case of a different canvas scale', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, 400, 400);
        const drawn = await infCanvas.addDrawEventListener();
        await compareToSnapshot(page);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await getResultAfter(() => mouse.move(120, 100), () => drawn.getNext());
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    });

    it('should behave in case of a different canvas scale and css units', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, 400, 400, undefined, undefined, Units.CSS);
        const drawn = await infCanvas.addDrawEventListener();
        await compareToSnapshot(page);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await getResultAfter(() => mouse.move(120, 100), () => drawn.getNext());
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    });
});
