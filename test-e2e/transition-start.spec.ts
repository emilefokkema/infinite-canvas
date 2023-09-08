import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import { debounceTime, firstValueFrom, type MonoTypeOperatorFunction, type Observable } from 'rxjs'
import { 
    getPage,
    getResultAfter,
    fromSource,
    type EventListenerAdder,
    type InPageEventListener
} from './utils'
import '../test-utils/expect-extensions'
import type { DrawEvent } from 'infinite-canvas'

describe('when we add an event listener for a non-pointer-related event', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let transitionStarted: InPageEventListener<Event>;

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage } = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 200, 100);
            }
        }))
        const styleText = `canvas{
            border:1px solid #000;
            transition-property:border-bottom-color;
            transition-duration:1s;
        }
        canvas:hover{
            border-bottom-color:#f00;
        }`;
        await page.evaluate((styleText) => {
            const el = document.createElement('style');
            document.head.appendChild(el);
            el.innerHTML = styleText;
        }, styleText)
        transitionStarted = await addEventListenerInPage(infCanvas, 'transitionstart')
    })

    it('should emit a transitionstarted event', async () => {
        await getResultAfter(() => page.mouse.move(100,100), () => transitionStarted.getNext());
    });

    afterAll(async () => {
        await cleanup();
    })
})