import { describe, it, beforeAll, expect } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { CODESPACES, selectEnvironment } from './utils/environments'

describe('when we measure text', () => {
    let infCanvas: TestPageInfiniteCanvas

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '200px',
            styleHeight: '200px',
            canvasWidth: 200,
            canvasHeight: 200,
        }).then(c => page.createInfiniteCanvas(c))
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 200, 100);
        }))
    })

    it('should return this text measurement', async () => {
        const textMetrics = await page.measureText(infCanvas.handle, 'Hello World')
        expect(textMetrics).toMatchSnapshot(selectEnvironment(CODESPACES).id);
    })

    describe('and then the font is changed', () => {

        beforeAll(async () => {
            await infCanvas.handle.evaluate(c => c.getContext('2d').font = '12px sans-serif')
        })

        it('should return this text measurement', async () => {
            const textMetrics = await page.measureText(infCanvas.handle, 'Hello World')
            expect(textMetrics).toMatchSnapshot(selectEnvironment(CODESPACES).id);
        })
    })

    describe('and then a transformation happens', () => {

        beforeAll(async () => {
            const touch1 = await page.touchscreen.touchStart(20, 20);
            const touch2 = await page.touchscreen.touchStart(100, 100);
            await touch2.move(150, 100);
            await touch2.end();
            await touch1.end();
        })

        it('should return this text measurement', async () => {
            const textMetrics = await page.measureText(infCanvas.handle, 'Hello World')
            expect(textMetrics).toMatchSnapshot(selectEnvironment(CODESPACES).id);
        })
    })
})