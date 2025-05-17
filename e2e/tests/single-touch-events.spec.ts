import { describe, beforeAll, it, expect } from 'vitest'
import { TouchHandle } from 'puppeteer'
import { EventMap } from 'api'
import { SerializedInfiniteCanvasTouchEvent, touchEventMap } from './utils/touch-event-types'
import { nextEvent } from './utils/next-event'
import { EventTargetHandle } from 'puppeteer-event-target-handle'

describe('when the canvas is touched', () => {
    let infCanvasEvents: EventTargetHandle<EventMap, {
        touchstart: SerializedInfiniteCanvasTouchEvent
        touchmove: SerializedInfiniteCanvasTouchEvent
        touchend: SerializedInfiniteCanvasTouchEvent
    }>
    let firstTouch: TouchHandle;

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
            touchstart: touchEventMap,
            touchmove: touchEventMap,
            touchend: touchEventMap
        });
    })

    it('should dispatch a touchstart event', async () => {
        const [touchStart, touch] = await Promise.all([
            nextEvent(infCanvasEvents, 'touchstart'),
            page.touchscreen.touchStart(120, 100)
        ])
        firstTouch = touch;
        expect(touchStart).toEqual({
            touches: [
                {
                    identifier: 1,
                    infiniteCanvasX: expect.closeTo(120),
                    infiniteCanvasY: expect.closeTo(100),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            targetTouches: [
                {
                    identifier: 1,
                    infiniteCanvasX: expect.closeTo(120),
                    infiniteCanvasY: expect.closeTo(100),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            changedTouches: [
                {
                    identifier: 1,
                    infiniteCanvasX: expect.closeTo(120),
                    infiniteCanvasY: expect.closeTo(100),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ]
        })
    })

    it('should dispatch a touchmove event', async () => {
        const [touchMove] = await Promise.all([
            nextEvent(infCanvasEvents, 'touchmove'),
            firstTouch.move(100, 100)
        ])
        expect(touchMove).toEqual({
            touches: [
                {
                    identifier: 1,
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            targetTouches: [
                {
                    identifier: 1,
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            changedTouches: [
                {
                    identifier: 1,
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ]
        })
    })

    it('should dispatch a touchend event', async () => {
        const [touchEnd] = await Promise.all([
            nextEvent(infCanvasEvents, 'touchend'),
            firstTouch.end()
        ])
        expect(touchEnd).toEqual({
            touches: [],
            targetTouches: [],
            changedTouches: [
                {
                    identifier: 1,
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ]
        })
    })
})