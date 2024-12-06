import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import { debounceTime, firstValueFrom, type MonoTypeOperatorFunction, type Observable } from 'rxjs'
import { 
    getPage,
    getResultAfter,
    fromSource,
    getTouchCollection,
    type EventListenerAdder,
    type InPageEventListener
} from './utils'
import '../test-utils/expect-extensions'
import type { DrawEvent } from 'infinite-canvas'

describe('after transforming', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let drawn: InPageEventListener<DrawEvent>;
    let debouncedDrawn: Observable<DrawEvent>
    let mouseMoved: InPageEventListener<MouseEvent>;
    let wheeled: InPageEventListener<WheelEvent>

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage } = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
            drawing: (ctx: any) => {
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
            }
        }))
        drawn = await addEventListenerInPage(infCanvas, 'draw')
        debouncedDrawn = fromSource(drawn).pipe(<MonoTypeOperatorFunction<DrawEvent>>debounceTime(300))
        mouseMoved = await addEventListenerInPage(infCanvas, 'mousemove')
        wheeled = await addEventListenerInPage(infCanvas, 'wheel')
        await page.mouse.move(100, 100);
        const touchCollection = await getTouchCollection(page);
        const firstTouch = await touchCollection.start(100, 100)
        const secondTouch = await touchCollection.start(200, 100);
        await getResultAfter(async () => {
            await secondTouch.move(300, 100);
        }, [() => firstValueFrom(debouncedDrawn)])
        await secondTouch.end();
        await firstTouch.end();
    })

    it('should emit a mousemove event that is properly transformed', async () => {
        await getResultAfter(() => page.mouse.move(120, 120), [() => mouseMoved.getNext()]);
        const [{
            offsetX,
            offsetY,
            movementX,
            movementY }] = await getResultAfter(() => page.mouse.move(130, 130), [() => mouseMoved.getNext()]);
        expect(offsetX).toBeCloseTo(115);
        expect(offsetY).toBeCloseTo(115);
        expect(movementX).toBeCloseTo(5);
        expect(movementY).toBeCloseTo(5);
    });

    it('should emit a wheel event that is propertly transformed', async () => {
        const [{
            offsetX,
            offsetY,
            deltaX }] = await getResultAfter(() => page.mouse.wheel({deltaY: 100 }), [() => wheeled.getNext()]);
        expect(offsetX).toBeCloseTo(115);
        expect(offsetY).toBeCloseTo(115);
        expect(deltaX).toBeCloseTo(0);
    });

    afterAll(async () => {
        await drawn.remove();
        await mouseMoved.remove();
        await wheeled.remove();
        await cleanup();
    })
})