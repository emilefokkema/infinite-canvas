import { describe, it, expect, afterEach } from 'vitest'
import { fromEvent, debounceTime, firstValueFrom } from 'rxjs'
import { nextEvent, noEvent } from './utils/next-event'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { touchEventMap } from './utils/touch-event-types'

describe('when default is prevented', () => {
    let infCanvas: TestPageInfiniteCanvas

    afterEach(async () => {
        await page.reload()
    })

    it('should not begin to pan when mousedown default is prevented', async () => {
        await setupInfiniteCanvas();
        const events = await infCanvas.eventTarget.emitEvents({
            mousedown: {}
        })
        await events.handleEvents('mousedown', h => h(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            noEvent(events, 'draw', 300),
            page.mouse.move(250, 150)
        ])
        await page.mouse.up({button: 'left'});
        await page.mouse.move(50, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            nextEvent(events, 'draw'),
            page.mouse.move(200, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.up({button: 'left'});
        await page.mouse.move(300, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            noEvent(events, 'draw', 300),
            page.mouse.move(150, 150)
        ])
        await page.mouse.up({button: 'left'});
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            nextEvent(events, 'draw'),
            page.mouse.move(50, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
    })

    it('should not zoom when wheel default is prevented', async () => {
        await setupInfiniteCanvas();
        const events = await infCanvas.eventTarget.emitEvents({
            wheel: {}
        })
        await events.handleEvents('wheel', h => h(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        const windowEvents = await page.createEventTargetHandle<GlobalEventHandlersEventMap>(
            await page.page.evaluateHandle(() => window)
        ).then(e => e.emitEvents({scroll: {}}))
        const scrolled = fromEvent(windowEvents, 'scroll').pipe(debounceTime(300))
        await page.mouse.move(150, 150);
        const deltaY: number = 80;
        await Promise.all([
            firstValueFrom(scrolled),
            page.mouse.wheel({deltaX: 0, deltaY})
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        expect(await page.page.evaluate(() => window.scrollY)).toEqual(deltaY);
        await page.page.evaluate(() => window.scrollTo(0, 0))
    })

    it('in case of greedy gesture handling should neither zoom nor scroll when both defaults are prevented', async () => {
        await setupInfiniteCanvas(true);
        const events = await infCanvas.eventTarget.emitEvents({
            wheel: {}
        })
        await events.handleEvents('wheel', h => h(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault(true);
            }
        }))
        await page.mouse.move(150, 150);
        await Promise.all([
            noEvent(events, 'draw', 300),
            page.mouse.wheel({deltaX: 0, deltaY: 80})
        ])
        expect(await page.page.evaluate(() => window.scrollY)).toEqual(0);
    })

    it('in case of no greedy gesture handling should neither zoom nor scroll when native default is prevented', async () => {
        await setupInfiniteCanvas();
        const events = await infCanvas.eventTarget.emitEvents({
            wheel: {}
        })
        await events.handleEvents('wheel', h => h(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault(true);
            }
        }))
        await page.mouse.move(150, 150);
        await Promise.all([
            noEvent(events, 'draw', 300),
            page.mouse.wheel({deltaX: 0, deltaY: 80})
        ])
        expect(await page.page.evaluate(() => window.scrollY)).toEqual(0);
    })

    it('should not pan if touchstart default is prevented', async () => {
        await setupInfiniteCanvas(true)
        const events = await infCanvas.eventTarget.emitEvents({
            touchstart: {}
        })
        await events.handleEvents('touchstart', h => h(ev => {
            if(ev.changedTouches.length !== 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        let touch = await page.touchscreen.touchStart(150, 150);
        await Promise.all([
            noEvent(events, 'draw', 300),
            touch.move(250, 150)
        ])
        await touch.end();
        touch = await page.touchscreen.touchStart(50, 150);
        await Promise.all([
            nextEvent(events, 'draw'),
            touch.move(200, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch.end();
    })

    it('should neither pan nor scroll if native default is also prevented', async () => {
        await setupInfiniteCanvas(true)
        const events = await infCanvas.eventTarget.emitEvents({
            touchstart: {}
        })
        await events.handleEvents('touchstart', h => h(ev => {
            if(ev.changedTouches.length !== 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault(true);
            }
        }))
        const touch = await page.touchscreen.touchStart(150, 150);
        await Promise.all([
            noEvent(events, 'draw', 300),
            touch.move(150, 50)
        ])
        await touch.end();
        expect(await page.page.evaluate(() => window.scrollY)).toEqual(0);
    })

    it('should not zoom if second started touch is default-prevented', async () => {
        await setupInfiniteCanvas(true)
        const events = await infCanvas.eventTarget.emitEvents({
            touchstart: {}
        })
        await events.handleEvents('touchstart', h => h(ev => {
            if(ev.changedTouches.length !== 1 || ev.targetTouches.length === 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        const touch = await page.touchscreen.touchStart(120, 120);
        await Promise.all([
            nextEvent(events, 'draw'),
            touch.move(120, 140)
        ])
        const secondTouch = await page.touchscreen.touchStart(180, 140);
        await Promise.all([
            noEvent(events, 'draw', 300),
            secondTouch.move(200, 140)
        ])
        await touch.end();
        await secondTouch.end();
    })

    it('should not do anything if first touch was default-prevented and the second was not', async () => {
        await setupInfiniteCanvas();
        const events = await infCanvas.eventTarget.emitEvents({
            touchstart: {}
        })
        await events.handleEvents('touchstart', h => h(ev => {
            if(ev.changedTouches.length !== 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault(true);
            }
        }))
        const firstTouch = await page.touchscreen.touchStart(150, 150);
        const secondTouch = await page.touchscreen.touchStart(50, 150);
        await Promise.all([
            noEvent(events, 'draw', 300),
            secondTouch.move(50, 250)
        ])
        await firstTouch.end();
        await secondTouch.end();
    })

    it('should emit touchmove when touch moves relative to infinitecanvas because the latter moves', async () => {
        await setupInfiniteCanvas(true)

        const events = await infCanvas.eventTarget.emitEvents({
            touchstart: touchEventMap,
            touchmove: touchEventMap
        })
        await events.handleEvents('touchstart', h => h(ev => {
            if(ev.changedTouches.length !== 1 || ev.targetTouches.length === 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        const firstTouchInitialY = 150;
        const secondTouchInitialY = 150;
        const firstTouchDeltaY: number = -40;
        const touch = await page.touchscreen.touchStart(120, firstTouchInitialY);
        const secondTouch = await page.touchscreen.touchStart(180, secondTouchInitialY);
        const [touchMove] = await Promise.all([
            nextEvent(events, 'touchmove'),
            touch.move(120, firstTouchInitialY + firstTouchDeltaY)
        ])
        expect(touchMove).toEqual({
            touches: [
                {
                    identifier: expect.anything(),
                    // the first touch has moved, but not relative to InfiniteCanvas
                    infiniteCanvasX: expect.closeTo(120),
                    infiniteCanvasY: expect.closeTo(firstTouchInitialY),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                },
                {
                    identifier: expect.anything(),
                    // because moving the first touch panned InfiniteCanvas upward, the second touch moved downward relative to InfiniteCanvas
                    infiniteCanvasX: expect.closeTo(180),
                    infiniteCanvasY: expect.closeTo(secondTouchInitialY - firstTouchDeltaY),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            targetTouches: [
                {
                    identifier: expect.anything(),
                    infiniteCanvasX: expect.closeTo(120),
                    infiniteCanvasY: expect.closeTo(firstTouchInitialY),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                },
                {
                    identifier: expect.anything(),
                    infiniteCanvasX: expect.closeTo(180),
                    infiniteCanvasY: expect.closeTo(secondTouchInitialY - firstTouchDeltaY),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ],
            changedTouches: [
                {
                    identifier: expect.anything(),
                    infiniteCanvasX: expect.closeTo(180),
                    infiniteCanvasY: expect.closeTo(secondTouchInitialY - firstTouchDeltaY),
                    radiusX: expect.closeTo(.5),
                    radiusY: expect.closeTo(.5),
                    rotationAngle: expect.closeTo(0)
                }
            ]
        })
        expect(touchMove.changedTouches[0].identifier).toEqual(touchMove.targetTouches[1].identifier);
        await touch.end();
        await secondTouch.end();
    })

    async function setupInfiniteCanvas(greedyGestureHandling: boolean = false): Promise<void>{
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
        }).then(c => page.createInfiniteCanvas(c, {greedyGestureHandling}))
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 100, 100);
        }))
    }
})