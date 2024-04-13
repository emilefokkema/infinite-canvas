import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page, JSHandle } from 'puppeteer'
import { type InfiniteCanvas, Units } from 'infinite-canvas'
import { 
    getScreenshot,
    getPage,
    getResultAfter,
    getTouchCollection,
    type EventListenerAdder
} from './utils'
import '../test-utils/expect-extensions'

describe('when state is saved and a rectangle drawn', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let infCanvas: JSHandle<InfiniteCanvas>

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage} = await getPage());
        infCanvas = await page.evaluateHandle((cssUnits) => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 300,
            canvasHeight: 150,
            units: cssUnits,
            greedyGestureHandling: true,
            drawing: (ctx: any) => {
                ctx.save();
                ctx.fillRect(20, 20, 80, 80)
            }
        }), Units.CSS)
    })

    it('should look like this', async () => {
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
    })

    it('should look like this when panned twice', async () => {
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        const touchCollection = await getTouchCollection(page)
        const touch = await touchCollection.start(20, 20)
        await getResultAfter(async () => {
            await touch.move(20, 150);
        }, [() => drawn.getNext()]);
        await getResultAfter(async () => {
            await touch.move(200, 150);
        }, [() => drawn.getNext()]);
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()

        await touch.end();
        await drawn.remove();
    })

    afterAll(async () => {
        await cleanup();
    })
})