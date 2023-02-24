import {expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import { TestPage, InfiniteCanvasProxy, EventListenerProxy, TouchEventShape, getResultAfter, DrawEvent, TouchCollection, Touch as TouchCollectionTouch } from "e2e-test-page";

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
    let secondTouch: TouchCollectionTouch;
    let touchStarted: EventListenerProxy<TouchEventShape>;
    let touchMoved: EventListenerProxy<TouchEventShape>;
    let touchEnded: EventListenerProxy<TouchEventShape>;
    let drawn: EventListenerProxy<DrawEvent>;

    beforeAll(async () => {
        page = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(page);
        drawn = await infCanvas.addDrawEventListener();
        touchStarted = await infCanvas.addTouchEventListener('touchstart');
        touchMoved = await infCanvas.addTouchEventListener('touchmove');
        touchEnded = await infCanvas.addTouchEventListener('touchend');
        touchCollection = await page.getTouchCollection();
    });

    it('should dispatch a touchstart event', async () => {
        const [touchEvent] = await getResultAfter(async () => {
            firstTouch = await touchCollection.start(100, 100)
        }, () => touchStarted.getNext())
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

    it('should dispatch another touchstart event', async () => {
        const [touchEvent] = await getResultAfter(async () => {
            secondTouch = await touchCollection.start(200, 100)
        }, () => touchStarted.getNext())
        expect(touchEvent.touches.length).toBe(2)
        expect(touchEvent.targetTouches.length).toBe(2)
        expect(touchEvent.changedTouches.length).toBe(1)
        const  [{infiniteCanvasX, infiniteCanvasY, radiusX, radiusY, rotationAngle, identifier}] = touchEvent.changedTouches;
        expect(infiniteCanvasX).toBeCloseTo(200);
        expect(infiniteCanvasY).toBeCloseTo(100);
        expect(radiusX).toBeCloseTo(1);
        expect(radiusY).toBeCloseTo(1);
        expect(rotationAngle).toBeCloseTo(0);
        expect(identifier).toBe(1);
        const [{identifier: firstTouchIdentifier}, {identifier: secondTouchIdentifier}] = touchEvent.touches;
        expect(firstTouchIdentifier).toBe(0)
        expect(secondTouchIdentifier).toBe(1)
        const [{identifier: firstTargetTouchIdentifier}, {identifier: secondTargetTouchIdentifier}] = touchEvent.targetTouches;
        expect(firstTargetTouchIdentifier).toBe(0)
        expect(secondTargetTouchIdentifier).toBe(1)
    });

    it('should not dispatch a touchmove event', async () => {
        await getResultAfter(() => firstTouch.move(100, 200), () => drawn.getNext(), () => touchMoved.ensureNoNext(300));
    });

    it('should dispatch a touchend event', async () => {
        const [touchEvent] = await getResultAfter(() => firstTouch.end(), () => touchEnded.getNext());
        expect(touchEvent.touches.length).toBe(1)
        expect(touchEvent.targetTouches.length).toBe(1)
        expect(touchEvent.changedTouches.length).toBe(1)
        const [{
            infiniteCanvasX: changedTouchInfiniteCanvasX,
            infiniteCanvasY: changedTouchInfiniteCanvasY,
            radiusX: changedTouchRadiusX,
            radiusY: changedTouchRadiusY,
            rotationAngle: changedTouchRotationAngle,
            identifier: changedTouchIdentifier
        }] = touchEvent.changedTouches;
        expect(changedTouchInfiniteCanvasX).toBeCloseTo(100);
        expect(changedTouchInfiniteCanvasY).toBeCloseTo(100);
        expect(changedTouchRadiusX).toBeCloseTo(1 / Math.sqrt(2));
        expect(changedTouchRadiusY).toBeCloseTo(1 / Math.sqrt(2));
        expect(changedTouchRotationAngle).toBeCloseTo(Math.PI / 4);
        const [{
            infiniteCanvasX: targetTouchInfiniteCanvasX,
            infiniteCanvasY: targetTouchInfiniteCanvasY,
            radiusX: targetTouchRadiusX,
            radiusY: targetTouchRadiusY,
            rotationAngle: targetTouchRotationAngle,
            identifier: targetTouchIdentifier
        }] = touchEvent.targetTouches;
        expect(targetTouchInfiniteCanvasX).toBeCloseTo(200);
        expect(targetTouchInfiniteCanvasY).toBeCloseTo(100);
        expect(targetTouchRadiusX).toBeCloseTo(1 / Math.sqrt(2));
        expect(targetTouchRadiusY).toBeCloseTo(1 / Math.sqrt(2));
        expect(targetTouchRotationAngle).toBeCloseTo(Math.PI / 4);
        expect(changedTouchIdentifier).not.toBe(targetTouchIdentifier);
        const [{identifier: touchIdentifier}] = touchEvent.touches;
        expect(touchIdentifier).toBe(targetTouchIdentifier);
    });

    it('should dispatch another touchend event', async () => {
        const [touchEvent] = await getResultAfter(() => secondTouch.end(), () => touchEnded.getNext());
        expect(touchEvent.touches.length).toBe(0)
        expect(touchEvent.targetTouches.length).toBe(0)
        expect(touchEvent.changedTouches.length).toBe(1);
        const [{
            infiniteCanvasX: changedTouchInfiniteCanvasX,
            infiniteCanvasY: changedTouchInfiniteCanvasY,
            radiusX: changedTouchRadiusX,
            radiusY: changedTouchRadiusY,
            rotationAngle: changedTouchRotationAngle
        }] = touchEvent.changedTouches;
        expect(changedTouchInfiniteCanvasX).toBeCloseTo(200);
        expect(changedTouchInfiniteCanvasY).toBeCloseTo(100);
        expect(changedTouchRadiusX).toBeCloseTo(1 / Math.sqrt(2));
        expect(changedTouchRadiusY).toBeCloseTo(1 / Math.sqrt(2));
        expect(changedTouchRotationAngle).toBeCloseTo(Math.PI / 4);
    });

    afterAll(async () => {
        await page.close();
    });
});