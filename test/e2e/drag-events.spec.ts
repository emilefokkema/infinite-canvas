import { TestPage, InfiniteCanvasProxy, getResultAfter, CanvasElementProxy } from "e2e-test-page";
import { Mouse } from 'puppeteer'

function initializeCanvasElement(page: TestPage): Promise<CanvasElementProxy>{
    return page.initializeCanvasElement({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
    });
}

function initializeInfiniteCanvas(canvasEl: CanvasElementProxy): Promise<InfiniteCanvasProxy>{
    return canvasEl.initializeInfiniteCanvas({
        drawing: (ctx: any) => {
            ctx.fillRect(100, 100, 200, 100);
        }
    });
}

describe('when we transform the canvas', () => {
    let page: TestPage;
    let infCanvas: InfiniteCanvasProxy;
    let canvasEl: CanvasElementProxy;
    let mouse: Mouse;

    beforeAll(async () => {
        page = await TestPage.create();
        await page.setDragInterception(true);
        canvasEl = await initializeCanvasElement(page);
        infCanvas = await initializeInfiniteCanvas(canvasEl);
        const drawn = await infCanvas.addDrawEventListener();
        mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(150, 100), () => drawn.getNext());
        await mouse.up({button: 'left'})
    });

    describe('and we start to drag', () => {

        beforeAll(async () => {
            await canvasEl.setAttribute('draggable', 'true');
        });

        it('should emit a dragstart event', async () => {
            const dragStartEv = await infCanvas.addMouseEventListener('dragstart');
            await getResultAfter(async () => {
               await (<any>mouse).drag({x: 150, y: 100}, {x: 150, y: 150})
            }, () => dragStartEv.getNext());
        });
    });

    afterAll(async () => {
        await page.close();
    })
});