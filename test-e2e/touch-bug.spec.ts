import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page } from 'puppeteer'
import type { DrawEvent } from 'infinite-canvas'
import { 
    getPage,
    getResultAfter,
    getTouchCollection,
    getScreenshot,
    type InPageEventListener,
    type EventListenerAdder,
    type TouchCollection,
    type Touch
} from './utils'
import '../test-utils/expect-extensions'

describe('when a touch exists on the page outside of infinite canvas that has greedy gesture handling NOT enabled', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let addEventListenerInPage: EventListenerAdder;
    let drawn: InPageEventListener<DrawEvent>;
    let firstTouch: Touch;
    let touchCollection: TouchCollection;

    beforeAll(async () => {
        ({page, cleanup, addEventListenerInPage} = await getPage());
        const infCanvas = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
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
        }))
        drawn = await addEventListenerInPage(infCanvas, 'draw');
        touchCollection = await getTouchCollection(page);
        firstTouch = await touchCollection.start(350, 600);
    })

    describe('and then another touch starts on infinite canvas and moves', () => {
        let secondTouch: Touch;

        beforeAll(async () => {
            secondTouch = await touchCollection.start(100, 100);
            await getResultAfter(() => secondTouch.move(100, 200), [() => drawn.ensureNoNext(300)]);
            await secondTouch.move(100, 200);
        });

        it('should look like this', async () => {
            expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'touch-bug-1'})
        });

        describe('and then the first touch stops and the second moves again', () => {

            beforeAll(async () => {
                await firstTouch.end();
                await getResultAfter(() => secondTouch.move(200, 200), [() => drawn.ensureNoNext(300)])
            });

            it('should look like this', async () => {
                expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'touch-bug-2'})
            });

            describe('and then the second touch also ends and a third touch appears', () => {
                let thirdTouch: Touch;

                beforeAll(async () => {
                    await secondTouch.end();
                    thirdTouch = await touchCollection.start(200, 200);
                    await getResultAfter(() => thirdTouch.move(100, 200), [() => drawn.ensureNoNext(300)]);
                });

                it('should look like this', async () => {
                    expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: 'touch-bug-3'})
                });
            });
        });
    });

    afterAll(async () => {
        await cleanup();
    })
})