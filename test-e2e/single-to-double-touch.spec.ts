import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import type { DrawEvent } from 'infinite-canvas'
import { 
    getTouchCollection,
    getPage,
    getScreenshot,
    getResultAfter,
    type InPageEventListener,
    type EventListenerAdder,
    type TouchCollection,
    type Touch
} from './utils'
import '../test-utils/expect-extensions'

describe('when two touches start', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let touchCollection: TouchCollection;
    let firstTouch: Touch;
    let secondTouch: Touch;
    let drawn: InPageEventListener<DrawEvent>

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
        touchCollection = await getTouchCollection(page);
        firstTouch = await touchCollection.start(100, 100);
        secondTouch = await touchCollection.start(200, 100);
    })

    it('should rotate-zoom', async () => {
        await getResultAfter(() => secondTouch.move(200, 200), () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'single-to-double-touch-1'})
    });

    describe('and when one touch is released', () => {

        beforeAll(async () => {
            await secondTouch.end();
        });

        it('should pan', async () => {
            await getResultAfter(() => firstTouch.move(100, 50), () => drawn.getNext());
            expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'single-to-double-touch-2'})
        });

        describe('and when a third touch starts', () => {
            let thirdTouch: Touch;

            beforeAll(async () => {
                thirdTouch = await touchCollection.start(200, 150);
            });

            it('should rotate-zoom again', async () => {
                await getResultAfter(() => thirdTouch.move(200, 50), () => drawn.getNext());
                expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'single-to-double-touch-3'})
            });
        });
    });

    afterAll(async () => {
        await cleanup();
    })
})