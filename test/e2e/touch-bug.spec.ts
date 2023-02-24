import {describe, it, beforeAll, afterAll } from '@jest/globals';
import { compareToSnapshot } from './compare-to-snapshot';
import { TestPage, EventListenerProxy, DrawEvent, InfiniteCanvasProxy, getResultAfter, TouchCollection, Touch as TouchCollectionTouch } from "e2e-test-page";

function initializeInfiniteCanvas(page: TestPage,  greedyGestureHandling?: boolean, rotationEnabled?: boolean): Promise<InfiniteCanvasProxy>{
    return page.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        spaceBelowCanvas: 2000,
        greedyGestureHandling,
        rotationEnabled,
        drawing: (ctx: any) => {
            ctx.beginPath();
            ctx.moveToInfinityInDirection(-1, 0);
            ctx.lineTo(100, 100);
            ctx.lineToInfinityInDirection(1, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveToInfinityInDirection(0, -1);
            ctx.lineTo(100, 100);
            ctx.lineToInfinityInDirection(0, 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(200, 100, 25, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

describe('when a touch exists on the page outside of infinite canvas that has greedy gesture handling NOT enabled', () => {
    let page: TestPage;
    let firstTouch: TouchCollectionTouch;
    let touchCollection: TouchCollection;
    let drawn: EventListenerProxy<DrawEvent>;

    beforeAll(async () => {
        page = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(page);
        drawn = await infCanvas.addDrawEventListener();
        touchCollection = await page.getTouchCollection();
        firstTouch = await touchCollection.start(350, 600);
    });

    describe('and then another touch starts on infinite canvas and moves', () => {
        let secondTouch: TouchCollectionTouch;

        beforeAll(async () => {
            secondTouch = await touchCollection.start(100, 100);
            await getResultAfter(() => secondTouch.move(100, 200), () => drawn.ensureNoNext(300));
            await secondTouch.move(100, 200);
        });

        it('should look like this', async () => {
            await compareToSnapshot(page, 'touch-bug-1');
        });

        describe('and then the first touch stops and the second moves again', () => {

            beforeAll(async () => {
                await firstTouch.end();
                await getResultAfter(() => secondTouch.move(200, 200), () => drawn.ensureNoNext(300))
            });

            it('should look like this', async () => {
                await compareToSnapshot(page, 'touch-bug-2');
            });

            describe('and then the second touch also ends and a third touch appears', () => {
                let thirdTouch: TouchCollectionTouch;

                beforeAll(async () => {
                    await secondTouch.end();
                    thirdTouch = await touchCollection.start(200, 200);
                    await getResultAfter(() => thirdTouch.move(100, 200), () => drawn.ensureNoNext(300));
                });

                it('should look like this', async () => {
                    await compareToSnapshot(page, 'touch-bug-3');
                });
            });
        });
    });

    afterAll(async () => {
        await page.close();
    });
});