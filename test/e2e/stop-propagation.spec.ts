import puppeteer from 'puppeteer';
import { TestPage, InfiniteCanvasProxy, EventListenerProxy, DrawEvent, getResultAfter } from 'e2e-test-page';

function initializeInfiniteCanvas(page: TestPage): Promise<InfiniteCanvasProxy>{
    return page.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        drawing: (ctx: any) => {
            ctx.fillRect(100, 100, 200, 100);
        }
    });
}

describe('when propagation of a mousedown event is stopped on capture on the infinite canvas', () => {
    let page: TestPage;
    let mouse: puppeteer.Mouse;
    let drawn: EventListenerProxy<DrawEvent>;

    beforeAll(async () => {
        page = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(page);
        await infCanvas.addMouseEventListener('mousedown', undefined, undefined, () => true, true);
        drawn = await infCanvas.addDrawEventListener();
        mouse = page.getMouse();
    });

    afterAll(async () => {
        await page.close();
    });

    it('the canvas should still pan because default was not prevented', async () => {
        await mouse.move(100, 100);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(150, 150), () => drawn.getNext());
    });
})