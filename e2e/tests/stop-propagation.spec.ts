import { describe, it, beforeAll } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { nextEvent } from './utils/next-event'

describe('when propagation of a mousedown event is stopped on capture on the infinite canvas', () => {
    let infCanvas: TestPageInfiniteCanvas

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 200, 100);
        }))
        const events = await infCanvas.eventTarget.emitEvents({
            mousedown: {}
        })
        await events.handleEvents('mousedown', h => h(e => e.stopPropagation()))
    })

    it('the canvas should still pan because default was not prevented', async () => {
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.move(150, 150)
        ])
    });
})