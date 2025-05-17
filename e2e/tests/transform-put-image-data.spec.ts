import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { nextEvent } from './utils/next-event';

describe('when using a filter with blur and drop-shadow', () => {
    let infCanvas: TestPageInfiniteCanvas;

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 300,
            canvasHeight: 150,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
            const width = 60;
            const height = 60;
            const centerX = 5;
            const centerY = 5;
            const radiusSq = 25;
            const array = new Uint8ClampedArray(4 * width * height);
            for(let j=0;j<height;j++){
                for(let i=0;i<width;i++){
                    const dx = i - centerX;
                    const dy = j - centerY;
                    const index = 4 * j * width + 4 * i;
                    const inside = dx * dx + dy * dy < radiusSq;
                    array[index] = inside ? 255:0;
                    array[index + 3] = 255;
                }
            }
            const imageData = new ImageData(array, width);
            ctx.translate(80, 30);
            ctx.filter = 'brightness(60%)'
            ctx.globalAlpha = .5
            ctx.shadowColor = '#00f'
            ctx.shadowOffsetX = 20
            ctx.shadowBlur = 4
            ctx.fillStyle = "#f00";
            ctx.fillRect(0, 0, 40, 40);
            ctx.putImageData(imageData, 20, 20);
        }))
    })

    it('should look like this', async () => {
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom()
    })

    it('should look like this when transformed', async () => {
        const firstTouch = await page.touchscreen.touchStart(10, 10);
        const secondTouch = await page.touchscreen.touchStart(50, 50);
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            secondTouch.move(80, 80)
        ]);
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            firstTouch.move(0, 100)
        ]);
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await firstTouch.end();
        await secondTouch.end();
    })
})