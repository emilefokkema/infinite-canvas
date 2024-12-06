import { describe, it, expect, beforeAll } from 'vitest'
import { TouchHandle } from 'puppeteer'
import { RuntimeEventTarget } from '@runtime-event-target/test'
import { EventMap } from 'api'
import { nextEvent, noEvent } from './utils/next-event'
import { SerializedInfiniteCanvasTouchEvent, touchEventMap } from './utils/touch-event-types'

describe('when the canvas is touched', () => {
    let infCanvasEvents: RuntimeEventTarget<EventMap, {
        draw: {},
        touchstart: SerializedInfiniteCanvasTouchEvent
        touchmove: SerializedInfiniteCanvasTouchEvent
        touchend: SerializedInfiniteCanvasTouchEvent
    }>
    let firstTouch: TouchHandle
    let secondTouch: TouchHandle

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
        })
    })

    it('should dispatch a touchstart event', async () => {
        const [touchStart, touch] = await Promise.all([
            nextEvent(infCanvasEvents, 'touchstart'),
            page.touchscreen.touchStart(100, 100)
        ])
        firstTouch = touch;
        expect(touchStart).toEqual({
            touches: [
                {
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 1,
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            targetTouches: [
                {
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 1,
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            changedTouches: [
                {
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 1,
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ]
        })
    })

    it('should dispatch another touchstart event', async () => {
        const [touchStart, touch] = await Promise.all([
            nextEvent(infCanvasEvents, 'touchstart'),
            page.touchscreen.touchStart(200, 100)
        ])
        secondTouch = touch;
        expect(touchStart).toEqual({
            touches: [
                {
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 1,
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                },
                {
                    infiniteCanvasX: expect.closeTo(200),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 2,
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            targetTouches: [
                {
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 1,
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                },
                {
                    infiniteCanvasX: expect.closeTo(200),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 2,
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            changedTouches: [
                {
                    infiniteCanvasX: expect.closeTo(200),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 2,
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ]
        })
    })

    it('should not dispatch a touchmove event', async () => {
        await Promise.all([
            nextEvent(infCanvasEvents, 'draw'),
            noEvent(infCanvasEvents, 'touchmove', 300),
            firstTouch.move(100, 200)
        ])
    })

    it('should dispatch a touchend event', async () => {
        const [touchEnd] = await Promise.all([
            nextEvent(infCanvasEvents, 'touchend'),
            firstTouch.end()
        ])
        expect(touchEnd).toEqual({
            touches: [
                {
                    infiniteCanvasX: expect.closeTo(200),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 2,
                    radiusX: expect.closeTo(.5 / Math.sqrt(2)),
                    radiusY: expect.closeTo(.5 / Math.sqrt(2)),
                    rotationAngle: expect.closeTo(Math.PI / 4)
                }
            ],
            targetTouches: [
                {
                    infiniteCanvasX: expect.closeTo(200),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 2,
                    radiusX: expect.closeTo(.5 / Math.sqrt(2)),
                    radiusY: expect.closeTo(.5 / Math.sqrt(2)),
                    rotationAngle: expect.closeTo(Math.PI / 4)
                }
            ],
            changedTouches: [
                {
                    infiniteCanvasX: expect.closeTo(100),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 1,
                    radiusX: expect.closeTo(.5 / Math.sqrt(2)),
                    radiusY: expect.closeTo(.5 / Math.sqrt(2)),
                    rotationAngle: expect.closeTo(Math.PI / 4)
                },
            ]
        })
    })

    it('should dispatch another touchend event', async () => {
        const [touchEnd] = await Promise.all([
            nextEvent(infCanvasEvents, 'touchend'),
            secondTouch.end()
        ])
        expect(touchEnd).toEqual({
            touches: [],
            targetTouches: [],
            changedTouches: [
                {
                    infiniteCanvasX: expect.closeTo(200),
                    infiniteCanvasY: expect.closeTo(100),
                    identifier: 2,
                    radiusX: expect.closeTo(.5 / Math.sqrt(2)),
                    radiusY: expect.closeTo(.5 / Math.sqrt(2)),
                    rotationAngle: expect.closeTo(Math.PI / 4)
                }
            ]
        })
    })
})