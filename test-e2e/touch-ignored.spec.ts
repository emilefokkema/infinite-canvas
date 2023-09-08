import { describe, it, beforeAll, afterAll } from 'vitest'
import type { Page } from 'puppeteer'
import { 
    getPage,
    getResultAfter,
    getTouchCollection,
    waitForConsoleMessage,
    ensureNoConsoleMessage,
    type EventListenerAdder,
    type TouchCollection,
    type Touch,
    type InPageEventListener
} from './utils'

describe('without greedy gesture handling', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let touchCollection: TouchCollection;

    beforeAll(async () => {
        ({page, cleanup } = await getPage());
        await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 50, 50);
            }
        }))
        touchCollection = await getTouchCollection(page);
    })

    it('should display a console warning', async () => {
        let firstTouch: Touch;
        await getResultAfter(async () => {
            firstTouch = await touchCollection.start(100, 100);
            await firstTouch.move(200, 100);
        }, () => waitForConsoleMessage(page, m => m.type() === 'warning' && m.text() === 'use two fingers to move'))
        await firstTouch.end();
    });

    it('should not display a console warning if zooming occurs', async () => {
        let firstTouch: Touch, secondTouch: Touch;
        await getResultAfter(async () => {
            firstTouch = await touchCollection.start(100, 100);
            secondTouch = await touchCollection.start(200, 100);
            await secondTouch.move(200, 200);
        }, () => ensureNoConsoleMessage(page, m => m.type() === 'warning', 1000))
        await secondTouch.end();
        await firstTouch.end();
    })

    afterAll(async () => {
        await cleanup();
    })
})

describe('without greedy gesture handling and when touchstart is default-prevented', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let touchCollection: TouchCollection;

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage } = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 50, 50);
            }
        }))
        touchCollection = await getTouchCollection(page);
        const touchStart: InPageEventListener<TouchEvent> = await addEventListenerInPage(infCanvas, 'touchstart');
        await touchStart.modify(l => l.setHandler(ev => ev.preventDefault()))
    })

    it('should not display a console warning', async () => {
        let firstTouch: Touch;
        await getResultAfter(async () => {
            firstTouch = await touchCollection.start(100, 100);
            await firstTouch.move(200, 100);
        }, () => ensureNoConsoleMessage(page, m => m.type() === 'warning', 1000))
        await firstTouch.end();
    })

    afterAll(async () => {
        await cleanup();
    })
})