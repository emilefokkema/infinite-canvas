import puppeteer from 'puppeteer';
import { TestPage, InfiniteCanvasProxy, EventListenerProxy, MouseEventShape, getResultAfter } from 'e2e-test-page';

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

describe('when the mouse interacts with the canvas', () => {
    let page: TestPage;
    let mouseMoved: EventListenerProxy<MouseEventShape>;

    beforeAll(async () => {
        page = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(page);
        mouseMoved = await infCanvas.addMouseEventListener('mousemove');
    });

    it('should emit a mousemove when rotating with the mouse', async () => {
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        const [{offsetX, offsetY, movementX, movementY}] = await getResultAfter(async () => {
            // A horizontal difference of 50 leads to a rotation of 90 degrees, cf src/transformer/rotate.ts
            await mouse.move(150, 100)
        }, () => mouseMoved.getNext());
        expect(offsetX).toBeCloseTo(100);
        expect(offsetY).toBeCloseTo(150);
        expect(movementX).toBeCloseTo(0);
        expect(movementY).toBeCloseTo(50);
    });

    afterAll(async () => {
        await page.close();
    });
});