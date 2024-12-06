import { TouchHandle } from 'puppeteer'
import { describe, it, beforeAll } from 'vitest'
import { noConsoleMessage } from './utils/next-event'

describe('without greedy gesture handling and when touchstart is default-prevented', () => {

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
        const events = await infCanvas.eventTarget.emitEvents({
            touchstart: {}
        })
        await events.handleEvents('touchstart', h => h(e => e.preventDefault()))
    })

    it('should not display a console warning', async () => {
        let firstTouch: TouchHandle;
        await Promise.all([
            (async () => {
                firstTouch = await page.touchscreen.touchStart(100, 100);
                
                await firstTouch.move(200, 100);
            })(),
            noConsoleMessage(page.page, m => m.type() === 'warn', 1000)
        ]);
        await firstTouch.end();
    })
})