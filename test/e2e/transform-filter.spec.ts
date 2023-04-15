import {describe, it, beforeAll, afterAll } from '@jest/globals';
import { getResultAfter, InfiniteCanvasProxy, TestPage, Touch } from "e2e-test-page";
import { compareToSnapshot } from "./compare-to-snapshot";

describe('when using a filter with blur and drop-shadow', () => {
    let page: TestPage;
    let infCanvas: InfiniteCanvasProxy;

    beforeAll(async () => {
        page = await TestPage.create();
        infCanvas = await page.initializeInfiniteCanvas({
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
        })
    })

    it('should look like this', async () => {
        await compareToSnapshot(page);
    })

    it('should look like this when transformed', async () => {
        const drawn = await infCanvas.addDrawEventListener();
        const touchCollection = await page.getTouchCollection();
        const firstTouch: Touch = await touchCollection.start(10, 10);
        const secondTouch: Touch = await touchCollection.start(50, 50)
        await getResultAfter(async () => {
            await secondTouch.move(100, 100);
        }, () => drawn.getNext());
        await getResultAfter(async () => {
            await firstTouch.move(10, 50);
        }, () => drawn.getNext());
        await compareToSnapshot(page);
        await firstTouch.end();
        await secondTouch.end();
    })

    afterAll(async () => {
        await page.close();
    });
})