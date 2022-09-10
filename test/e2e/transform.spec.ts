import {TransformTestPage} from './server/transform-test-page';
import puppeteer from 'puppeteer';
import {TouchCollection, Touch} from "./server/touch-collection";
import { compareToSnapshot } from './compare-to-snapshot';

describe('when transforming', () => {
    let page: TransformTestPage;
    let deltaYDistortion: number;

    beforeAll(async () => {
        page = await TransformTestPage.create();
        deltaYDistortion = await page.measureDeltaYDistortion();
    });

    afterAll(async () => {
        await page.close();
    });

    it('should pan', async () => {
       const mouse: puppeteer.Mouse = page.getMouse();
       await mouse.move(100, 100);
       await mouse.down({button: 'left'});
       await page.whenDrawnAfter(() => mouse.move(150, 150));
       await compareToSnapshot(page);
       await mouse.up({button: 'left'});
       await page.whenNotDrawnAfter(() => mouse.move(200, 200), 500);
    });

    it('should rotate', async () => {
        page = await page.recreate();
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await page.whenDrawnAfter(() => mouse.move(125, 100));
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'})
        await page.whenNotDrawnAfter(() => mouse.move(150, 100), 500);
    });

    it('should zoom on wheel with control key', async () => {
        page = await page.recreate();
        const mouse: puppeteer.Mouse = page.getMouse();
        const keyboard: puppeteer.Keyboard = page.getKeyboard();
        await mouse.move(100, 100);
        await keyboard.down('ControlLeft');
        await page.whenDebouncedDrawnAfter(() => mouse.wheel({deltaX: 0, deltaY: -75 / deltaYDistortion}), 300);
        await compareToSnapshot(page);
        expect(await page.getScrollY()).toEqual(0);
        await keyboard.up('ControlLeft');
    });

    it('should not zoom on only wheel', async () => {
        page = await page.recreate();
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        const deltaY: number = 80;
        await page.whenDebouncedScrolledAfter(() => mouse.wheel({deltaX: 0, deltaY}), 300);
        await compareToSnapshot(page);
        expect(await page.getScrollY()).toEqual(deltaY);
    });

    it('should zoom on only wheel with greedyGestureHandling', async () => {
        page = await page.recreate({greedyGestureHandling: true});
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await page.whenDebouncedDrawnAfter(() => mouse.wheel({deltaX: 0, deltaY: -75 / deltaYDistortion}), 300);
        await compareToSnapshot(page);
        expect(await page.getScrollY()).toEqual(0);
    });

    it('should not rotate', async () => {
        page = await page.recreate({rotationEnabled: false});
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await page.whenNotDrawnAfter(() => mouse.move(125, 100), 300);
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    });

    it('should pan on single moving touch if greedy gesture handling enabled', async () => {
        page = await page.recreate({greedyGestureHandling: true});
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch: Touch = await touchCollection.start(100, 100);
        await page.whenDrawnAfter(() => touch.move(150, 150));
        await compareToSnapshot(page);
        await touch.end();
    });

    it('should not pan on single moving touch if greedy gesture handling not enabled', async () => {
        page = await page.recreate();
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch: Touch = await touchCollection.start(200, 200);
        await page.whenNotDrawnAfter(() => touch.move(200, 100), 300);
        await compareToSnapshot(page);
        await touch.end();
        expect(await page.getScrollY()).toBeGreaterThan(0);
    });

    it('should zoom and rotate', async () => {
        page = await page.recreate();
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await page.whenDrawnAfter(() => touch2.move(200, 200));
        await compareToSnapshot(page);
        await page.whenDrawnAfter(() => touch1.move(100, 0));
        await compareToSnapshot(page);
        await touch1.end();
        await touch2.end();
    });

    it('should zoom but not rotate on two touches if rotation not enabled', async () => {
        page = await page.recreate({rotationEnabled: false});
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await page.whenDrawnAfter(() => touch2.move(200, 200));
        await compareToSnapshot(page);
        await touch1.end();
        await touch2.end();
    })
});
