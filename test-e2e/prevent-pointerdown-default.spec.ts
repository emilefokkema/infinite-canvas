import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import type { Page, JSHandle, Browser } from 'puppeteer'
import type { DrawEvent, InfiniteCanvas, InfiniteCanvasEventWithDefaultBehavior } from 'infinite-canvas'
import { 
    getTouchCollection,
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

describe('when default is prevented for pointerdown', () => {
    let page: Page;
    let browser: Browser;
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

    it('should not begin to pan in case of a mousedown', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        const pointerDown: InPageEventListener<PointerEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'pointerdown')
        await pointerDown.modify(l => l.setHandler(ev => {
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
    });

    it('should not begin to pan in case of a touch', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        const pointerDown: InPageEventListener<PointerEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'pointerdown')
        await pointerDown.modify(l => l.setHandler(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        const touches: TouchCollection = await getTouchCollection(page)
        let touch = await touches.start(150, 150);
        await getResultAfter(() => touch.move(250, 150), [() => drawn.ensureNoNext(300)]);
        await touch.end();
        touch = await touches.start(50, 150);
        await getResultAfter(() => touch.move(200, 150), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
    });

    afterAll(async () => {
        if(cleanup){
            await cleanup();
        }
        await cleanupBrowser();
    })
})
