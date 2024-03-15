import { describe, it, beforeAll, afterAll } from 'vitest'
import type { JSHandle, Page } from 'puppeteer'
import { 
    getPage,
    getResultAfter,
    waitForConsoleMessage,
    ensureNoConsoleMessage,
    type EventListenerAdder,
    type InPageEventListener
} from './utils'
import { InfiniteCanvas } from 'infinite-canvas';

describe('without greedy gesture handling', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let infCanvas: JSHandle<InfiniteCanvas>

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage } = await getPage());
        infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 50, 50);
            }
        }))
    })

    it('should display a console warning', async () => {
        await page.mouse.move(100, 100);
        await getResultAfter(async () => {
            await page.mouse.wheel({deltaY: 50});
        }, [() => waitForConsoleMessage(page, m => m.type() === 'warning' && m.text() === 'use ctrl + scroll to zoom')])
    });

    it('should not display a console warning if zooming occurs', async () => {
        await page.mouse.move(100, 100);
        await page.keyboard.down('ControlLeft');
        await getResultAfter(async () => {
            await page.mouse.wheel({deltaY: 50});
        }, [() => ensureNoConsoleMessage(page, m => m.type() === 'warning', 1000)])
        await page.keyboard.up('ControlLeft');
    });

    describe('and default for wheelignored is cancelled', () => {
        let wheelIgnored: InPageEventListener<Event>;
        
        beforeAll(async () => {
            wheelIgnored = await addEventListenerInPage(infCanvas, 'wheelignored')
            await wheelIgnored.modify(l => l.setHandler(ev => ev.preventDefault()))
        })

        it('should not display a console warning', async () => {
            await page.mouse.move(100, 100);
            await getResultAfter(async () => {
                await page.mouse.wheel({deltaY: 50});
            }, [() => ensureNoConsoleMessage(page, m => m.type() === 'warning', 1000)])
        });

        afterAll(async () => {
            await wheelIgnored.remove();
        })
    });

    afterAll(async () => {
        await cleanup();
    })
})

describe('without greedy gesture handling and when wheel is default-prevented', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage } = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 50, 50);
            }
        }))
        const wheel: InPageEventListener<Event> = await addEventListenerInPage(infCanvas, 'wheel')
        await wheel.modify(l => l.setHandler(ev => ev.preventDefault()))
    })

    it('should not display a console warning', async () => {
        await page.mouse.move(100, 100);
        await getResultAfter(async () => {
            await page.mouse.wheel({deltaY: 50});
        }, [() => ensureNoConsoleMessage(page, m => m.type() === 'warning', 1000)])
    });

    afterAll(async () => {
        await cleanup();
    })
})