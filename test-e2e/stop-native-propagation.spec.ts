import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest'
import type { Page, Browser } from 'puppeteer'
import type { DrawEvent } from 'infinite-canvas'
import { 
    getPageInBrowser,
    launchBrowser,
    getResultAfter,
    type InPageEventListener,
    type EventListenerAdder
} from './utils'

describe('when propagation of a mousedown event is stopped on capture on the canvas element', () => {
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

    it('should prevent panning', async () => {
        const canvasElWrapper = await page.evaluateHandle(() => window.TestPageLib.initializeCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400
        }))
        const canvasEl = await canvasElWrapper.evaluateHandle(w => w.canvasEl);
        const mouseDown: InPageEventListener<MouseEvent> = await addEventListenerInPage(canvasEl, 'mousedown', true);
        await mouseDown.modify(l => l.setHandler(ev => ev.stopPropagation()))
        const infCanvas = await canvasElWrapper.evaluateHandle(c => c.initializeInfiniteCanvas({
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 200, 100);
            }
        }))
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw')
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(200, 200), () => drawn.ensureNoNext(300));

        await mouseDown.remove();
        await drawn.remove();
    });

    it('also when the handler that stops propagation is added after creation of InfiniteCanvas', async () => {
        const canvasElWrapper = await page.evaluateHandle(() => window.TestPageLib.initializeCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400
        }))
        const canvasEl = await canvasElWrapper.evaluateHandle(w => w.canvasEl);
        const infCanvas = await canvasElWrapper.evaluateHandle(c => c.initializeInfiniteCanvas({
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 200, 100);
            }
        }))
        const mouseDown: InPageEventListener<MouseEvent> = await addEventListenerInPage(canvasEl, 'mousedown', true);
        await mouseDown.modify(l => l.setHandler(ev => ev.stopPropagation()))
        const drawn: InPageEventListener<DrawEvent> = await addEventListenerInPage(infCanvas, 'draw')
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(200, 200), () => drawn.ensureNoNext(300));

        await mouseDown.remove();
        await drawn.remove();
    });

    afterAll(async () => {
        if(cleanup){
            await cleanup();
        }
        await cleanupBrowser();
    })
})