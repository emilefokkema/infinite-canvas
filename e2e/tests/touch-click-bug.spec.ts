import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import { 
    getPage,
    getResultAfter,
    getTouchCollection,
    type InPageEventListener,
    type EventListenerAdder,
    type TouchCollection,
    ensureNoError
} from './utils'

describe('when a click happens in a touch way', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let touchCollection: TouchCollection;
    let clicked: InPageEventListener<MouseEvent>

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage} = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
            drawing: (ctx: any) => {
                ctx.fillRect(10, 10, 100, 100)
            }
        }))
        touchCollection = await getTouchCollection(page);
        clicked = await addEventListenerInPage(infCanvas, 'click');
    })

    it('should send a click event and throw no error', async () => {
        const [{offsetX}] = await getResultAfter(async () => {
            const touch = await touchCollection.start(200, 200);
            touch.end();
        }, [
            () => clicked.getNext(),
            () => ensureNoError(page, 500)
        ] as const)
        expect(offsetX).toEqual(200)
    })

    afterAll(async () => {
        await cleanup();
    })
})