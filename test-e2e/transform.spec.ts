import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import type { Page, JSHandle, Browser } from 'puppeteer'
import { debounceTime, firstValueFrom } from 'rxjs'
import type { InfiniteCanvas } from 'infinite-canvas'
import { 
    getTouchCollection,
    getPageInBrowser,
    launchBrowser,
    getScreenshot,
    getResultAfter,
    fromSource,
    type EventListenerAdder,
    type TouchCollection,
    type Touch
} from './utils'
import '../test-utils/expect-extensions'

function initializeInfiniteCanvas(page: Page, greedyGestureHandling?: boolean, rotationEnabled?: boolean): Promise<JSHandle<InfiniteCanvas>>{
    return page.evaluateHandle((greedyGestureHandling, rotationEnabled) => window.TestPageLib.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        spaceBelowCanvas: 2000,
        greedyGestureHandling,
        rotationEnabled,
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
    }), greedyGestureHandling, rotationEnabled)
}

describe('when transforming', () => {
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

    it('should pan', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(150, 150), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.up({button: 'left'});
        await getResultAfter(() => page.mouse.move(200, 200), () => drawn.ensureNoNext(500));
    });

     it('should stop panning when mouse leaves canvas', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        await page.mouse.move(300, 50);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(350, 50), () => drawn.getNext());
        await getResultAfter(() => page.mouse.move(450, 50), () => drawn.ensureNoNext(500));
        await getResultAfter(() => page.mouse.move(300, 50), () => drawn.ensureNoNext(500));
        await page.mouse.up({button: 'left'});
    });

    it('should rotate', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await getResultAfter(() => page.mouse.move(125, 100), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom({dependsOnEnvironments: ['gitpod', 'CI']})
        await page.mouse.up({button: 'middle'})
        await getResultAfter(() => page.mouse.move(150, 100), () => drawn.ensureNoNext(500));
    });

    it('should zoom on wheel with control key', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        await page.mouse.move(100, 100);
        await page.keyboard.down('ControlLeft');
        await getResultAfter(() => page.mouse.wheel({deltaX: 0, deltaY: -75 }), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        expect(await page.evaluate(() => window.scrollY)).toEqual(0);
        await page.keyboard.up('ControlLeft');
    });

    it('should not zoom on only wheel', async () => {
        await initializeInfiniteCanvas(page);
        const windowHandle = await page.evaluateHandle(() => window);
        const scrolled = fromSource(await addEventListenerInPage(windowHandle, 'scroll')).pipe(debounceTime(300))
        await page.mouse.move(100, 100);
        const deltaY: number = 80;
        await getResultAfter(() => page.mouse.wheel({deltaX: 0, deltaY}), () => firstValueFrom(scrolled));
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        expect(await page.evaluate(() => window.scrollY)).toEqual(deltaY);
    });

    it('should zoom on only wheel with greedyGestureHandling', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        const debouncedDrawn = fromSource(drawn).pipe(debounceTime(300))
        await page.mouse.move(100, 100);
        await getResultAfter(() => page.mouse.wheel({deltaX: 0, deltaY: -75 }), () => firstValueFrom(debouncedDrawn));
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        expect(await page.evaluate(() => window.scrollY)).toEqual(0);
    });

    it('should not rotate', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, undefined, false);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await getResultAfter(() => page.mouse.move(125, 100), () => drawn.ensureNoNext(300));
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await page.mouse.up({button: 'middle'});
    });

    it('should pan on single moving touch if greedy gesture handling enabled', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        const touchCollection: TouchCollection = await getTouchCollection(page);
        const touch: Touch = await touchCollection.start(100, 100);
        await getResultAfter(() => touch.move(150, 150), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await touch.end();
    });

    it('should not pan on single moving touch if greedy gesture handling not enabled', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        const touchCollection: TouchCollection = await getTouchCollection(page);
        const touch: Touch = await touchCollection.start(200, 200);
        await getResultAfter(() => touch.move(200, 100), () => drawn.ensureNoNext(300));
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await touch.end();
        expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    });

    it('should zoom and rotate', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        const touchCollection: TouchCollection = await getTouchCollection(page);
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await getResultAfter(() => touch2.move(200, 200), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await getResultAfter(() => touch1.move(100, 0), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await touch1.end();
        await getResultAfter(() => touch2.move(150, 200), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await touch2.end();
    });

    it('should zoom but not rotate on two touches if rotation not enabled', async () => {
        const infCanvas = await initializeInfiniteCanvas(page, undefined, false);
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        const touchCollection: TouchCollection = await getTouchCollection(page);
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await getResultAfter(() => touch2.move(200, 200), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await touch1.end();
        await getResultAfter(() => touch2.move(100, 200), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await touch2.end();
    })

    afterAll(async () => {
        if(cleanup){
            await cleanup();
        }
        await cleanupBrowser();
    })
})