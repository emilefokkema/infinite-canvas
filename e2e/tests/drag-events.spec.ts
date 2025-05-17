import { JSHandle } from 'puppeteer'
import { describe, it, beforeAll } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { nextEvent } from './utils/next-event'

describe('when we transform the canvas', () => {
    let canvasHandle: JSHandle<HTMLCanvasElement>
    let infCanvas: TestPageInfiniteCanvas

    beforeAll(async () => {
        await page.page.setDragInterception(true)
        canvasHandle = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400
        })
        infCanvas = await page.createInfiniteCanvas(canvasHandle);
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 200, 100);
        }))
        const mouse = page.mouse;
        await mouse.move(100, 100);
        await mouse.down({button: 'left'});
        await Promise.all([
            mouse.move(150, 100),
            nextEvent(infCanvas.eventTarget, 'draw')
        ])
        await mouse.up({button: 'left'})
    })

    describe('and we start to drag', () => {

        beforeAll(async () => {
            await canvasHandle.evaluate(c => c.setAttribute('draggable', 'true'))
        })

        it('should emit a dragstart event', async () => {
            const withDragStart = await infCanvas.eventTarget.emitEvents({dragstart: {}})
            await Promise.all([
                page.mouse.drag({x: 150, y: 100}, {x: 150, y: 150}),
                nextEvent(withDragStart, 'dragstart')
            ])
        })
    })
})