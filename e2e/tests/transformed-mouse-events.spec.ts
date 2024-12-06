import { Observable, fromEvent, debounceTime, firstValueFrom } from 'rxjs';
import { describe, it, beforeAll, expect } from 'vitest'
import { SerializedDrawEvent } from './test-page/test-page-infinite-canvas';
import { RuntimeEventTarget } from '@runtime-event-target/test';
import { nextEvent } from './utils/next-event';

describe('after transforming', () => {
    let debouncedDrawn: Observable<SerializedDrawEvent>
    let infCanvasEvents: RuntimeEventTarget<unknown, {
        mousemove: {
            offsetX: number
            offsetY: number
            movementX: number
            movementY: number
        }
        wheel: {
            offsetX: number
            offsetY: number
            deltaX: number
        }
    }>

    beforeAll(async () => {
        const infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
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
        }))
        debouncedDrawn = fromEvent(infCanvas.eventTarget, 'draw').pipe(debounceTime(300))
        infCanvasEvents = await infCanvas.eventTarget.emitEvents({
            mousemove: {
                offsetX: true,
                offsetY: true,
                movementX: true,
                movementY: true
            },
            wheel: {
                offsetX: true,
                offsetY: true,
                deltaX: true
            }
        });
        await page.mouse.move(100, 100);
        const firstTouch = await page.touchscreen.touchStart(100, 100);
        const secondTouch = await page.touchscreen.touchStart(200, 100);
        await Promise.all([
            firstValueFrom(debouncedDrawn),
            secondTouch.move(300, 100)
        ])
        await secondTouch.end();
        await firstTouch.end();
    })

    it('should emit a mousemove event that is properly transformed', async () => {
        await Promise.all([
            nextEvent(infCanvasEvents, 'mousemove'),
            page.mouse.move(120, 120)
        ])
        const [{
            offsetX,
            offsetY,
            movementX,
            movementY
        }] = await Promise.all([
            nextEvent(infCanvasEvents, 'mousemove'),
            page.mouse.move(130, 130)
        ])
        expect(offsetX).toBeCloseTo(115);
        expect(offsetY).toBeCloseTo(115);
        expect(movementX).toBeCloseTo(5);
        expect(movementY).toBeCloseTo(5);
    })

    it('should emit a wheel event that is propertly transformed', async () => {
        const [{
            offsetX,
            offsetY,
            deltaX
        }] = await Promise.all([
            nextEvent(infCanvasEvents, 'wheel'),
            page.mouse.wheel({deltaY: 100 })
        ])
        expect(offsetX).toBeCloseTo(115);
        expect(offsetY).toBeCloseTo(115);
        expect(deltaX).toBeCloseTo(0);
    })
})