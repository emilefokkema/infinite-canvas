import { describe, it, beforeAll } from 'vitest'
import { nextConsoleMessage, noConsoleMessage } from './utils/next-event'
import { TouchHandle } from 'puppeteer'

describe('without greedy gesture handling', () => {

    beforeAll(async () => {
        const infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c))
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 50, 50);
        }))
    })

    it('should display a console warning', async () => {
        await Promise.all([
            page.touchscreen.touchStart(100, 100).then(t => t.move(200, 100)),
            nextConsoleMessage(page.page, m => m.type() === 'warn' && m.text() === 'use two fingers to move')
        ])
    })

    it('should not display a console warning if zooming occurs', async () => {
        let firstTouch: TouchHandle, secondTouch: TouchHandle;
        await Promise.all([
            (async () => {
                firstTouch = await page.touchscreen.touchStart(100, 100);
                secondTouch = await page.touchscreen.touchStart(200, 100);
                await secondTouch.move(200, 200);
            })(),
            noConsoleMessage(page.page, m => m.type() === 'warn', 1000)
        ]);
        await secondTouch.end();
        await firstTouch.end();
    })
})