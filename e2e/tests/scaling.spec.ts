import { describe, it, expect, afterEach } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { Units } from '../../src/api/units'
import { nextEvent } from './utils/next-event'

describe('when scaling', () => {
    let infCanvas: TestPageInfiniteCanvas

    afterEach(async () => {
        await page.reload()
    })

    it('should rotate correctly after resize', async () => {
        await setupInfiniteCanvas('boundingclientrect', 'boundingclientrect')
        await page.setSize(400, 600)
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.move(120, 100)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.up({button: 'middle'});
    })

    it('should rotate-zoom correctly after resize', async () => {
        await setupInfiniteCanvas('boundingclientrect', 'boundingclientrect')
        await page.setSize(400, 600)
        const touch1 = await page.touchscreen.touchStart(100, 100);
        const touch2 = await page.touchscreen.touchStart(200, 100);
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch2.move(200, 200)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch1.end();
        await touch2.end();
    })

    it('should respond to resize in case of css units', async () => {
        await setupInfiniteCanvas('boundingclientrect', 'boundingclientrect', undefined, undefined, Units.CSS)
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.setSize(400, 600)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.move(120, 100)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.up({button: 'middle'});
    })

    it('should behave in case of a different canvas scale', async () => {
        await setupInfiniteCanvas(400, 400)
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.move(120, 100)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom({dependsOnEnvironment: true});
        await page.mouse.up({button: 'middle'});
    })

    it('should behave in case of a different canvas scale and css units', async () => {
        await setupInfiniteCanvas(400, 400, undefined, undefined, Units.CSS)
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.move(120, 100)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.up({button: 'middle'});
    })

    async function setupInfiniteCanvas(
        canvasWidth: number | 'boundingclientrect',
        canvasHeight: number | 'boundingclientrect',
        greedyGestureHandling?: boolean,
        rotationEnabled?: boolean,
        units?: Units
    ): Promise<void>{
        infCanvas = await page.createCanvasElement({
            styleWidth: '100%',
            styleHeight: '100%',
            canvasWidth,
            canvasHeight,
        }).then(c => page.createInfiniteCanvas(c, {
            greedyGestureHandling,
            rotationEnabled,
            units
        }))
        await infCanvas.draw(d => d(ctx => {
            ctx.beginPath();
            ctx.moveToInfinityInDirection(-1, 0);
            ctx.lineTo(100, 100);
            ctx.lineToInfinityInDirection(1, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveToInfinityInDirection(0, -1);
            ctx.lineTo(100, 100);
            ctx.lineToInfinityInDirection(0, 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(200, 100, 25, 0, 2 * Math.PI);
            ctx.fill();
        }))
    }
})