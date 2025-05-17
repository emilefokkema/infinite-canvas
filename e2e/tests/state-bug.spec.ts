import { describe, beforeAll, it, expect } from 'vitest'
import { Units } from '../../src/api/units'
import { nextEvent } from './utils/next-event'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'

describe('when state is saved and a rectangle drawn', () => {
    let infCanvas: TestPageInfiniteCanvas

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 300,
            canvasHeight: 150,
        }).then(c => page.createInfiniteCanvas(c, {
            units: Units.CSS,
            greedyGestureHandling: true
        }))
        await infCanvas.draw(d => d(ctx => {
            ctx.save();
            ctx.fillRect(20, 20, 80, 80)
        }))
    })

    it('should look like this', async () => {
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom()
    })

    it('should look like this when panned twice', async () => {
        const touch = await page.touchscreen.touchStart(20, 20)
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch.move(20, 150)
        ])
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch.move(200, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom()
        await touch.end();
    })
})