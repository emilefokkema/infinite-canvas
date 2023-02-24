import {expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import puppeteer from 'puppeteer';
import { TransformationRepresentation, TestPage, InfiniteCanvasProxy, MouseEventShape, EventListenerProxy, getResultAfter, DrawEvent, TransformationEvent, getNextInTurn, WheelEventShape } from 'e2e-test-page';

declare const __DELTAY_DISTORTION__: number;

function expectTransformationsClose(
    expected: TransformationRepresentation,
    actual: TransformationRepresentation){
        expect(actual.a).toBeCloseTo(expected.a)
        expect(actual.b).toBeCloseTo(expected.b)
        expect(actual.c).toBeCloseTo(expected.c)
        expect(actual.d).toBeCloseTo(expected.d)
        expect(actual.e).toBeCloseTo(expected.e)
        expect(actual.f).toBeCloseTo(expected.f)
}

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

describe('when the mouse interacts with the canvas', () => {
    let page: TestPage;
    let mouse: puppeteer.Mouse;
    let infCanvas: InfiniteCanvasProxy;
    let mouseDown: EventListenerProxy<MouseEventShape>;
    let mouseMove: EventListenerProxy<MouseEventShape>;
    let mouseUp: EventListenerProxy<MouseEventShape>;
    let pointerMove: EventListenerProxy<MouseEventShape>;
    let pointerEnter: EventListenerProxy<MouseEventShape>;
    let wheel: EventListenerProxy<WheelEventShape>;
    let click: EventListenerProxy<MouseEventShape>;
    let drawn: EventListenerProxy<DrawEvent>;
    let transformationStarted: EventListenerProxy<TransformationEvent>;
    let transformationChanged: EventListenerProxy<TransformationEvent>;
    let transformationEnded: EventListenerProxy<TransformationEvent>;

    beforeAll(async () => {
        page = await TestPage.create();
        infCanvas = await initializeInfiniteCanvas(page);
        mouseDown = await infCanvas.addMouseEventListener('mousedown');
        mouseMove = await infCanvas.addMouseEventListener('mousemove');
        mouseUp = await infCanvas.addMouseEventListener('mouseup');
        pointerMove = await infCanvas.addPointerEventListener('pointermove');
        pointerEnter = await infCanvas.addPointerEventListener('pointerenter');
        wheel = await infCanvas.addWheelEventListener();
        click = await infCanvas.addMouseEventListener('click');
        drawn = await infCanvas.addDrawEventListener();
        transformationStarted = await infCanvas.addTransformationEventListener('transformationstart');
        transformationChanged = await infCanvas.addTransformationEventListener('transformationchange');
        transformationEnded = await infCanvas.addTransformationEventListener('transformationend');
        mouse = page.getMouse();
    });

    afterAll(async () => {
        await page.close();
    });

    it('should emit the right pointerenter and mousedown events', async () => {
        const [{
            offsetX: pointerEnterOffsetX,
            offsetY: pointerEnterOffsetY,
        }] = await getResultAfter(() => mouse.move(100, 100), () => pointerEnter.getNext())
        expect(pointerEnterOffsetX).toBeCloseTo(100);
        expect(pointerEnterOffsetY).toBeCloseTo(100);

        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button,
            cancelable,
            nativeCancelable,
            isTrusted,
            bubbles,
            eventPhase,
            type }] = await getResultAfter(() => mouse.down({button: 'left'}), () => mouseDown.getNext());
        expect(offsetX).toBeCloseTo(100);
        expect(offsetY).toBeCloseTo(100);
        expect(clientX).toBeCloseTo(100);
        expect(clientY).toBeCloseTo(100);
        expect(ctrlKey).toBe(false);
        expect(button).toBe(0);
        expect(cancelable).toBe(true);
        expect(nativeCancelable).toBe(true);
        expect(isTrusted).toBe(false);
        expect(bubbles).toBe(false);
        expect(eventPhase).toBe(Event.AT_TARGET);
        expect(type).toBe('mousedown');
    });

    it('should not emit a mousemove or pointermove when transforming', async () => {
        await getResultAfter(() => mouse.move(200, 200),
            () => drawn.getNext(),
            () => mouseMove.ensureNoNext(300),
            () => pointerMove.ensureNoNext(300));
    });

    it('should emit the right mouseup event', async () => {
        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button,
            cancelable,
            nativeCancelable,
            type }] = await getResultAfter(() => mouse.up({button: 'left'}), () => mouseUp.getNext());
        expect(offsetX).toBeCloseTo(100);
        expect(offsetY).toBeCloseTo(100);
        expect(clientX).toBeCloseTo(200);
        expect(clientY).toBeCloseTo(200);
        expect(ctrlKey).toBe(false);
        expect(button).toBe(0);
        expect(cancelable).toBe(true);
        expect(nativeCancelable).toBe(true);
        expect(type).toBe('mouseup');
    });

    it('should emit the right mousemove and pointermove events', async () => {
        const [{
                offsetX: mouseMoveOffsetX,
                offsetY: mouseMoveOffsetY,
                clientX: mouseMoveClientX,
                clientY: mouseMoveClientY,
                ctrlKey: mouseMoveCtrlKey,
                type: mouseMoveType
            },
            {
                offsetX: pointerMoveOffsetX,
                offsetY: pointerMoveOffsetY,
                clientX: pointerMoveClientX,
                clientY: pointerMoveClientY,
                ctrlKey: pointerMoveCtrlKey,
                type: pointerMoveType
            }] = await getResultAfter(() => mouse.move(100, 100), () => mouseMove.getNext(), () => pointerMove.getNext());
        expect(mouseMoveOffsetX).toBeCloseTo(0);
        expect(mouseMoveOffsetY).toBeCloseTo(0);
        expect(mouseMoveClientX).toBeCloseTo(100);
        expect(mouseMoveClientY).toBeCloseTo(100);
        expect(mouseMoveCtrlKey).toBe(false);
        expect(mouseMoveType).toBe('mousemove');

        expect(pointerMoveOffsetX).toBeCloseTo(0);
        expect(pointerMoveOffsetY).toBeCloseTo(0);
        expect(pointerMoveClientX).toBeCloseTo(100);
        expect(pointerMoveClientY).toBeCloseTo(100);
        expect(pointerMoveCtrlKey).toBe(false);
        expect(pointerMoveType).toBe('pointermove');
    });

    it('should emit a mousedown for the right button', async () => {
        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button }] = await getResultAfter(() => mouse.down({button: 'right'}), () => mouseDown.getNext());
        expect(offsetX).toBeCloseTo(0);
        expect(offsetY).toBeCloseTo(0);
        expect(clientX).toBeCloseTo(100);
        expect(clientY).toBeCloseTo(100);
        expect(ctrlKey).toBe(false);
        expect(button).toBe(2);
        await mouse.up({button: 'right'});
    });

    it('should emit a click event', async () => {
        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button,
            type }] = await getResultAfter(() => mouse.click(100, 100), () => click.getNext());
        expect(offsetX).toBeCloseTo(0);
        expect(offsetY).toBeCloseTo(0);
        expect(clientX).toBeCloseTo(100);
        expect(clientY).toBeCloseTo(100);
        expect(button).toBe(0);
        expect(ctrlKey).toBe(false);
        expect(type).toBe('click');
    })

    it('should emit the right transformation events', async () => {
        await mouse.down({button: 'left'});
        const [[transformationStart, transformationChange, transformationEnd]] = await getResultAfter(
            () => mouse.move(200, 200),
            () => getNextInTurn(transformationStarted, transformationChanged, transformationEnded));
        let {transformation, inverseTransformation, type} = transformationStart;
        expectTransformationsClose({a: 1, b: 0, c: 0, d: 1, e: -200, f: -200}, transformation);
        expectTransformationsClose({a: 1, b: 0, c: 0, d: 1, e: 200, f: 200}, inverseTransformation);
        expect(type).toBe('transformationstart');
        ({transformation, inverseTransformation, type} = transformationChange);
        expectTransformationsClose({a: 1, b: 0, c: 0, d: 1, e: -200, f: -200}, transformation);
        expectTransformationsClose({a: 1, b: 0, c: 0, d: 1, e: 200, f: 200}, inverseTransformation);
        expect(type).toBe('transformationchange');
        ({transformation, inverseTransformation, type} = transformationEnd);
        expectTransformationsClose({a: 1, b: 0, c: 0, d: 1, e: -200, f: -200}, transformation);
        expectTransformationsClose({a: 1, b: 0, c: 0, d: 1, e: 200, f: 200}, inverseTransformation);
        expect(type).toBe('transformationend');
    });

    it('should emit the right wheel event', async () => {
        const initialDeltaY: number = 100;
        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button,
            deltaY,
            type }] = await getResultAfter(() => mouse.wheel({deltaY: initialDeltaY}), () => wheel.getNext());
        expect(offsetX).toBeCloseTo(0);
        expect(offsetY).toBeCloseTo(0);
        expect(clientX).toBeCloseTo(200);
        expect(clientY).toBeCloseTo(200);
        expect(button).toBe(0);
        expect(ctrlKey).toBe(false);
        expect(deltaY).toBeCloseTo(initialDeltaY * __DELTAY_DISTORTION__);
        expect(type).toBe('wheel');
    });
});
