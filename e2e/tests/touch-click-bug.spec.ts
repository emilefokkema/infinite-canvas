import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { nextEvent, noError } from './utils/next-event';
import { EventTargetHandle } from 'puppeteer-event-target-handle';

describe('when a click happens in a touch way', () => {
    let infCanvasEvents: EventTargetHandle<GlobalEventHandlersEventMap, {
        click: {offsetX: number}
    }>

    beforeAll(async () => {
        const infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(10, 10, 100, 100)
        }))
        infCanvasEvents = await infCanvas.eventTarget.emitEvents({
            click: {offsetX: true}
        })
    })

    it('should send a click event and throw no error', async () => {
        const [{offsetX}] = await Promise.all([
            nextEvent(infCanvasEvents, 'click'),
            noError(page.page, 500),
            page.touchscreen.touchStart(200, 200).then(t => t.end())
        ])
        expect(offsetX).toEqual(200)
    })
})