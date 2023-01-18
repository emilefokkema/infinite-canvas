import puppeteer from 'puppeteer';
import { TestPage, CanvasElementProxy, InfiniteCanvasProxy, getResultAfter } from 'e2e-test-page';

function initializeCanvasElement(page: TestPage): Promise<CanvasElementProxy>{
    return page.initializeCanvasElement({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400
    });
}

function initializeInfiniteCanvas(canvasEl: CanvasElementProxy): Promise<InfiniteCanvasProxy>{
    return canvasEl.initializeInfiniteCanvas({
        drawing: (ctx: any) => {
            ctx.fillRect(100, 100, 200, 100);
        }
    });
}

describe('when propagation of a mousedown event is stopped on capture on the canvas element', () => {
    let page: TestPage;
    let mouse: puppeteer.Mouse;

    beforeAll(async () => {
        page = await TestPage.create();
        mouse = page.getMouse();
    });

    it('should prevent panning', async () => {
        const canvasEl = await initializeCanvasElement(page);
        await canvasEl.addMouseEventListener('mousedown', undefined, undefined, () => true, true);
        const infCanvas = await initializeInfiniteCanvas(canvasEl);
        const drawn = await infCanvas.addDrawEventListener();
        await mouse.move(150, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(200, 200), () => drawn.ensureNoNext(300));
    });

    it('also when the handler that stops propagation is added after creation of InfiniteCanvas', async () => {
        page = await page.recreate();
        const canvasEl = await initializeCanvasElement(page);
        const infCanvas = await initializeInfiniteCanvas(canvasEl);
        await canvasEl.addMouseEventListener('mousedown', undefined, undefined, () => true, true);
        const drawn = await infCanvas.addDrawEventListener();
        mouse = page.getMouse();
        await mouse.move(150, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(200, 200), () => drawn.ensureNoNext(300));
    });

    afterAll(async () => {
        await page.close();
    });
});