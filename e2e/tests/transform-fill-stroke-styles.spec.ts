import { describe, it, beforeAll, expect } from 'vitest'
import { nextEvent } from './utils/next-event'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'

describe('when using these particular fill and stroke styles', () => {
    let infCanvas: TestPageInfiniteCanvas;

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c))
        await infCanvas.draw(d => d(ctx => {
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
        }))
    })

    it('should look like this', async () => {
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier:  'fill-stroke-styles-1'})
    })

    it('should look like this when transformed', async () => {
        const firstTouch = await page.touchscreen.touchStart(10, 10);
        const secondTouch = await page.touchscreen.touchStart(50, 50);
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            secondTouch.move(120, 120)
        ])
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            firstTouch.move(-10, -10)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier:  'fill-stroke-styles-2', dependsOnEnvironment: true})
        await firstTouch.end();
        await secondTouch.end();
    })
})