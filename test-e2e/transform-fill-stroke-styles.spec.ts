import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import { 
    getPage,
    getScreenshot,
    getResultAfter,
    getTouchCollection,
    waitForConsoleMessage,
    ensureNoConsoleMessage,
    type EventListenerAdder,
    type TouchCollection,
    type Touch,
    type InPageEventListener
} from './utils'
import '../test-utils/expect-extensions'
import type { DrawEvent } from 'infinite-canvas'

describe('when using these particular fill and stroke styles', () => {
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
                const array = new Uint8ClampedArray([
                    255, 0, 0, 255,
                    0, 255, 0, 255,
                    0, 0, 255, 255,
                    255, 0, 0, 255]);
                const imageData = new ImageData(array, 2, 2);
                createImageBitmap(imageData).then(bitmap => {
                    const pattern = ctx.createPattern(bitmap, 'repeat');
                    ctx.fillStyle = pattern;
                    ctx.scale(5, 5);
                    ctx.lineWidth = 3;
                    ctx.shadowOffsetX = 20;
                    ctx.shadowOffsetY = 20;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = '#aaa'
                    ctx.setLineDash([5, 2])
                    ctx.beginPath();
                    ctx.rect(5, 5, 30, 30);
                    ctx.fill()
                    ctx.stroke();
                    ctx.fillStyle = '#000'
                    ctx.strokeRect(20, 20, 30, 30)
                })
            }
        }))
        drawn = await addEventListenerInPage(infCanvas, 'draw')
    })

    it('should look like this', async () => {
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier:  'fill-stroke-styles-1'})
    })

    it('should look like this when transformed', async () => {
        const touchCollection = await getTouchCollection(page);
        const firstTouch = await touchCollection.start(10, 10);
        const secondTouch = await touchCollection.start(50, 50);
        await getResultAfter(async () => {
            await secondTouch.move(120, 120);
        }, () => drawn.getNext());
        await getResultAfter(async () => {
            await firstTouch.move(-10, -10);
        }, () => drawn.getNext());
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'fill-stroke-styles-2', dependsOnEnvironments: ['gitpod', 'CI']})
        await firstTouch.end();
        await secondTouch.end();
    })

    afterAll(async  () => {
        await drawn.remove();
        await cleanup();
    })
})