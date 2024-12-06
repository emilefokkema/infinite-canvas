import { describe, it, beforeAll } from 'vitest'
import { RuntimeEventTarget } from '@runtime-event-target/test'
import { nextEvent } from './utils/next-event'

describe('when we add an event listener for a non-pointer-related event', () => {
    let infCanvasEvents: RuntimeEventTarget<unknown, {
        transitionstart: {}
    }>

    beforeAll(async () => {
        const infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 200, 100);
        }))
        const styleText = `canvas{
            border:1px solid #000;
            transition-property:border-bottom-color;
            transition-duration:1s;
        }
        canvas:hover{
            border-bottom-color:#f00;
        }`;
        await page.page.evaluate((styleText) => {
            const el = document.createElement('style');
            document.head.appendChild(el);
            el.innerHTML = styleText;
        }, styleText);
        infCanvasEvents = await infCanvas.eventTarget.emitEvents({
            transitionstart: {}
        })
    })

    it('should emit a transitionstarted event', async () => {
        await Promise.all([
            nextEvent(infCanvasEvents, 'transitionstart'),
            page.mouse.move(100,100)
        ])
    })
})