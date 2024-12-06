import { describe, it, beforeAll, afterAll } from 'vitest'
import { noConsoleMessage } from './utils/next-event';

describe('without greedy gesture handling and when wheel is default-prevented', () => {

    beforeAll(async () => {
        const infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 50, 50);
        }))
        const events = await infCanvas.eventTarget.emitEvents({
            wheel: {}
        })
        await events.handleEvents('wheel', h => h(e => {
            e.preventDefault();
        }))
    })

    it('should not display a console warning', async () => {
        await page.mouse.move(100, 100);
        await Promise.all([
            noConsoleMessage(page.page, m => m.type() === 'warn', 1000),
            page.mouse.wheel({deltaY: 50})
        ])
    })
})