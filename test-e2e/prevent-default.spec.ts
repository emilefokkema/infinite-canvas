import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import type { Page, JSHandle, Browser } from 'puppeteer'
import { debounceTime, firstValueFrom } from 'rxjs'
import type { DrawEvent, InfiniteCanvas, InfiniteCanvasEventWithDefaultBehavior, InfiniteCanvasTouchEvent } from 'infinite-canvas'
import { 
    getTouchCollection,
    fromSource,
    getPageInBrowser,
    launchBrowser,
    getScreenshot,
    getResultAfter,
    type InPageEventListener,
    type EventListenerAdder,
    type TouchCollection
} from './utils'
import '../test-utils/expect-extensions'

function initializeInfiniteCanvas(page: Page, greedyGestureHandling: boolean = false): Promise<JSHandle<InfiniteCanvas>>{
    return page.evaluateHandle((greedyGestureHandling) => window.TestPageLib.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        greedyGestureHandling,
        spaceBelowCanvas: 2000,
        drawing: (ctx: any) => {
            ctx.fillRect(100, 100, 100, 100);
        }
    }), greedyGestureHandling)
}
describe('when default is prevented', () => {
    let browser: Browser;
    let page: Page;
    let cleanup: () => Promise<void>;
    let cleanupBrowser: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;

    beforeAll(async () => {
        ({browser, cleanup: cleanupBrowser} = await launchBrowser());
    })

    beforeEach(async () => {
        if(cleanup){
            await cleanup();
        }
        ({page, cleanup, addEventListenerInPage} = await getPageInBrowser(browser));
    })

    it('should not begin to pan when mousedown default is prevented', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        const mouseDown: InPageEventListener<MouseEvent> = await addEventListenerInPage(infCanvas, 'mousedown');
        mouseDown.modify(l => l.setHandler(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(250, 150), [() => drawn.ensureNoNext(300)]);
        await page.mouse.up({button: 'left'});
        await page.mouse.move(50, 150);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(200, 150), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.up({button: 'left'});
        await page.mouse.move(300, 150);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(150, 150), [() => drawn.ensureNoNext(300)]);
        await page.mouse.up({button: 'left'});
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(50, 150), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()

        await drawn.remove();
        await mouseDown.remove();
    });

    it('should not zoom when wheel default is prevented', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const wheel: InPageEventListener<WheelEvent> = await addEventListenerInPage(infCanvas, 'wheel')
        await wheel.modify(l => l.setHandler(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        const windowHandle = await page.evaluateHandle(() => window);
        const scrolled = fromSource(await addEventListenerInPage(windowHandle, 'scroll')).pipe(debounceTime(300))
        await page.mouse.move(150, 150);
        const deltaY: number = 80;
        await getResultAfter(() => page.mouse.wheel({deltaX: 0, deltaY}), [() => firstValueFrom(scrolled)]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        expect(await page.evaluate(() => window.scrollY)).toEqual(deltaY);
    });

    it('in case of greedy gesture handling should neither zoom nor scroll when both defaults are prevented', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        const wheel: InPageEventListener<WheelEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'wheel')
        await wheel.modify(l => l.setHandler(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault(true);
            }
        }))
        await page.mouse.move(150, 150);
        await getResultAfter(() => page.mouse.wheel({deltaX: 0, deltaY: 80}), [() => drawn.ensureNoNext(300)]);
        expect(await page.evaluate(() => window.scrollY)).toEqual(0);
    });

    it('in case of no greedy gesture handling should neither zoom nor scroll when native default is prevented', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');

        const wheel: InPageEventListener<WheelEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'wheel')
        await wheel.modify(l => l.setHandler(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault(true);
            }
        }))
        await page.mouse.move(150, 150);
        await getResultAfter(() => page.mouse.wheel({deltaX: 0, deltaY: 80}), [() => drawn.ensureNoNext(300)]);
        expect(await page.evaluate(() => window.scrollY)).toEqual(0);
    });

    it('should not pan if touchstart default is prevented', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        const touchStart: InPageEventListener<InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'touchstart')
        touchStart.modify(l => l.setHandler(ev => {
            if(ev.changedTouches.length !== 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        const touches: TouchCollection = await getTouchCollection(page);
        let touch = await touches.start(150, 150);
        await getResultAfter(() => touch.move(250, 150), [() => drawn.ensureNoNext(300)]);
        await touch.end();
        touch = await touches.start(50, 150);
        await getResultAfter(() => touch.move(200, 150), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
    });

    it('should neither pan nor scroll if native default is also prevented', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        const touchStart: InPageEventListener<InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'touchstart')
        touchStart.modify(l => l.setHandler(ev => {
            if(ev.changedTouches.length !== 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault(true);
            }
        }))
        const touches: TouchCollection = await getTouchCollection(page);
        let touch = await touches.start(150, 150);
        await getResultAfter(() => touch.move(150, 50), [() => drawn.ensureNoNext(300)]);
        await touch.end();
        expect(await page.evaluate(() => window.scrollY)).toEqual(0);
    });

    it('should not zoom if second started touch is default-prevented', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        const touchStart: InPageEventListener<InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'touchstart')
        touchStart.modify(l => l.setHandler(ev => {
            if(ev.changedTouches.length !== 1 || ev.targetTouches.length === 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        const touches: TouchCollection = await getTouchCollection(page);
        const touch = await touches.start(120, 120);
        await getResultAfter(() => touch.move(120, 140), [() => drawn.getNext()]);
        const secondTouch = await touches.start(180, 140);
        await getResultAfter(() => secondTouch.move(200, 140), [() => drawn.ensureNoNext(300)]);
        await touch.end();
        await secondTouch.end();
    });

    it('should not do anything if first touch was default-prevented and the second was not', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        //await infCanvas.addTouchEventListener('touchstart', changedTouchIsInArea);
        const touchStart: InPageEventListener<InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'touchstart')
        touchStart.modify(l => l.setHandler(ev => {
            if(ev.changedTouches.length !== 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault(true);
            }
        }))
        const touches: TouchCollection = await getTouchCollection(page);
        const firstTouch = await touches.start(150, 150);
        const secondTouch = await touches.start(50, 150);
        await getResultAfter(() => secondTouch.move(50, 250), [() => drawn.ensureNoNext(300)]);
        await firstTouch.end();
        await secondTouch.end();
    });

    it('should emit touchmove when touch moves relative to infinitecanvas because the latter moves', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const touchStart: InPageEventListener<InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'touchstart')
        touchStart.modify(l => l.setHandler(ev => {
            if(ev.changedTouches.length !== 1 || ev.targetTouches.length === 1){
                return;
            }
            const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
            const isInArea = infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        const touchMoved: InPageEventListener<InfiniteCanvasTouchEvent> = await addEventListenerInPage(infCanvas, 'touchmove')
        const touchCollection: TouchCollection = await getTouchCollection(page)
        const firstTouchInitialY = 150;
        const secondTouchInitialY = 150;
        const firstTouchDeltaY: number = -40;
        const touch = await touchCollection.start(120, firstTouchInitialY);
        const secondTouch = await touchCollection.start(180, secondTouchInitialY);
        const [{touches, changedTouches, targetTouches}] = await getResultAfter(() => touch.move(120, firstTouchInitialY + firstTouchDeltaY), [() => touchMoved.getNext()]);
        expect(touches.length).toBe(2);
        expect(changedTouches.length).toBe(1);
        expect(targetTouches.length).toBe(2);
        const [{
            infiniteCanvasX: firstTargetTouchInfiniteCanvasX,
            infiniteCanvasY: firstTargetTouchInfiniteCanvasY
        }, {identifier: targetTouchIdentifier2}] = targetTouches;
        const {
            identifier: changedTouchIdentifier,
            infiniteCanvasX,
            infiniteCanvasY
        } = changedTouches[0];
        
        // the first touch has moved, but not relative to InfiniteCanvas
        expect(firstTargetTouchInfiniteCanvasX).toBeCloseTo(120);
        expect(firstTargetTouchInfiniteCanvasY).toBeCloseTo(firstTouchInitialY);

        // because moving the first touch panned InfiniteCanvas upward, the second touch moved downward relative to InfiniteCanvas
        expect(changedTouchIdentifier).toBe(targetTouchIdentifier2);
        expect(infiniteCanvasX).toBeCloseTo(180);
        expect(infiniteCanvasY).toBeCloseTo(secondTouchInitialY - firstTouchDeltaY);

        await touch.end();
        await secondTouch.end();
    })

    afterAll(async () => {
        if(cleanup){
            await cleanup();
        }
        await cleanupBrowser();
    })
})