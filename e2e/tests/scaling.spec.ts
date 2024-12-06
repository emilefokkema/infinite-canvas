import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import type { Page, JSHandle, Browser } from 'puppeteer'
import { type DrawEvent, type InfiniteCanvas, Units } from 'infinite-canvas'
import { 
    setSize,
    getTouchCollection,
    getPageInBrowser,
    launchBrowser,
    getScreenshot,
    getResultAfter,
    type InPageEventListener,
    type EventListenerAdder,
    type TouchCollection,
    type Touch
} from './utils'
import '../test-utils/expect-extensions'

function initializeInfiniteCanvas(page: Page, canvasWidth: number | 'boundingclientrect',
    canvasHeight: number | 'boundingclientrect',
    greedyGestureHandling?: boolean,
    rotationEnabled?: boolean,
    units?: Units): Promise<JSHandle<InfiniteCanvas>>{
    return page.evaluateHandle((canvasWidth, canvasHeight, greedyGestureHandling, rotationEnabled, units) => window.TestPageLib.initializeInfiniteCanvas({
        styleWidth: '100%',
        styleHeight: '100%',
        canvasWidth,
        canvasHeight,
        greedyGestureHandling,
        rotationEnabled,
        units,
        drawing: (ctx: any) => {
            ctx.beginPath();
            ctx.moveToInfinityInDirection(-1, 0);
            ctx.lineTo(100, 100);
            ctx.lineToInfinityInDirection(1, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveToInfinityInDirection(0, -1);
            ctx.lineTo(100, 100);
            ctx.lineToInfinityInDirection(0, 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(200, 100, 25, 0, 2 * Math.PI);
            ctx.fill();
        }
    }), canvasWidth, canvasHeight, greedyGestureHandling, rotationEnabled, units)
}

describe('when scaling', () => {
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

    it('should rotate correctly after resize', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, 'boundingclientrect', 'boundingclientrect');
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        await setSize(page, 400, 600);
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await getResultAfter(() => page.mouse.move(120, 100), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.up({button: 'middle'});

        await drawn.remove();
    });

    it('should rotate-zoom correctly after resize', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, 'boundingclientrect', 'boundingclientrect');
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        await setSize(page, 400, 600);
        const touchCollection: TouchCollection = await getTouchCollection(page)
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await getResultAfter(() => touch2.move(200, 200), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await touch1.end();
        await touch2.end();

        await drawn.remove();
    });

    it('should respond to resize in case of css units', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, 'boundingclientrect', 'boundingclientrect', undefined, undefined, Units.CSS);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        await getResultAfter(() => setSize(page, 400, 600), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await getResultAfter(() => page.mouse.move(120, 100), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.up({button: 'middle'});

        await drawn.remove();
    })

    it('should behave in case of a different canvas scale', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, 400, 400);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await getResultAfter(() => page.mouse.move(120, 100), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom({dependsOnEnvironments: ['gitpod', 'CI']})
        await page.mouse.up({button: 'middle'});

        await drawn.remove();
    });

    it('should behave in case of a different canvas scale and css units', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, 400, 400, undefined, undefined, Units.CSS);
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw');
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await getResultAfter(() => page.mouse.move(120, 100), [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.up({button: 'middle'});

        await drawn.remove();
    });

    afterAll(async () => {
        if(cleanup){
            await cleanup();
        }
        await cleanupBrowser();
    })
})