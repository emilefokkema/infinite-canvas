import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas';
import { TouchHandle } from 'puppeteer';
import { nextEvent } from './utils/next-event';

describe('when using a filter with blur and drop-shadow', () => {
    let infCanvas: TestPageInfiniteCanvas;

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
            ctx.save();
            ctx.filter = 'blur(2px)';
            ctx.fillRect(40, 40, 40, 40)
            ctx.translate(50, 100)
            ctx.scale(5, 5)
            ctx.fillRect(0, 0, 20, 20);
            ctx.restore();
            ctx.fillRect(100, 40, 40, 40)
            ctx.filter = 'drop-shadow(20px 20px 5px #f00)';
            ctx.fillRect(160, 40, 40, 40)
        }))
    })

    it('should look like this', async () => {
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
    })

    it('should look like this when transformed', async () => {
        const firstTouch: TouchHandle = await page.touchscreen.touchStart(10, 10);
        const secondTouch: TouchHandle = await page.touchscreen.touchStart(50, 50);
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            secondTouch.move(100, 100)
        ])
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            firstTouch.move(10, 50)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await firstTouch.end();
        await secondTouch.end();
    })
})