import { describe, it, beforeAll, afterAll } from 'vitest'
import { JSHandle, type Page } from 'puppeteer'
import { getPage, getResultAfter, type EventListenerAdder } from './utils'
import type { CanvasElementWrapper } from 'test-page-lib'
import type { InfiniteCanvas } from 'infinite-canvas'

describe('when we transform the canvas', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let canvasHandle: JSHandle<CanvasElementWrapper>;
    let infCanvasHandle: JSHandle<InfiniteCanvas>

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage} = await getPage());
        await page.setDragInterception(true);
        canvasHandle = await page.evaluateHandle(() => window.TestPageLib.initializeCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400
        }));
        infCanvasHandle = await canvasHandle.evaluateHandle((canvasWrapper) => canvasWrapper.initializeInfiniteCanvas({
            drawing: (ctx) => {
                ctx.fillRect(100, 100, 200, 100);
            }
        }));
        const drawn = await addEventListenerInPage(infCanvasHandle, 'draw');
        const mouse = page.mouse;
        await mouse.move(100, 100);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(150, 100), [() => drawn.getNext()]);
        await mouse.up({button: 'left'})

    })

    describe('and we start to drag', () => {

        beforeAll(async () => {
            await canvasHandle.evaluate(canvasWrapper => canvasWrapper.canvasEl.setAttribute('draggable', 'true'))
        });

        it('should emit a dragstart event', async () => {
            const dragStartEv = await addEventListenerInPage(infCanvasHandle, 'dragstart');
            await getResultAfter(async () => {
                await page.mouse.drag({x: 150, y: 100}, {x: 150, y: 150})
             }, [() => dragStartEv.getNext()]);
        })
    })

    afterAll(async () => {
        await cleanup();
    })
})