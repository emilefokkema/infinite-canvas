import {describe, it, beforeAll, afterAll } from '@jest/globals';
import { EventListenerProxy, getResultAfter, InfiniteCanvasProxy, TestPage } from "e2e-test-page";

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

describe('when we add an event listener for a non-pointer-related event', () => {
    let testPage: TestPage;
    let transitionStarted: EventListenerProxy<{}>;

    beforeAll(async () => {
        testPage = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(testPage);
        transitionStarted = await infCanvas.addEventListener({type: 'transitionstart', shape: {}});
        await testPage.addStyleSheet(`
        canvas{
            border:1px solid #000;
            transition-property:border-bottom-color;
            transition-duration:1s;
        }
        canvas:hover{
            border-bottom-color:#f00;
        }`)
    });

    afterAll(async () => {
        await testPage.close();
    });

    it('should emit a transitionstarted event', async () => {
        const mouse = testPage.getMouse();
        await getResultAfter(() => mouse.move(100,100), () => transitionStarted.getNext());
    });
});