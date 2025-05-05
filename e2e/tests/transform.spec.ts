import { describe, it, beforeAll, afterAll, afterEach, beforeEach, expect } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { nextEvent, noEvent } from './utils/next-event';
import { fromEvent, debounceTime, firstValueFrom, from } from 'rxjs';

async function initializeInfiniteCanvas(
    greedyGestureHandling?: boolean,
    rotationEnabled?: boolean): Promise<TestPageInfiniteCanvas>{
        const result = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
        }).then(c => page.createInfiniteCanvas(c, {
            greedyGestureHandling,
            rotationEnabled
        }))
        await result.draw(d => d(ctx => {
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
        return result;
}
describe('when transforming', () => {
    let infCanvas: TestPageInfiniteCanvas

    afterEach(async () => {
        await page.reload();
    })

    it('should pan', async () => {
        infCanvas = await initializeInfiniteCanvas();
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.move(150, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await page.mouse.up({button: 'left'});
        await Promise.all([
            noEvent(infCanvas.eventTarget, 'draw', 500),
            page.mouse.move(200, 200)
        ])
    })

    it('should stop panning when mouse leaves canvas', async () => {
        infCanvas = await initializeInfiniteCanvas();
        await page.mouse.move(300, 50);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.move(350, 50)
        ])
        await Promise.all([
            noEvent(infCanvas.eventTarget, 'draw', 500),
            page.mouse.move(450, 50)
        ])
        await Promise.all([
            noEvent(infCanvas.eventTarget, 'draw', 500),
            page.mouse.move(300, 50)
        ])
        await page.mouse.up({button: 'left'});
    })

    it('should rotate', async () => {
        infCanvas = await initializeInfiniteCanvas();
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.move(125, 100)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom()
        await page.mouse.up({button: 'middle'})
        await Promise.all([
            noEvent(infCanvas.eventTarget, 'draw', 500),
            page.mouse.move(150, 100)
        ])
    })

    it('should zoom on wheel with control key', async () => {
        infCanvas = await initializeInfiniteCanvas();
        await page.mouse.move(100, 100);
        await page.keyboard.down('ControlLeft');
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            page.mouse.wheel({deltaX: 0, deltaY: -75 })
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        expect(await page.page.evaluate(() => window.scrollY)).toEqual(0);
        await page.keyboard.up('ControlLeft');
    })

    it('should not zoom on only wheel', async () => {
        infCanvas = await initializeInfiniteCanvas();
        const windowHandle = await page.page.evaluateHandle(() => window);
        const windowEvents = await page
            .createEventTargetHandle<GlobalEventHandlersEventMap>(windowHandle)
            .then(e => e.emitEvents({scroll: {}}))
        const scrolled = fromEvent(windowEvents, 'scroll').pipe(debounceTime(300));
        await page.mouse.move(100, 100);
        const deltaY: number = 80;
        await Promise.all([
            firstValueFrom(scrolled),
            page.mouse.wheel({deltaX: 0, deltaY})
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        expect(await page.page.evaluate(() => window.scrollY)).toEqual(deltaY);
        await page.page.evaluate(() => window.scrollTo(0, 0))
    })

    it('should zoom on only wheel with greedyGestureHandling', async () => {
        infCanvas = await initializeInfiniteCanvas(true);
        const debouncedDrawn = fromEvent(infCanvas.eventTarget, 'draw').pipe(debounceTime(300));
        await page.mouse.move(100, 100);
        await Promise.all([
            firstValueFrom(debouncedDrawn),
            page.mouse.wheel({deltaX: 0, deltaY: -75 })
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        expect(await page.page.evaluate(() => window.scrollY)).toEqual(0);
    })

    it('should not rotate', async () => {
        infCanvas = await initializeInfiniteCanvas(undefined, false);
        await page.mouse.move(100, 100);
        await page.mouse.down({button: 'middle'});
        await Promise.all([
            noEvent(infCanvas.eventTarget, 'draw', 300),
            page.mouse.move(125, 100)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
    })

    it('should pan on single moving touch if greedy gesture handling enabled', async () => {
        infCanvas = await initializeInfiniteCanvas(true);
        const touch = await page.touchscreen.touchStart(100, 100);
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch.move(150, 150)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch.end();
    })

    it('should not pan on single moving touch if greedy gesture handling not enabled', async () => {
        infCanvas = await initializeInfiniteCanvas();
        const touch = await page.touchscreen.touchStart(200, 200);
        await Promise.all([
            noEvent(infCanvas.eventTarget, 'draw', 300),
            touch.move(200, 100)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch.end();
        expect(await page.page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
        await page.page.evaluate(() => window.scrollTo(0, 0))
    })

    it('should zoom and rotate', async () => {
        infCanvas = await initializeInfiniteCanvas();
        const touch1 = await page.touchscreen.touchStart(100, 100);
        const touch2 = await page.touchscreen.touchStart(200, 100);
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch2.move(200, 200)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch1.move(100, 0)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch1.end();
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch2.move(150, 200)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch2.end();
    })

    it('should zoom but not rotate on two touches if rotation not enabled', async () => {
        infCanvas = await initializeInfiniteCanvas(undefined, false);
        const touch1 = await page.touchscreen.touchStart(100, 100);
        const touch2 = await page.touchscreen.touchStart(200, 100);
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch2.move(200, 200)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch1.end();
        await Promise.all([
            nextEvent(infCanvas.eventTarget, 'draw'),
            touch2.move(100, 200)
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom();
        await touch2.end();
    })
})