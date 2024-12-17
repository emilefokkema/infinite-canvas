import { describe, it, afterEach } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { noEvent } from './utils/next-event'

describe('when propagation of a mousedown event is stopped on capture on the canvas element', () => {
    let infCanvas: TestPageInfiniteCanvas
    
    afterEach(async () => {
        await page.reload()
    })

    it('should prevent panning', async () => {
        const canvasEl = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400
        });
        const canvasElEvents = await page.createEventTarget<GlobalEventHandlersEventMap>(canvasEl).then(c => c.emitEvents({
            mousedown: {}
        }));
        await canvasElEvents.switchToCapture('mousedown');
        await canvasElEvents.handleEvents('mousedown', h => h(e => {
            e.stopPropagation();
        }))
        infCanvas = await page.createInfiniteCanvas(canvasEl);
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 200, 100);
        }))
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            noEvent(infCanvas.eventTarget, 'draw', 300),
            page.mouse.move(200, 200)
        ])
        await page.mouse.up({button: 'left'});
    })

    it('also when the handler that stops propagation is added after creation of InfiniteCanvas', async () => {
        const canvasEl = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400
        });
        infCanvas = await page.createInfiniteCanvas(canvasEl);
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 200, 100);
        }))
        const canvasElEvents = await page.createEventTarget<GlobalEventHandlersEventMap>(canvasEl).then(c => c.emitEvents({
            mousedown: {}
        }));
        await canvasElEvents.switchToCapture('mousedown');
        await canvasElEvents.handleEvents('mousedown', h => h(e => {
            e.stopPropagation();
        }))
        await page.mouse.move(150, 150);
        await page.mouse.down({button: 'left'});
        await Promise.all([
            noEvent(infCanvas.eventTarget, 'draw', 300),
            page.mouse.move(200, 200)
        ])
    })
})