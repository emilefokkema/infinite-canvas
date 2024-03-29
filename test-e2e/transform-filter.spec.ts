import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import { 
    getPage,
    getScreenshot,
    getResultAfter,
    getTouchCollection,
    type EventListenerAdder,
    type Touch,
    type InPageEventListener
} from './utils'
import '../test-utils/expect-extensions'
import type { DrawEvent } from 'infinite-canvas'

describe('when using a filter with blur and drop-shadow', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let drawn: InPageEventListener<DrawEvent>

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage } = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
                ctx.save();
                ctx.filter = 'blur(2px)';
                ctx.fillRect(40, 40, 40, 40)
                ctx.translate(50, 100)
                ctx.scale(5, 5)
                ctx.fillRect(0, 0, 20, 20);
                ctx.restore();
                ctx.fillRect(100, 40, 40, 40)
                ctx.filter = 'drop-shadow(20px 20px 5px #f00)';
                ctx.fillRect(160, 40, 40, 40)
            }
        }))
        drawn = await addEventListenerInPage(infCanvas, 'draw')
    })

    it('should look like this', async () => {
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
    })

    it('should look like this when transformed', async () => {
        const touchCollection = await getTouchCollection(page);
        const firstTouch: Touch = await touchCollection.start(10, 10);
        const secondTouch: Touch = await touchCollection.start(50, 50)
        await getResultAfter(async () => {
            await secondTouch.move(100, 100);
        }, [() => drawn.getNext()]);
        await getResultAfter(async () => {
            await firstTouch.move(10, 50);
        }, [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
        await firstTouch.end();
        await secondTouch.end();
    })

    afterAll(async  () => {
        await drawn.remove();
        await cleanup();
    })
})