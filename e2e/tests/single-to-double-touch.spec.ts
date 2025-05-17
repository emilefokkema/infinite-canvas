import { describe, beforeAll, it, expect } from 'vitest'
import { TouchHandle } from 'puppeteer'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { nextEvent } from './utils/next-event'

describe('when two touches start', () => {
    let infCanvas: TestPageInfiniteCanvas
    let firstTouch: TouchHandle;
    let secondTouch: TouchHandle;

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c))
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 200, 100);
        }))
        firstTouch = await page.touchscreen.touchStart(100, 100);
        secondTouch = await page.touchscreen.touchStart(200, 100);
    })

    it('should rotate-zoom', async () => {
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            secondTouch.move(200, 200)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'single-to-double-touch-1'})
    })

    describe('and when one touch is released', () => {

        beforeAll(async () => {
            await secondTouch.end();
        })

        it('should pan', async () => {
            await Promise.all([
                nextEvent(infCanvas.eventTarget, 'draw'),
                firstTouch.move(100, 50)
            ])
            expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'single-to-double-touch-2'})
        })

        describe('and when a third touch starts', () => {
            let thirdTouch: TouchHandle;

            beforeAll(async () => {
                thirdTouch = await page.touchscreen.touchStart(200, 150);
            })

            it('should rotate-zoom again', async () => {
                await Promise.all([
                    nextEvent(infCanvas.eventTarget, 'draw'),
                    thirdTouch.move(200, 50)
                ])
                expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'single-to-double-touch-3'})
            })
        })
    })
})