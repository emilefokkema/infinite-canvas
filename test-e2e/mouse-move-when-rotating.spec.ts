import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page, JSHandle } from 'puppeteer'
import { getPage, getResultAfter, type InPageEventListener, type EventListenerAdder } from './utils'
import type { InfiniteCanvas } from 'infinite-canvas'

describe('when the mouse interacts with the canvas', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let infCanvas: JSHandle<InfiniteCanvas>;
    let mouseMoved: InPageEventListener<MouseEvent>

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage} = await getPage());
        infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 200, 100);
            }
        }))
        mouseMoved = await addEventListenerInPage(infCanvas, 'mousemove');
    })

    it('should emit a mousemove when rotating with the mouse', async () => {
        const mouse = page.mouse;
        await getResultAfter(async () => await mouse.move(100, 100), () => mouseMoved.getNext())
        await mouse.down({button: 'middle'});
        const [{offsetX, offsetY, movementX, movementY}] = await getResultAfter(async () => {
            // A horizontal difference of 50 leads to a rotation of 90 degrees, cf src/transformer/rotate.ts
            await mouse.move(150, 100)
        }, () => mouseMoved.getNext());
        expect(offsetX).toBeCloseTo(100);
        expect(offsetY).toBeCloseTo(150);
        expect(movementX).toBeCloseTo(0);
        expect(movementY).toBeCloseTo(50);
    })

    afterAll(async () => {
        await cleanup();
    })
})