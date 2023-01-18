import { compareToSnapshot } from "./compare-to-snapshot";
import { TestPage, InfiniteCanvasProxy, EventListenerProxy, DrawEvent, getResultAfter, TouchCollection, Touch as TouchCollectionTouch } from "e2e-test-page";

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

describe('when two touches start', () => {
    let page: TestPage;
    let touchCollection: TouchCollection;
    let firstTouch: TouchCollectionTouch;
    let secondTouch: TouchCollectionTouch;
    let drawn: EventListenerProxy<DrawEvent>;

    beforeAll(async () => {
        page = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(page);
        drawn = await infCanvas.addDrawEventListener();
        touchCollection = await page.getTouchCollection();
        firstTouch = await touchCollection.start(100, 100);
        secondTouch = await touchCollection.start(200, 100);
    });

    it('should rotate-zoom', async () => {
        await getResultAfter(() => secondTouch.move(200, 200), () => drawn.getNext());
        await compareToSnapshot(page);
    });

    describe('and when one touch is released', () => {

        beforeAll(async () => {
            await secondTouch.end();
        });

        it('should pan', async () => {
            await getResultAfter(() => firstTouch.move(100, 50), () => drawn.getNext());
            await compareToSnapshot(page);
        });

        describe('and when a third touch starts', () => {
            let thirdTouch: TouchCollectionTouch;

            beforeAll(async () => {
                thirdTouch = await touchCollection.start(200, 150);
            });

            it('should rotate-zoom again', async () => {
                await getResultAfter(() => thirdTouch.move(200, 50), () => drawn.getNext());
                await compareToSnapshot(page);
            });
        });
    });

    afterAll(async () => {
        await page.close();
    });
})