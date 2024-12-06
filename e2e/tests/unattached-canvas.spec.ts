import { describe, it, beforeAll, expect } from 'vitest'
import { RuntimeEventTarget } from '@runtime-event-target/test';
import { EventMap, InfiniteCanvas } from 'api';
import { nextEvent, noEvent } from './utils/next-event';
import { JSHandle } from 'puppeteer';
import { DetachableCanvasElement } from '../test-page-app/api/detachable-canvas-element';
import { ResizeEvent } from '../test-page-app/api/resize-event';
import { Observable, filter, firstValueFrom, fromEvent } from 'rxjs';

describe('given a page where the canvas is not attached yet and a drawing is made', () => {
    let detachableCanvas: JSHandle<DetachableCanvasElement>
    let infCanvasEvents: RuntimeEventTarget<unknown, {
        draw: {}
    }>;
    let canvasResizeEvents: RuntimeEventTarget<unknown, {
        resize: ResizeEvent
    }>
    let infCanvas: JSHandle<InfiniteCanvas>

    beforeAll(async () => {
        detachableCanvas = await page.page.evaluateHandle(() => window.TestPageLib.createDetachableCanvasElement());
        infCanvas = await page.page.evaluateHandle(
            (detachableCanvas) => window.TestPageLib.createInfiniteCanvas(detachableCanvas.canvas),
            detachableCanvas
        );
        await infCanvas.evaluate(c => c.getContext('2d').fillRect(0, 0, 10, 10))
        infCanvasEvents = await page
            .createEventTarget<EventMap>(infCanvas)
            .then(t => t.emitEvents({draw: {}}))
        canvasResizeEvents = await page
            .createEventTarget<{resize: ResizeEvent}>(detachableCanvas)
            .then(t => t.emitEvents({resize: { positiveSize: true}}))

    })

    it('should draw as soon as the canvas is attached', async () => {
        await Promise.all([
            nextEvent(infCanvasEvents, 'draw'),
            detachableCanvas.evaluate(c => c.attach())
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'draw-after-reattach'})
    })

    it('should draw again when canvas is attached again', async () => {
        await Promise.all([
            firstValueFrom((fromEvent(canvasResizeEvents, 'resize') as Observable<ResizeEvent>).pipe(filter(e => !e.positiveSize))),
            detachableCanvas.evaluate(c => c.detach())
        ])
        await Promise.all([
            noEvent(infCanvasEvents, 'draw', 1000),
            infCanvas.evaluate(c => c.getContext('2d').fillRect(0, 40, 10, 10))
        ])
        await Promise.all([
            nextEvent(infCanvasEvents, 'draw'),
            detachableCanvas.evaluate(c => c.attach())
        ])
        expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'draw-after-reattach2'})
    })
})