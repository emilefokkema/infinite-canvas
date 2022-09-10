import { TransformTestPage } from "./server/transform-test-page";
import { TouchCollection, Touch as TouchCollectionTouch } from "./server/touch-collection";
import { compareToSnapshot } from './compare-to-snapshot';

describe('when a touch exists on the page outside of infinite canvas that has greedy gesture handling enabled', () => {
    let page: TransformTestPage;
    let firstTouch: TouchCollectionTouch;
    let touchCollection: TouchCollection;

    beforeAll(async () => {
        page = await TransformTestPage.create();
        page = await page.recreate({greedyGestureHandling: true})
        touchCollection = await page.getTouchCollection();
        firstTouch = await touchCollection.start(350, 600);
    });

    describe('and then another touch starts on infinite canvas and moves', () => {
        let secondTouch: TouchCollectionTouch;

        beforeAll(async () => {
            secondTouch = await touchCollection.start(100, 100);
            await page.whenDrawnAfter(() => secondTouch.move(100, 200));
        });

        it('should look like this', async () => {
            await compareToSnapshot(page, 'touch-bug-4');
        });

        describe('and then the first touch stops and the second moves again', () => {

            beforeAll(async () => {
                await firstTouch.end();
                await page.whenDrawnAfter(() => secondTouch.move(200, 200))
            });

            it('should look like this', async () => {
                await compareToSnapshot(page, 'touch-bug-5');
            });

            describe('and then the second touch also ends and a third touch appears', () => {
                let thirdTouch: TouchCollectionTouch;

                beforeAll(async () => {
                    await secondTouch.end();
                    thirdTouch = await touchCollection.start(200, 200);
                    await page.whenDrawnAfter(() => thirdTouch.move(100, 200));
                });

                it('should look like this', async () => {
                    await compareToSnapshot(page, 'touch-bug-6');
                });
            });
        });
    });

    afterAll(async () => {
        await page.close();
    });
});