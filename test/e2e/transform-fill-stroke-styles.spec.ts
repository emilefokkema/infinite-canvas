import {describe, it, beforeAll, afterAll } from '@jest/globals';
import { getResultAfter, InfiniteCanvasProxy, TestPage, Touch } from "e2e-test-page";
import { compareToSnapshot } from "./compare-to-snapshot";

describe('when using these particular fill and stroke styles', () => {
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
        });
    });

    it('should look like this', async () => {
        await compareToSnapshot(page);
    })

    it('should look like this when transformed', async () => {
        const drawn = await infCanvas.addDrawEventListener();
        const touchCollection = await page.getTouchCollection();
        const firstTouch = await touchCollection.start(10, 10);
        const secondTouch = await touchCollection.start(50, 50);
        await getResultAfter(async () => {
            await secondTouch.move(120, 120);
        }, () => drawn.getNext());
        await getResultAfter(async () => {
            await firstTouch.move(-10, -10);
        }, () => drawn.getNext());
        await compareToSnapshot(page);
        await firstTouch.end();
        await secondTouch.end();
    })

    afterAll(async () => {
        await page.close();
    });
})