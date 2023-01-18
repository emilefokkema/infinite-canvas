import puppeteer from 'puppeteer';
import { compareToSnapshot } from './compare-to-snapshot';
import { TestPage, InfiniteCanvasProxy, MouseEventShape, getResultAfter, TouchEventShape, TouchCollection } from 'e2e-test-page';

function initializeInfiniteCanvas(page: TestPage, greedyGestureHandling?: boolean): Promise<InfiniteCanvasProxy>{
    return page.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        greedyGestureHandling,
        spaceBelowCanvas: 2000,
        drawing: (ctx: any) => {
            ctx.fillRect(100, 100, 100, 100);
        }
    });
}

function mouseIsInArea(ev: MouseEventShape): boolean{
    return ev.offsetX >= 100 && ev.offsetX <= 200 && ev.offsetY >= 100 && ev.offsetY <= 200;
}

function changedTouchIsInArea(ev: TouchEventShape): boolean{
    if(ev.changedTouches.length !== 1){
        return false;
    }
    const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
    return infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
}

function changedTouchIsNotFirstAndInArea(ev: TouchEventShape): boolean{
    if(ev.changedTouches.length !== 1 || ev.targetTouches.length === 1){
        return false;
    }
    const {infiniteCanvasX, infiniteCanvasY} = ev.changedTouches[0];
    return infiniteCanvasX >= 100 && infiniteCanvasX <= 200 && infiniteCanvasY >= 100 && infiniteCanvasY <= 200;
}

describe('when default is prevented', () => {
    let page: TestPage;

    beforeAll(async () => {
        page = await TestPage.create();
    });

    afterAll(async () => {
        await page.close();
    });

    it('should not begin to pan when mousedown default is prevented', async () => {
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addMouseEventListener('mousedown', mouseIsInArea);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(150, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(250, 150), () => drawn.ensureNoNext(300));
        await mouse.up({button: 'left'});
        await mouse.move(50, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(200, 150), () => drawn.getNext());
        await compareToSnapshot(page);
        await mouse.up({button: 'left'});
        await mouse.move(300, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(150, 150), () => drawn.ensureNoNext(300));
        await mouse.up({button: 'left'});
        await mouse.move(150, 150);
        await mouse.down({button: 'left'});
        await getResultAfter(() => mouse.move(50, 150), () => drawn.getNext());
        await compareToSnapshot(page);
    });

    it('should not zoom when wheel default is prevented', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        await infCanvas.addWheelEventListener(mouseIsInArea)
        const scrolled = await page.addEventListener({type: 'scroll', shape: {}, debounceInterval: 300});
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(150, 150);
        const deltaY: number = 80;
        await getResultAfter(() => mouse.wheel({deltaX: 0, deltaY}), () => scrolled.getNext());
        await compareToSnapshot(page);
        expect(await page.getScrollY()).toEqual(deltaY);
    });

    it('in case of greedy gesture handling should neither zoom nor scroll when both defaults are prevented', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addWheelEventListener(mouseIsInArea, mouseIsInArea);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(150, 150);
        await getResultAfter(() => mouse.wheel({deltaX: 0, deltaY: 80}), () => drawn.ensureNoNext(300));
        expect(await page.getScrollY()).toEqual(0);
    });

    it('in case of no greedy gesture handling should neither zoom nor scroll when native default is prevented', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addWheelEventListener(mouseIsInArea, mouseIsInArea);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(150, 150);
        await getResultAfter(() => mouse.wheel({deltaX: 0, deltaY: 80}), () => drawn.ensureNoNext(300));
        expect(await page.getScrollY()).toEqual(0);
    });

    it('should not pan if touchstart default is prevented', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addTouchEventListener('touchstart', changedTouchIsInArea);
        const touches: TouchCollection = await page.getTouchCollection();
        let touch = await touches.start(150, 150);
        await getResultAfter(() => touch.move(250, 150), () => drawn.ensureNoNext(300));
        await touch.end();
        touch = await touches.start(50, 150);
        await getResultAfter(() => touch.move(200, 150), () => drawn.getNext());
        await compareToSnapshot(page);
    });

    it('should neither pan nor scroll if native default is also prevented', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addTouchEventListener('touchstart', changedTouchIsInArea, changedTouchIsInArea);
        const touches: TouchCollection = await page.getTouchCollection();
        let touch = await touches.start(150, 150);
        await getResultAfter(() => touch.move(150, 50), () => drawn.ensureNoNext(300));
        await touch.end();
        expect(await page.getScrollY()).toEqual(0);
    });

    it('should not zoom if second started touch is default-prevented', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addTouchEventListener('touchstart', changedTouchIsNotFirstAndInArea);
        const touches: TouchCollection = await page.getTouchCollection();
        const touch = await touches.start(120, 120);
        await getResultAfter(() => touch.move(120, 140), () => drawn.getNext());
        const secondTouch = await touches.start(180, 140);
        await getResultAfter(() => secondTouch.move(200, 140), () => drawn.ensureNoNext(300));
        await touch.end();
        await secondTouch.end();
    });

    it('should not do anything if first touch was default-prevented and the second was not', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page);
        const drawn = await infCanvas.addDrawEventListener();
        await infCanvas.addTouchEventListener('touchstart', changedTouchIsInArea);
        const touches: TouchCollection = await page.getTouchCollection();
        const firstTouch = await touches.start(150, 150);
        const secondTouch = await touches.start(50, 150);
        await getResultAfter(() => secondTouch.move(50, 250), () => drawn.ensureNoNext(300));
        await firstTouch.end();
        await secondTouch.end();
    });

    it('should emit touchmove when touch moves relative to infinitecanvas because the latter moves', async () => {
        page = await page.recreate();
        const infCanvas = await initializeInfiniteCanvas(page, true);
        await infCanvas.addTouchEventListener('touchstart', changedTouchIsNotFirstAndInArea);
        const touchMoved = await infCanvas.addTouchEventListener('touchmove');
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const firstTouchInitialY = 150;
        const secondTouchInitialY = 150;
        const firstTouchDeltaY: number = -40;
        const touch = await touchCollection.start(120, firstTouchInitialY);
        const secondTouch = await touchCollection.start(180, secondTouchInitialY);
        const [{touches, changedTouches, targetTouches}] = await getResultAfter(() => touch.move(120, firstTouchInitialY + firstTouchDeltaY), () => touchMoved.getNext());
        expect(touches.length).toBe(2);
        expect(changedTouches.length).toBe(1);
        expect(targetTouches.length).toBe(2);
        const [{
            infiniteCanvasX: firstTargetTouchInfiniteCanvasX,
            infiniteCanvasY: firstTargetTouchInfiniteCanvasY
        }, {identifier: targetTouchIdentifier2}] = targetTouches;
        const [{
            identifier: changedTouchIdentifier,
            infiniteCanvasX,
            infiniteCanvasY
        }] = changedTouches;
        
        // the first touch has moved, but not relative to InfiniteCanvas
        expect(firstTargetTouchInfiniteCanvasX).toBeCloseTo(120);
        expect(firstTargetTouchInfiniteCanvasY).toBeCloseTo(firstTouchInitialY);

        // because moving the first touch panned InfiniteCanvas upward, the second touch moved downward relative to InfiniteCanvas
        expect(changedTouchIdentifier).toBe(targetTouchIdentifier2);
        expect(infiniteCanvasX).toBeCloseTo(180);
        expect(infiniteCanvasY).toBeCloseTo(secondTouchInitialY - firstTouchDeltaY);

        await touch.end();
        await secondTouch.end();
    })
});
