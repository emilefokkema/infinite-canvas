import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import { 
    getPage,
    getScreenshot,
    getResultAfter,
    getTouchCollection,
    type EventListenerAdder,
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
            canvasWidth: 300,
            canvasHeight: 150,
            drawing: (ctx: any) => {
                var width = 60;
                var height = 60;
                var centerX = 5;
                var centerY = 5;
                var radiusSq = 25;
                var array = new Uint8ClampedArray(4 * width * height);
                for(var j=0;j<height;j++){
                    for(var i=0;i<width;i++){
                        var dx = i - centerX;
                        var dy = j - centerY;
                        var index = 4 * j * width + 4 * i;
                        var inside = dx * dx + dy * dy < radiusSq;
                        array[index] = inside ? 255:0;
                        array[index + 3] = 255;
                    }
                }
                var imageData = new ImageData(array, width);
                ctx.translate(80, 30);
                ctx.filter = 'brightness(60%)'
                ctx.globalAlpha = .5
                ctx.shadowColor = '#00f'
                ctx.shadowOffsetX = 20
                ctx.shadowBlur = 4
                ctx.fillStyle = "#f00";
                ctx.fillRect(0, 0, 40, 40);
                ctx.putImageData(imageData, 20, 20);
            }
        }))
        drawn = await addEventListenerInPage(infCanvas, 'draw')
    })

    it('should look like this', async () => {
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom()
    })

    it('should look like this when transformed', async () => {
        const touchCollection = await getTouchCollection(page);
        const firstTouch = await touchCollection.start(10, 10);
        const secondTouch = await touchCollection.start(50, 50);
        await getResultAfter(async () => {
            await secondTouch.move(80, 80);
        }, [() => drawn.getNext()]);
        await getResultAfter(async () => {
            await firstTouch.move(0, 100);
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