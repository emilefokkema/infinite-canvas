import { describe, it, expect, beforeAll } from 'vitest'
import { RuntimeEventTarget } from '@runtime-event-target/test'
import { EventMap } from 'api'
import { nextEvent, nextEventsInSequence, noEvent } from './utils/next-event'

describe('when the mouse interacts with the canvas', () => {
    let infCanvasEvents: RuntimeEventTarget<EventMap, {
        draw: {},
        pointerenter: {offsetX: number, offsetY: number},
        mousedown: {
            offsetX: number
            offsetY: number
            clientX: number
            clientY: number
            ctrlKey: boolean
            button: number
            cancelable: boolean
            nativeCancelable: boolean
            isTrusted: boolean,
            bubbles: boolean
            eventPhase: number
            type: string
        },
        mouseup: {
            offsetX: number
            offsetY: number
            clientX: number
            clientY: number
            ctrlKey: boolean
            button: number
            cancelable: boolean
            type: string
        },
        mousemove: {
            offsetX: number
            offsetY: number
            clientX: number
            clientY: number
            ctrlKey: boolean
            type: string
        }
        pointermove: {
            offsetX: number
            offsetY: number
            clientX: number
            clientY: number
            ctrlKey: boolean
            type: string
        },
        click: {
            offsetX: number
            offsetY: number
            clientX: number
            clientY: number
            ctrlKey: boolean
            button: number
            type: string
        },
        wheel: {
            offsetX: number
            offsetY: number
            clientX: number
            clientY: number
            ctrlKey: boolean
            button: number
            type: string
        },
        transformationstart: {
            transformation: {a: number, b: number, c: number, d: number, e: number, f: number},
            inverseTransformation: {a: number, b: number, c: number, d: number, e: number, f: number},
            type: string
        },
        transformationchange: {
            transformation: {a: number, b: number, c: number, d: number, e: number, f: number},
            inverseTransformation: {a: number, b: number, c: number, d: number, e: number, f: number},
            type: string
        },
        transformationend: {
            transformation: {a: number, b: number, c: number, d: number, e: number, f: number},
            inverseTransformation: {a: number, b: number, c: number, d: number, e: number, f: number},
            type: string
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
            pointerenter: {offsetX: true, offsetY: true},
            mousedown: {
                offsetX: true, offsetY: true, clientX: true, clientY: true,
                ctrlKey: true, button: true, cancelable: true, nativeCancelable: true,
                isTrusted: true, bubbles: true, eventPhase: true, type: true
            },
            mouseup: {
                offsetX: true, offsetY: true, clientX: true, clientY: true,
                ctrlKey: true, button: true, cancelable: true, type: true
            },
            mousemove: {
                offsetX: true, offsetY: true, clientX: true, clientY: true,
                ctrlKey: true, type: true
            },
            pointermove: {
                offsetX: true, offsetY: true, clientX: true, clientY: true,
                ctrlKey: true, type: true
            },
            click: {
                offsetX: true, offsetY: true, clientX: true, clientY: true,
                ctrlKey: true, button: true, type: true
            },
            wheel: {
                offsetX: true, offsetY: true, clientX: true, clientY: true,
                ctrlKey: true, button: true, type: true
            },
            transformationstart: {
                transformation: {a: true, b: true, c: true, d: true, e: true, f: true},
                inverseTransformation: {a: true, b: true, c: true, d: true, e: true, f: true},
                type: true
            },
            transformationchange: {
                transformation: {a: true, b: true, c: true, d: true, e: true, f: true},
                inverseTransformation: {a: true, b: true, c: true, d: true, e: true, f: true},
                type: true
            },
            transformationend: {
                transformation: {a: true, b: true, c: true, d: true, e: true, f: true},
                inverseTransformation: {a: true, b: true, c: true, d: true, e: true, f: true},
                type: true
            }
        });
    })

    it('should emit the right pointerenter and mousedown events', async () => {
        const [pointerEnter] = await Promise.all([
            nextEvent(infCanvasEvents, 'pointerenter'),
            page.mouse.move(100, 100)
        ])
        expect(pointerEnter).toEqual({
            offsetX: expect.closeTo(100),
            offsetY: expect.closeTo(100)
        })
        const [mouseDown] = await Promise.all([
            nextEvent(infCanvasEvents, 'mousedown'),
            page.mouse.down({button: 'left'})
        ])
        expect(mouseDown).toEqual({
            offsetX: expect.closeTo(100),
            offsetY: expect.closeTo(100),
            clientX: expect.closeTo(100),
            clientY: expect.closeTo(100),
            ctrlKey: false,
            button: 0,
            cancelable: true,
            nativeCancelable: true,
            isTrusted: false,
            bubbles: false,
            eventPhase: Event.AT_TARGET,
            type: 'mousedown'
        })
    })

    it('should not emit a mousemove or pointermove when transforming', async () => {
        await Promise.all([
            nextEvent(infCanvasEvents, 'draw'),
            page.mouse.move(200, 200),
            noEvent(infCanvasEvents, 'mousemove', 300),
            noEvent(infCanvasEvents, 'pointermove', 300)
        ])
    })

    it('should emit the right mouseup event', async () => {
        const [mouseUp] = await Promise.all([
            nextEvent(infCanvasEvents, 'mouseup'),
            page.mouse.up({button: 'left'})
        ])
        expect(mouseUp).toEqual({
            offsetX: expect.closeTo(100),
            offsetY: expect.closeTo(100),
            clientX: expect.closeTo(200),
            clientY: expect.closeTo(200),
            ctrlKey: false,
            button: 0,
            cancelable: true,
            type: 'mouseup'
        })
    })

    it('should emit the right mousemove and pointermove events', async () => {
        const [mouseMove, pointerMove] = await Promise.all([
            nextEvent(infCanvasEvents, 'mousemove'),
            nextEvent(infCanvasEvents, 'pointermove'),
            page.mouse.move(100, 100)
        ])
        expect(mouseMove).toEqual({
            offsetX: expect.closeTo(0),
            offsetY: expect.closeTo(0),
            clientX: expect.closeTo(100),
            clientY: expect.closeTo(100),
            ctrlKey: false,
            type: 'mousemove'
        })
        expect(pointerMove).toEqual({
            offsetX: expect.closeTo(0),
            offsetY: expect.closeTo(0),
            clientX: expect.closeTo(100),
            clientY: expect.closeTo(100),
            ctrlKey: false,
            type: 'pointermove'
        })
    })

    it('should emit a mousedown for the right button', async () => {
        const [mouseDown] = await Promise.all([
            nextEvent(infCanvasEvents, 'mousedown'),
            page.mouse.down({button: 'right'})
        ])
        expect(mouseDown).toEqual({
            offsetX: expect.closeTo(0),
            offsetY: expect.closeTo(0),
            clientX: expect.closeTo(100),
            clientY: expect.closeTo(100),
            ctrlKey: false,
            button: 2,
            eventPhase: Event.AT_TARGET,
            type: 'mousedown',
            nativeCancelable: true,
            isTrusted: false,
            bubbles: false,
            cancelable: true
        })
        await page.mouse.up({button: 'right'});
    })

    it('should emit a click event', async () => {
        const [click] = await Promise.all([
            nextEvent(infCanvasEvents, 'click'),
            page.mouse.click(100, 100)
        ])
        expect(click).toEqual({
            offsetX: expect.closeTo(0),
            offsetY: expect.closeTo(0),
            clientX: expect.closeTo(100),
            clientY: expect.closeTo(100),
            button: 0,
            ctrlKey: false,
            type: 'click'
        })
    })

    it('should emit the right transformation events', async () => {
        await page.mouse.down({button: 'left'});
        const [[transformationStart, transformationChange, transformationEnd]] = await Promise.all([
            nextEventsInSequence(infCanvasEvents, 'transformationstart', 'transformationchange', 'transformationend'),
            page.mouse.move(200, 200)
        ])
        expect(transformationStart).toEqual({
            transformation: {
                a: expect.closeTo(1),
                b: expect.closeTo(0),
                c: expect.closeTo(0),
                d: expect.closeTo(1),
                e: expect.closeTo(-200),
                f: expect.closeTo(-200)
            },
            inverseTransformation: {
                a: expect.closeTo(1),
                b: expect.closeTo(0),
                c: expect.closeTo(0),
                d: expect.closeTo(1),
                e: expect.closeTo(200),
                f: expect.closeTo(200)
            },
            type: 'transformationstart'
        })
        expect(transformationChange).toEqual({
            transformation: {
                a: expect.closeTo(1),
                b: expect.closeTo(0),
                c: expect.closeTo(0),
                d: expect.closeTo(1),
                e: expect.closeTo(-200),
                f: expect.closeTo(-200)
            },
            inverseTransformation: {
                a: expect.closeTo(1),
                b: expect.closeTo(0),
                c: expect.closeTo(0),
                d: expect.closeTo(1),
                e: expect.closeTo(200),
                f: expect.closeTo(200)
            },
            type: 'transformationchange'
        })
        expect(transformationEnd).toEqual({
            transformation: {
                a: expect.closeTo(1),
                b: expect.closeTo(0),
                c: expect.closeTo(0),
                d: expect.closeTo(1),
                e: expect.closeTo(-200),
                f: expect.closeTo(-200)
            },
            inverseTransformation: {
                a: expect.closeTo(1),
                b: expect.closeTo(0),
                c: expect.closeTo(0),
                d: expect.closeTo(1),
                e: expect.closeTo(200),
                f: expect.closeTo(200)
            },
            type: 'transformationend'
        })
    })

    it('should emit the right wheel event', async () => {
        const [wheelEvent] = await Promise.all([
            nextEvent(infCanvasEvents, 'wheel'),
            page.mouse.wheel({deltaY: 100})
        ])
        expect(wheelEvent).toEqual({
            offsetX: expect.closeTo(0),
            offsetY: expect.closeTo(0),
            clientX: expect.closeTo(200),
            clientY: expect.closeTo(200),
            button: 0,
            ctrlKey: false,
            type: 'wheel'
        })
    })
})