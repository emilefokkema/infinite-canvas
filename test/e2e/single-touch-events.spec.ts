import { TestPage, InfiniteCanvasProxy, EventListenerProxy, TouchEventShape, getResultAfter, TouchCollection, Touch as TouchCollectionTouch } from "e2e-test-page";

function initializeInfiniteCanvas(page: TestPage): Promise<InfiniteCanvasProxy>{
    return page.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        drawing: (ctx: any) => {
            ctx.fillRect(100, 100, 200, 100);
        }
    });
}

describe('when the canvas is touched', () => {
    let page: TestPage;
    let touchCollection: TouchCollection;
    let firstTouch: TouchCollectionTouch;
    let touchStarted: EventListenerProxy<TouchEventShape>;
    let touchMoved: EventListenerProxy<TouchEventShape>;
    let touchEnded: EventListenerProxy<TouchEventShape>;

    beforeAll(async () => {
        page = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(page);
        touchStarted = await infCanvas.addTouchEventListener('touchstart');
        touchMoved = await infCanvas.addTouchEventListener('touchmove');
        touchEnded = await infCanvas.addTouchEventListener('touchend');
        touchCollection = await page.getTouchCollection();
    });

    it('should dispatch a touchstart event', async () => {
        const [touchEvent] = await getResultAfter(async () => {
            firstTouch = await touchCollection.start(120, 100)
        }, () => touchStarted.getNext())
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
        const [touchEvent] = await getResultAfter(() => firstTouch.move(100, 100), () => touchMoved.getNext());
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
        const [touchEvent] = await getResultAfter(() => firstTouch.end(), () => touchEnded.getNext());
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
        await page.close();
    });
});