import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import type { InfiniteCanvasTouchEvent } from 'infinite-canvas'
import { 
    getTouchCollection,
    getPage,
    getResultAfter,
    type InPageEventListener,
    type EventListenerAdder,
    type TouchCollection,
    type Touch
} from './utils'

describe('when the canvas is touched', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let touchCollection: TouchCollection;
    let firstTouch: Touch;
    let touchStarted: InPageEventListener<InfiniteCanvasTouchEvent>
    let touchMoved: InPageEventListener<InfiniteCanvasTouchEvent>
    let touchEnded: InPageEventListener<InfiniteCanvasTouchEvent>

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage} = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 200, 100);
            }
        }))
        touchStarted = await addEventListenerInPage(infCanvas, 'touchstart');
        touchMoved = await addEventListenerInPage(infCanvas, 'touchmove');
        touchEnded = await addEventListenerInPage(infCanvas, 'touchend');
        touchCollection = await getTouchCollection(page);
    })

    it('should dispatch a touchstart event', async () => {
        const [touchEvent] = await getResultAfter(async () => {
            firstTouch = await touchCollection.start(120, 100)
        }, [() => touchStarted.getNext()])
        expect(touchEvent.touches.length).toBe(1)
        expect(touchEvent.targetTouches.length).toBe(1)
        expect(touchEvent.changedTouches.length).toBe(1)
        const  [{infiniteCanvasX, infiniteCanvasY, radiusX, radiusY, rotationAngle, identifier}] = touchEvent.changedTouches;
        expect(infiniteCanvasX).toBeCloseTo(120);
        expect(infiniteCanvasY).toBeCloseTo(100);
        expect(radiusX).toBeCloseTo(1);
        expect(radiusY).toBeCloseTo(1);
        expect(rotationAngle).toBeCloseTo(0);
        expect(identifier).toBe(0);
        const [{identifier: touchIdentifier}] = touchEvent.touches;
        expect(touchIdentifier).toBe(0)
        const [{identifier: changedTouchIdentifier}] = touchEvent.targetTouches;
        expect(changedTouchIdentifier).toBe(0)
    });

    it('should dispatch a touchmove event', async () => {
        const [touchEvent] = await getResultAfter(() => firstTouch.move(100, 100), [() => touchMoved.getNext()]);
        expect(touchEvent.touches.length).toBe(1)
        expect(touchEvent.targetTouches.length).toBe(1)
        expect(touchEvent.changedTouches.length).toBe(1)
        const  [{infiniteCanvasX, infiniteCanvasY, radiusX, radiusY, rotationAngle, identifier}] = touchEvent.changedTouches;
        expect(infiniteCanvasX).toBeCloseTo(100);
        expect(infiniteCanvasY).toBeCloseTo(100);
        expect(radiusX).toBeCloseTo(1);
        expect(radiusY).toBeCloseTo(1);
        expect(rotationAngle).toBeCloseTo(0);
        expect(identifier).toBe(0);
        const [{identifier: touchIdentifier}] = touchEvent.touches;
        expect(touchIdentifier).toBe(0)
        const [{identifier: changedTouchIdentifier}] = touchEvent.targetTouches;
        expect(changedTouchIdentifier).toBe(0)
    });

    it('should dispatch a touchend event', async () => {
        const [touchEvent] = await getResultAfter(() => firstTouch.end(), [() => touchEnded.getNext()]);
        expect(touchEvent.touches.length).toBe(0)
        expect(touchEvent.targetTouches.length).toBe(0)
        expect(touchEvent.changedTouches.length).toBe(1)
        const [{
            infiniteCanvasX: changedTouchInfiniteCanvasX,
            infiniteCanvasY: changedTouchInfiniteCanvasY,
            radiusX: changedTouchRadiusX,
            radiusY: changedTouchRadiusY,
            rotationAngle: changedTouchRotationAngle
        }] = touchEvent.changedTouches;
        expect(changedTouchInfiniteCanvasX).toBeCloseTo(100);
        expect(changedTouchInfiniteCanvasY).toBeCloseTo(100);
        expect(changedTouchRadiusX).toBeCloseTo(1);
        expect(changedTouchRadiusY).toBeCloseTo(1);
        expect(changedTouchRotationAngle).toBeCloseTo(0);
    });

    afterAll(async () => {
        await touchStarted.remove();
        await touchMoved.remove();
        await touchEnded.remove();
        await cleanup();
    })
})