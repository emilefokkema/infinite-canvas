import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { getPage, getResultAfter, type InPageEventListener, getNextInTurn, type EventListenerAdder } from './utils'
import type { InfiniteCanvas, InfiniteCanvasEventWithDefaultBehavior, TransformationEvent } from 'infinite-canvas'
import type { Page, JSHandle } from 'puppeteer'
import '../test-utils/expect-extensions'

describe('when the mouse interacts with the canvas', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let infCanvas: JSHandle<InfiniteCanvas>;

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
    })

    it('should emit the right pointerenter and mousedown events', async () => {
        const pointerEnter: InPageEventListener<PointerEvent> = await addEventListenerInPage(infCanvas, 'pointerenter')
        const [{
            offsetX: pointerEnterOffsetX,
            offsetY: pointerEnterOffsetY,
        }] = await getResultAfter(() => page.mouse.move(100, 100), [() => pointerEnter.getNext()]);
        expect(pointerEnterOffsetX).toBeCloseTo(100);
        expect(pointerEnterOffsetY).toBeCloseTo(100);

        const mouseDown: InPageEventListener<MouseEvent & InfiniteCanvasEventWithDefaultBehavior> = await addEventListenerInPage(infCanvas, 'mousedown')
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
            type }] = await getResultAfter(() => page.mouse.down({button: 'left'}), [() => mouseDown.getNext()]);
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
        
        await pointerEnter.remove();
        await mouseDown.remove();
    })

    it('should not emit a mousemove or pointermove when transforming', async () => {
        const drawn = await addEventListenerInPage(infCanvas, 'draw')
        const mouseMove = await addEventListenerInPage(infCanvas, 'mousemove')
        const pointerMove = await addEventListenerInPage(infCanvas, 'pointermove')
        await getResultAfter(() => page.mouse.move(200, 200),
            [() => drawn.getNext(),
            () => mouseMove.ensureNoNext(300),
            () => pointerMove.ensureNoNext(300)]);
        await pointerMove.remove();
        await mouseMove.remove();
        await drawn.remove();
    });

    it('should emit the right mouseup event', async () => {
        const mouseUp: InPageEventListener<MouseEvent> = await addEventListenerInPage(infCanvas, 'mouseup')
        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button,
            cancelable,
            type }] = await getResultAfter(() => page.mouse.up({button: 'left'}), [() => mouseUp.getNext()]);
        expect(offsetX).toBeCloseTo(100);
        expect(offsetY).toBeCloseTo(100);
        expect(clientX).toBeCloseTo(200);
        expect(clientY).toBeCloseTo(200);
        expect(ctrlKey).toBe(false);
        expect(button).toBe(0);
        expect(cancelable).toBe(true);
        expect(type).toBe('mouseup');

        await mouseUp.remove();
    });

    it('should emit the right mousemove and pointermove events', async () => {
        const mouseMove: InPageEventListener<MouseEvent> = await addEventListenerInPage(infCanvas, 'mousemove');
        const pointerMove: InPageEventListener<PointerEvent> = await addEventListenerInPage(infCanvas, 'pointermove');
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
            }] = await getResultAfter(() => page.mouse.move(100, 100), [() => mouseMove.getNext(), () => pointerMove.getNext()] as const);
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

        await mouseMove.remove();
        await pointerMove.remove();
    });

    it('should emit a mousedown for the right button', async () => {
        const mouseDown: InPageEventListener<MouseEvent> = await addEventListenerInPage(infCanvas, 'mousedown')
        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button }] = await getResultAfter(() => page.mouse.down({button: 'right'}), [() => mouseDown.getNext()]);
        expect(offsetX).toBeCloseTo(0);
        expect(offsetY).toBeCloseTo(0);
        expect(clientX).toBeCloseTo(100);
        expect(clientY).toBeCloseTo(100);
        expect(ctrlKey).toBe(false);
        expect(button).toBe(2);
        await page.mouse.up({button: 'right'});

        await mouseDown.remove();
    });

    it('should emit a click event', async () => {
        const click: InPageEventListener<MouseEvent> = await addEventListenerInPage(infCanvas, 'click');
        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button,
            type }] = await getResultAfter(() => page.mouse.click(100, 100), [() => click.getNext()]);
        expect(offsetX).toBeCloseTo(0);
        expect(offsetY).toBeCloseTo(0);
        expect(clientX).toBeCloseTo(100);
        expect(clientY).toBeCloseTo(100);
        expect(button).toBe(0);
        expect(ctrlKey).toBe(false);
        expect(type).toBe('click');

        await click.remove();
    })

    it('should emit the right transformation events', async () => {
        await page.mouse.down({button: 'left'});
        const transformationStarted: InPageEventListener<TransformationEvent> = await addEventListenerInPage(infCanvas, 'transformationstart');
        const transformationChanged: InPageEventListener<TransformationEvent> = await addEventListenerInPage(infCanvas, 'transformationchange');
        const transformationEnded: InPageEventListener<TransformationEvent> = await addEventListenerInPage(infCanvas, 'transformationend');
        const [[transformationStart, transformationChange, transformationEnd]] = await getResultAfter(
            () => page.mouse.move(200, 200),
            [() => getNextInTurn(transformationStarted, transformationChanged, transformationEnded)]);
        let {transformation, inverseTransformation, type} = transformationStart;
        expect(transformation).toBeCloseToTransformation({a: 1, b: 0, c: 0, d: 1, e: -200, f: -200})
        expect(inverseTransformation).toBeCloseToTransformation({a: 1, b: 0, c: 0, d: 1, e: 200, f: 200})
        expect(type).toBe('transformationstart');
        ({transformation, inverseTransformation, type} = transformationChange);
        expect(transformation).toBeCloseToTransformation({a: 1, b: 0, c: 0, d: 1, e: -200, f: -200})
        expect(inverseTransformation).toBeCloseToTransformation({a: 1, b: 0, c: 0, d: 1, e: 200, f: 200})
        expect(type).toBe('transformationchange');
        ({transformation, inverseTransformation, type} = transformationEnd);
        expect(transformation).toBeCloseToTransformation({a: 1, b: 0, c: 0, d: 1, e: -200, f: -200})
        expect(inverseTransformation).toBeCloseToTransformation({a: 1, b: 0, c: 0, d: 1, e: 200, f: 200})
        expect(type).toBe('transformationend');

        await transformationEnded.remove();
        await transformationChanged.remove();
        await transformationStarted.remove();
    });

    it('should emit the right wheel event', async () => {
        const initialDeltaY: number = 100;
        const wheel: InPageEventListener<WheelEvent> = await addEventListenerInPage(infCanvas, 'wheel');
        const [{
            offsetX,
            offsetY,
            clientX,
            clientY,
            ctrlKey,
            button,
            type }] = await getResultAfter(() => page.mouse.wheel({deltaY: initialDeltaY}), [() => wheel.getNext()]);
        expect(offsetX).toBeCloseTo(0);
        expect(offsetY).toBeCloseTo(0);
        expect(clientX).toBeCloseTo(200);
        expect(clientY).toBeCloseTo(200);
        expect(button).toBe(0);
        expect(ctrlKey).toBe(false);
        expect(type).toBe('wheel');

        await wheel.remove();
    });

    afterAll(async () => {
        await cleanup();
    })
})