import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { TouchHandle } from 'puppeteer';
import { EventMap } from 'api';
import { nextEvent } from './utils/next-event';
import { EventTargetHandle } from 'puppeteer-event-target-handle';

describe('when a pointer starts and default is not prevented', () => {
    let firstTouchInitialY: number;
    let infCanvasEvents: EventTargetHandle<EventMap, {
        draw: {},
        touchstart: {},
        pointerdown: {
            pointerId: number
        },
        pointermove: {
            pointerId: number
            offsetY: number
        }
    }>;
    let firstTouch: TouchHandle;

    beforeAll(async () => {
        firstTouchInitialY = 150;
        const infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c, { greedyGestureHandling: true}));
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 100, 100);
        }))
        infCanvasEvents = await infCanvas.eventTarget.emitEvents({
            touchstart: {},
            pointerdown: {
                pointerId: true
            },
            pointermove: {
                pointerId: true,
                offsetY: true
            }
        })
        await infCanvasEvents.handleEvents('touchstart', h => h(e => {
            if(e.targetTouches.length > 1){
                e.preventDefault();
            }
        }))
        await Promise.all([
            page.touchscreen.touchStart(150, firstTouchInitialY).then(t => firstTouch = t),
            nextEvent(infCanvasEvents, 'pointerdown')
        ])
    })

    describe('and then a second pointer starts and default is prevented', () => {
        let secondTouch: TouchHandle;
        let secondPointerId: number;
        let secondTouchInitialY: number;

        beforeAll(async () => {
            secondTouchInitialY = 150;
            ([{pointerId: secondPointerId}, secondTouch] = await Promise.all([
                nextEvent(infCanvasEvents, 'pointerdown'),
                page.touchscreen.touchStart(150, secondTouchInitialY)
            ]))
        })

        describe('and then the first touch moves, panning', () => {
            let pointerMoveEvent: {
                pointerId: number,
                offsetY: number
            };
            let deltaY: number;

            beforeAll(async () => {
                deltaY = 100;
                ([pointerMoveEvent] = await Promise.all([
                    nextEvent(infCanvasEvents, 'pointermove'),
                    nextEvent(infCanvasEvents, 'draw'),
                    firstTouch.move(150, firstTouchInitialY - deltaY)
                ]));
            })

            it('should emit a pointermove for the second touch', async () => {
                expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'implicit-pointer-move-1'})
                expect(pointerMoveEvent.pointerId).toBe(secondPointerId);
                expect(pointerMoveEvent.offsetY).toBeCloseTo(secondTouchInitialY + deltaY)
            });
        })

        afterAll(async () => {
            await secondTouch.end();
        });
    })
})