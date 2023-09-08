import { describe, it, beforeAll, afterAll } from 'vitest'
import type { Page } from 'puppeteer'
import type { DrawEvent } from 'infinite-canvas'
import { 
    getPage,
    getResultAfter,
    type InPageEventListener,
    type EventListenerAdder
} from './utils'

describe('when propagation of a mousedown event is stopped on capture on the infinite canvas', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let drawn: InPageEventListener<DrawEvent>;
    let mouseDown: InPageEventListener<MouseEvent>;

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage} = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 200, 100);
            }
        }))
        drawn = await addEventListenerInPage(infCanvas, 'draw');
        mouseDown = await addEventListenerInPage(infCanvas, 'mousedown', true);
        await mouseDown.modify(l => l.setHandler(ev => ev.stopPropagation()))
    })

    it('the canvas should still pan because default was not prevented', async () => {
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'left'});
        await getResultAfter(() => page.mouse.move(150, 150), () => drawn.getNext());
    });

    afterAll(async () => {
        await drawn.remove();
        await mouseDown.remove();
        await cleanup();
    })
})