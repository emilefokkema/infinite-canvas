import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { TestPageInfiniteCanvas } from './test-page/test-page-infinite-canvas'
import { TouchHandle } from 'puppeteer';
import { noEvent } from './utils/next-event';

describe('when a touch exists on the page outside of infinite canvas that has greedy gesture handling NOT enabled', () => {
    let infCanvas: TestPageInfiniteCanvas;
    let firstTouch: TouchHandle;

    beforeAll(async () => {
        infCanvas = await page.createCanvasElement({
            styleWidth: '400px',
            styleHeight: '400px',
            canvasWidth: 400,
            canvasHeight: 400,
            spaceBelowCanvas: 2000,
        }).then(c => page.createInfiniteCanvas(c));
        await infCanvas.draw(d => d(ctx => {
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
        }))
        firstTouch = await page.touchscreen.touchStart(350, 600);
    })

    describe('and then another touch starts on infinite canvas and moves', () => {
        let secondTouch: TouchHandle;

        beforeAll(async () => {
            secondTouch = await page.touchscreen.touchStart(100, 100);
            await Promise.all([
                noEvent(infCanvas.eventTarget, 'draw', 300),
                secondTouch.move(100, 200)
            ])
            await secondTouch.move(100, 200);
        })

        it('should look like this', async () => {
            expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'touch-bug-1'})
        })

        describe('and then the first touch stops and the second moves again', () => {

            beforeAll(async () => {
                await firstTouch.end();
                await Promise.all([
                    noEvent(infCanvas.eventTarget, 'draw', 300),
                    secondTouch.move(100, 150)
                ])
            })

            it('should look like this', async () => {
                expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'touch-bug-2'})
            })

            describe('and then the second touch also ends and a third touch appears', () => {
                let thirdTouch: TouchHandle;

                beforeAll(async () => {
                    await secondTouch.end();
                    thirdTouch = await page.touchscreen.touchStart(200, 200);
                    await Promise.all([
                        noEvent(infCanvas.eventTarget, 'draw', 300),
                        thirdTouch.move(200, 100)
                    ])
                })

                it('should look like this', async () => {
                    expect(await page.getScreenshot()).toMatchImageSnapshotCustom({identifier: 'touch-bug-3'})
                })
            })
        })
    })
})