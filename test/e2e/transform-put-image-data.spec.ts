import {describe, it, beforeAll, afterAll } from '@jest/globals';
import { getResultAfter, InfiniteCanvasProxy, TestPage, Touch } from "e2e-test-page";
import { compareToSnapshot } from "./compare-to-snapshot";

describe('when putting image data', () => {
    let page: TestPage;
    let infCanvas: InfiniteCanvasProxy;

    beforeAll(async () => {
        page = await TestPage.create();
        infCanvas = await page.initializeInfiniteCanvas({
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
            await secondTouch.move(80, 80);
        }, () => drawn.getNext());
        await getResultAfter(async () => {
            await firstTouch.move(0, 100);
        }, () => drawn.getNext());
        await compareToSnapshot(page);
        await firstTouch.end();
        await secondTouch.end();
    })

    afterAll(async () => {
        await page.close();
    });
})