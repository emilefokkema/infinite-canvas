import { InfiniteCanvasProxy, TestPage } from "e2e-test-page"
import { ensureDoesNotResolve } from './utils';

describe('without greedy gesture handling', () => {
    let page: TestPage;
    let infCanvas: InfiniteCanvasProxy;

    beforeAll(async () => {
        page = await TestPage.create();
        infCanvas = await page.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 50, 50);
            }
        });
    });

    afterAll(async () => {
        await page.close();
    })

    it('should display a console warning', async () => {
        const mouse = page.getMouse();
        await mouse.move(100, 100);
        const warningMessagePromise = page.waitForConsoleMessage(m => m.type() === 'warning' && m.text() === 'use ctrl + scroll to zoom')
        await mouse.wheel({deltaY: 50});
        await warningMessagePromise;
    });

    it('should not display a console warning if zooming occurs', async () => {
        const mouse = page.getMouse();
        const keyboard = page.getKeyboard();
        await mouse.move(100, 100);
        await keyboard.down('ControlLeft');
        const doesNotResolvePromise = ensureDoesNotResolve(
            () => page.waitForConsoleMessage(m => 
                m.type() === 'warning' &&
                m.text() === 'use ctrl + scroll to zoom'),
            500,
            'did not expect a warning message');
        await mouse.wheel({deltaY: 50});
        await doesNotResolvePromise;
        await keyboard.up('ControlLeft');
    });

    describe('and default for wheelignored is cancelled', () => {
        
        beforeAll(async () => {
            await infCanvas.addEventListener({type: 'wheelignored', shape: {}, preventDefault: () => true})
        })

        it('should not display a console warning', async () => {
            const mouse = page.getMouse();
            await mouse.move(100, 100);
            const doesNotResolvePromise = ensureDoesNotResolve(
                () => page.waitForConsoleMessage(m => 
                    m.type() === 'warning' &&
                    m.text() === 'use ctrl + scroll to zoom'),
                500,
                'did not expect a warning message');
            await mouse.wheel({deltaY: 50});
            await doesNotResolvePromise;
        });
    });
})

describe('without greedy gesture handling and when wheel is default-prevented', () => {
    let page: TestPage;

    beforeAll(async () => {
        page = await TestPage.create();
        const infCanvas = await page.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            drawing: (ctx: any) => {
                ctx.fillRect(100, 100, 50, 50);
            }
        });
        await infCanvas.addWheelEventListener(() => true);
    })

    afterAll(async () => {
        await page.close();
    })

    it('should not display a console warning', async () => {
        const mouse = page.getMouse();
        await mouse.move(100, 100);
        const doesNotResolvePromise = ensureDoesNotResolve(
            () => page.waitForConsoleMessage(m => 
                m.type() === 'warning' &&
                m.text() === 'use ctrl + scroll to zoom'),
            500,
            'did not expect a warning message');
        await mouse.wheel({deltaY: 50});
        await doesNotResolvePromise;
    });
})