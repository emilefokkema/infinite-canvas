import {describe, it, beforeAll, afterAll } from '@jest/globals';
import { InfiniteCanvasProxy, TestPage, TouchCollection } from "e2e-test-page";
import { ensureDoesNotResolve } from "./utils";

describe('without greedy gesture handling', () => {
    let page: TestPage;
    let infCanvas: InfiniteCanvasProxy;
    let touchCollection: TouchCollection;

    beforeAll(async () => {
        page = await TestPage.create();
        touchCollection = await page.getTouchCollection();
        infCanvas = await page.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 50, 50);
            }
        });
    });

    afterAll(async () => {
        await page.close();
    })

    it('should display a console warning', async () => {
        const warningMessagePromise = page.waitForConsoleMessage(m => m.type() === 'warning' && m.text() === 'use two fingers to move')
        const firstTouch = await touchCollection.start(100, 100);
        await firstTouch.move(200, 100);
        await warningMessagePromise;
        await firstTouch.end();
    });

    it('should not display a console warning if zooming occurs', async () => {
        const doesNotResolvePromise = ensureDoesNotResolve(
            () => page.waitForConsoleMessage(m => 
                m.type() === 'warning' &&
                m.text() === 'use two fingers to move'),
            1000,
            'did not expect a warning message');
        const firstTouch = await touchCollection.start(100, 100);
        const secondTouch = await touchCollection.start(200, 100);
        await secondTouch.move(200, 200);
        await doesNotResolvePromise;
        await secondTouch.end();
        await firstTouch.end();
    });
});

describe('without greedy gesture handling and when touchstart is default-prevented', () => {
    let page: TestPage;
    let touchCollection: TouchCollection;

    beforeAll(async () => {
        page = await TestPage.create();
        touchCollection = await page.getTouchCollection();
        const infCanvas = await page.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 50, 50);
            }
        });
        await infCanvas.addTouchEventListener('touchstart', () => true);
    });

    afterAll(async () => {
        await page.close();
    })

    it('should not display a console warning', async () => {
        const doesNotResolvePromise = ensureDoesNotResolve(
            () => page.waitForConsoleMessage(m => 
                m.type() === 'warning' &&
                m.text() === 'use two fingers to move'),
            1000,
            'did not expect a warning message');
        const firstTouch = await touchCollection.start(100, 100);
        await firstTouch.move(200, 100);
        await doesNotResolvePromise;
        await firstTouch.end();
    });
})