import { describe, it, beforeAll, afterAll } from 'vitest'
import { nextConsoleMessage, noConsoleMessage } from './utils/next-event';
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas';

describe('without greedy gesture handling', () => {
    let infCanvas: TestPageInfiniteCanvas;

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
            ctx.fillRect(100, 100, 50, 50);
        }))
    })

    it('should display a console warning', async () => {
        await page.mouse.move(100, 100);
        await Promise.all([
            nextConsoleMessage(page.page, m => m.type() === 'warn' && m.text() === 'use ctrl + scroll to zoom'),
            page.mouse.wheel({deltaY: 50})
        ])
    })

    it('should not display a console warning if zooming occurs', async () => {
        await page.mouse.move(100, 100);
        await page.keyboard.down('ControlLeft');
        await Promise.all([
            noConsoleMessage(page.page, m => m.type() === 'warn', 1000),
            page.mouse.wheel({deltaY: 50})
        ])
        await page.keyboard.up('ControlLeft');
    })

    describe('and default for wheelignored is cancelled', () => {

        beforeAll(async () => {
            const events = await infCanvas.eventTarget.emitEvents({
                wheelignored: {}
            })
            await events.handleEvents('wheelignored', h => h(e => {
                e.preventDefault();
            }))
        })

        it('should not display a console warning', async () => {
            await page.mouse.move(100, 100);
            await Promise.all([
                noConsoleMessage(page.page, m => m.type() === 'warn', 1000),
                page.mouse.wheel({deltaY: 50})
            ])
        })
    })
})