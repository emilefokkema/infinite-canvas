import puppeteer from 'puppeteer';
import { compareToSnapshot } from './compare-to-snapshot';
import { InfiniteCanvasProxy, TestPage, getResultAfter, TouchCollection, Touch } from 'e2e-test-page';

declare const __DELTAY_DISTORTION__: number;

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

describe('when transforming', () => {
    let page: TestPage;

    beforeAll(async () => {
        page = await TestPage.create();
    });

    afterAll(async () => {
        await page.close();
    });

    it('should pan', async () => {
       const infCanvas = await initializeInfiniteCanvas(page);
       const drawn = await infCanvas.addDrawEventListener();
       const mouse: puppeteer.Mouse = page.getMouse();
       await mouse.move(100, 100);
       await mouse.down({button: 'left'});
       await getResultAfter(() => mouse.move(150, 150), () => drawn.getNext());
       await compareToSnapshot(page);
       await mouse.up({button: 'left'});
       await getResultAfter(() => mouse.move(200, 200), () => drawn.ensureNoNext(500));
    });

    it('should stop panning when mouse leaves canvas', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener();
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(300, 50);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(350, 50), () => drawn.getNext());
        await getResultAfter(() => mouse.move(450, 50), () => drawn.ensureNoNext(500));
        await getResultAfter(() => mouse.move(300, 50), () => drawn.ensureNoNext(500));
        await mouse.up({button: 'left'});
    });

    it('should rotate', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener();
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await getResultAfter(() => mouse.move(125, 100), () => drawn.getNext());
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'})
        await getResultAfter(() => mouse.move(150, 100), () => drawn.ensureNoNext(500));
    });

    it('should zoom on wheel with control key', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener(300);
        const mouse: puppeteer.Mouse = page.getMouse();
        const keyboard: puppeteer.Keyboard = page.getKeyboard();
        await mouse.move(100, 100);
        await keyboard.down('ControlLeft');
        await getResultAfter(() => mouse.wheel({deltaX: 0, deltaY: -75 / __DELTAY_DISTORTION__}), () => drawn.getNext());
        await compareToSnapshot(page);
        expect(await page.getScrollY()).toEqual(0);
        await keyboard.up('ControlLeft');
    });

    it('should not zoom on only wheel', async () => {
        page = await page.recreate();
        await initializeInfiniteCanvas(page);
        const windowScrolledDebounced = await page.addEventListener({type: 'scroll', shape: {}, debounceInterval: 300});
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        const deltaY: number = 80;
        await getResultAfter(() => mouse.wheel({deltaX: 0, deltaY}), () => windowScrolledDebounced.getNext());
        await compareToSnapshot(page);
        expect(await page.getScrollY()).toEqual(deltaY);
    });

    it('should zoom on only wheel with greedyGestureHandling', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const debouncedDrawn = await infCanvas.addDrawEventListener(300);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await getResultAfter(() => mouse.wheel({deltaX: 0, deltaY: -75 / __DELTAY_DISTORTION__}), () => debouncedDrawn.getNext());
        await compareToSnapshot(page);
        expect(await page.getScrollY()).toEqual(0);
    });

    it('should not rotate', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, undefined, false);
        const drawn = await infCanvas.addDrawEventListener();
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await getResultAfter(() => mouse.move(125, 100), () => drawn.ensureNoNext(300));
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    });

    it('should pan on single moving touch if greedy gesture handling enabled', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn = await infCanvas.addDrawEventListener();
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch: Touch = await touchCollection.start(100, 100);
        await getResultAfter(() => touch.move(150, 150), () => drawn.getNext());
        await compareToSnapshot(page);
        await touch.end();
    });

    it('should not pan on single moving touch if greedy gesture handling not enabled', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener();
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch: Touch = await touchCollection.start(200, 200);
        await getResultAfter(() => touch.move(200, 100), () => drawn.ensureNoNext(300));
        await compareToSnapshot(page);
        await touch.end();
        expect(await page.getScrollY()).toBeGreaterThan(0);
    });

    it('should zoom and rotate', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener();
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await getResultAfter(() => touch2.move(200, 200), () => drawn.getNext());
        await compareToSnapshot(page);
        await getResultAfter(() => touch1.move(100, 0), () => drawn.getNext());
        await compareToSnapshot(page);
        await touch1.end();
        await getResultAfter(() => touch2.move(150, 200), () => drawn.getNext());
        await compareToSnapshot(page);
        await touch2.end();
    });

    it('should zoom but not rotate on two touches if rotation not enabled', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, undefined, false);
        const drawn = await infCanvas.addDrawEventListener();
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await getResultAfter(() => touch2.move(200, 200), () => drawn.getNext());
        await compareToSnapshot(page);
        await touch1.end();
        await getResultAfter(() => touch2.move(100, 200), () => drawn.getNext());
        await compareToSnapshot(page);
        await touch2.end();
    })
});
