import { describe, it, expect, beforeAll } from 'vitest'
import { RuntimeEventTarget } from '@runtime-event-target/test'
import { EventMap } from 'api'
import { nextEvent } from './utils/next-event'

describe('when the mouse interacts with the canvas', () => {
    let infCanvasEvents: RuntimeEventTarget<EventMap, {
        mousemove: {
            offsetX: number, offsetY: number, movementX: number, movementY: number
        }
    }>

    beforeAll(async () => {
        const infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c))
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 200, 100);
        }))
        infCanvasEvents = await infCanvas.eventTarget.emitEvents({
            mousemove: {offsetX: true, offsetY: true, movementX: true, movementY: true}
        })
    })

    it('should emit a mousemove when rotating with the mouse', async () => {
        await Promise.all([
            nextEvent(infCanvasEvents, 'mousemove'),
            page.mouse.move(100, 100)
        ])
        await page.mouse.down({button: 'middle'});
        const [mouseMove] = await Promise.all([
            nextEvent(infCanvasEvents, 'mousemove'),
            page.mouse.move(150, 100)
        ])
        expect(mouseMove).toEqual({
            offsetX: expect.closeTo(100),
            offsetY: expect.closeTo(150),
            movementX: expect.closeTo(0),
            movementY: expect.closeTo(50)
        })
    })
})