import {describe, it, beforeAll, afterAll } from '@jest/globals';
import { getResultAfter, InfiniteCanvasProxy, TestPage, Touch, Units } from "e2e-test-page";
import { compareToSnapshot } from "./compare-to-snapshot";

describe('when state is saved and a rectangle drawn', () => {
    let page: TestPage;
    let infCanvas: InfiniteCanvasProxy;

    beforeAll(async () => {
        page = await TestPage.create();
        infCanvas = await page.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 300,
            canvasHeight: 150,
            units: Units.CSS,
            greedyGestureHandling: true,
            drawing: (ctx: any) => {
                ctx.save();
                ctx.fillRect(20, 20, 80, 80)
            }
        })
    });

    it('should look like this', async () => {
        await compareToSnapshot(page);
    })

    it('should look like this when panned twice', async () => {
        const drawn = await infCanvas.addDrawEventListener();
        const touchCollection = await page.getTouchCollection();
        const touch = await touchCollection.start(20, 20)
        await getResultAfter(async () => {
            await touch.move(20, 150);
        }, () => drawn.getNext());
        await getResultAfter(async () => {
            await touch.move(200, 150);
        }, () => drawn.getNext());
        await compareToSnapshot(page);
    })

    afterAll(async () => {
        await page.close();
    });
});