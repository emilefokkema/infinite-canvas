import { describe, it, expect, afterEach } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { nextEvent, noEvent } from './utils/next-event'

describe('when default is prevented for pointerdown', () => {
    let infCanvas: TestPageInfiniteCanvas

    afterEach(async () => {
        await page.reload()
    })

    it('should not begin to pan in case of a mousedown', async () => {
        await setupInfiniteCanvas()
        const events = await infCanvas.eventTarget.emitEvents({
            pointerdown: {}
        })
        await events.handleEvents('pointerdown', h => h(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            noEvent(events, 'draw', 300),
            page.mouse.move(250, 150)
        ])
        await page.mouse.up({button: 'left'});
        await page.mouse.move(50, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            nextEvent(events, 'draw'),
            page.mouse.move(200, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.up({button: 'left'});
        await page.mouse.move(300, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            noEvent(events, 'draw', 300),
            page.mouse.move(150, 150)
        ])
        await page.mouse.up({button: 'left'});
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            nextEvent(events, 'draw'),
            page.mouse.move(50, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
    })

    it('should not begin to pan in case of a touch', async () => {
        await setupInfiniteCanvas(true)
        const events = await infCanvas.eventTarget.emitEvents({
            pointerdown: {}
        })
        await events.handleEvents('pointerdown', h => h(ev => {
            const isInArea = ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
            if(isInArea){
                ev.preventDefault();
            }
        }))
        let touch = await page.touchscreen.touchStart(150, 150);
        await Promise.all([
            noEvent(events, 'draw', 300),
            touch.move(250, 150)
        ])
        await touch.end();
        touch = await page.touchscreen.touchStart(50, 150);
        await Promise.all([
            nextEvent(events, 'draw'),
            touch.move(200, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch.end();
    })

    async function setupInfiniteCanvas(greedyGestureHandling: boolean = false): Promise<void>{
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
        }).then(c => page.createInfiniteCanvas(c, {greedyGestureHandling}))
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 100, 100);
        }))
    }
})