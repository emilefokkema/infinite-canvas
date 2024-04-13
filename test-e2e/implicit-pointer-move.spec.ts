import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import { getPage, getScreenshot, getTouchCollection, getResultAfter, type InPageEventListener, type Touch, type TouchCollection, type EventListenerAdder } from './utils'
import '../test-utils/expect-extensions'
import { InfiniteCanvasTouchEvent, DrawEvent } from 'infinite-canvas'

describe('when a pointer starts and default is not prevented', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let firstTouchInitialY: number;
    let drawn: InPageEventListener<DrawEvent>
    let pointerDown: InPageEventListener<PointerEvent>
    let pointerMove: InPageEventListener<PointerEvent>
    let touchCollection: TouchCollection;
    let firstTouch: Touch;

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage} = await getPage());
        firstTouchInitialY = 150;
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            greedyGestureHandling: true,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 100, 100);
            }
        }))
        const touchStart: InPageEventListener<InfiniteCanvasTouchEvent> = await addEventListenerInPage(infCanvas, 'touchstart');
        await touchStart.modify(t => t.setHandler((e) => {
            if(e.targetTouches.length > 1){
                e.preventDefault();
            }
        }))
        drawn = await addEventListenerInPage(infCanvas, 'draw');
        pointerDown = await addEventListenerInPage(infCanvas, 'pointerdown');
        pointerMove = await addEventListenerInPage(infCanvas, 'pointermove');
        touchCollection = await getTouchCollection(page);
        await getResultAfter(
            async () => {
                firstTouch = await touchCollection.start(150, firstTouchInitialY)
            },
            [() => pointerDown.getNext()])
    })

    describe('and then a second pointer starts and default is prevented', () => {
        let secondTouch: Touch;
        let secondPointerId: number;
        let secondTouchInitialY: number;

        beforeAll(async () => {
            secondTouchInitialY = 150;
            ([{pointerId: secondPointerId}] = await getResultAfter(async () => {
                secondTouch = await touchCollection.start(150, secondTouchInitialY);
            }, [() => pointerDown.getNext()]));
        });

        afterAll(async () => {
            await secondTouch.end();
        });

        describe('and then the first touch moves, panning', () => {
            let pointerMoveEvent: PointerEvent;
            let deltaY: number;

            beforeAll(async () => {
                deltaY = 100;

                ([pointerMoveEvent] = await getResultAfter(() => firstTouch.move(150, firstTouchInitialY - deltaY),
                    [() => pointerMove.getNext(),
                    () => drawn.getNext()] as const));
            });

            it('should emit a pointermove for the second touch', async () => {
                expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'implicit-pointer-move-1'})
                expect(pointerMoveEvent.pointerId).toBe(secondPointerId);
                expect(pointerMoveEvent.offsetY).toBeCloseTo(secondTouchInitialY + deltaY)
            });
        })
    })

    afterAll(async () => {
        await cleanup();
    })
})