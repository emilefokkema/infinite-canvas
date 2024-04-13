import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { JSHandle, Page } from 'puppeteer'
import type { InfiniteCanvasCtr, InfiniteCanvas, DrawEvent } from 'infinite-canvas'
import { getPage, getScreenshot, getResultAfter, InPageEventListener, EventListenerAdder, fromSource } from './utils'
import '../test-utils/expect-extensions'
import { ResizeEvent } from 'test-page-lib'
import { filter, firstValueFrom } from 'rxjs'

describe('given a page where the canvas is not attached yet and a drawing is made', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let detachHandle: JSHandle<{attach(): void, detach(): void}>
    let infCanvasHandle: JSHandle<InfiniteCanvas>
    let drawEventListener: InPageEventListener<DrawEvent>
    let canvasElResizeEventListener: InPageEventListener<ResizeEvent>
    let addEventListenerInPage: EventListenerAdder

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage } = await getPage());
        const fullHandle = await page.evaluateHandle(() => {
            const container = document.createElement('div')
            document.body.appendChild(container)
            const InfiniteCanvas: InfiniteCanvasCtr = window.TestPageLib.InfiniteCanvas;
            const canvasEl = document.createElement('canvas')
            const infCanvas = new InfiniteCanvas(canvasEl, {units: InfiniteCanvas.CANVAS_UNITS})
            const canvasResizeEvents = window.TestPageLib.getResizeEvents(canvasEl);
            infCanvas.getContext('2d').fillRect(0, 0, 10, 10)
            function attach(){
                container.appendChild(canvasEl)
            }
            function detach(){
                canvasEl.remove();
            }
            return {attach, detach, infCanvas, canvasResizeEvents}
        })
        infCanvasHandle = await fullHandle.evaluateHandle(h => h.infCanvas)
        drawEventListener = await addEventListenerInPage(infCanvasHandle, 'draw')
        canvasElResizeEventListener = await addEventListenerInPage(await fullHandle.evaluateHandle(h => h.canvasResizeEvents), 'resize')
        detachHandle = fullHandle
    })

    it('should draw as soon as the canvas is attached', async () => {
        await getResultAfter(() => detachHandle.evaluate(h => h.attach()), [() => drawEventListener.getNext()])
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'draw-after-reattach'})
    })

    it('should draw again when canvas is attached again', async () => {
        await getResultAfter(
            () => detachHandle.evaluate(h => h.detach()),
            [() => firstValueFrom(fromSource(canvasElResizeEventListener).pipe(filter(e => !e.positiveSize)))],
            {message: 'did not receive notifiation that canvas had no size anymore'})
        await getResultAfter(
            () => infCanvasHandle.evaluate(ic => ic.getContext('2d').fillRect(0, 40, 10, 10)),
            [() => drawEventListener.ensureNoNext(1000)])
        await getResultAfter(
            () => detachHandle.evaluate(h => h.attach()),
            [() => drawEventListener.getNext()],
            {message: 'did not receive a draw event', timeout: 5000})
        expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'draw-after-reattach2'})
    })

    afterAll(async () => {
        await cleanup();
    })
})

