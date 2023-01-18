import { 
    TestPage,
    InfiniteCanvasProxy,
    TouchEventShape,
    TouchCollection,
    Touch,
    getResultAfter,
    EventListenerProxy,
    PointerEventShape,
    DrawEvent  } from "e2e-test-page";
import { compareToSnapshot } from "./compare-to-snapshot";

function initializeInfiniteCanvas(page: TestPage): Promise<InfiniteCanvasProxy>{
    return page.initializeInfiniteCanvas({
        styleWidth: '400px',
        styleHeight: '400px',
        canvasWidth: 400,
        canvasHeight: 400,
        greedyGestureHandling: true,
        drawing: (ctx: any) => {
            ctx.fillRect(100, 100, 100, 100);
        }
    });
}

function isSecondTouch(ev: TouchEventShape){
    return ev.targetTouches.length > 1;
}

describe('when a pointer starts and default is not prevented', () => {
    let page: TestPage;
    let touchCollection: TouchCollection;
    let pointerDown: EventListenerProxy<PointerEventShape>;
    let pointerMove: EventListenerProxy<PointerEventShape>;
    let drawn: EventListenerProxy<DrawEvent>;
    let firstTouch: Touch;
    let firstTouchInitialY: number;

    beforeAll(async () => {
        firstTouchInitialY = 150;
        page = await TestPage.create();
        const infCanvas = await initializeInfiniteCanvas(page);
        await infCanvas.addTouchEventListener('touchstart', isSecondTouch);
        drawn = await infCanvas.addDrawEventListener();
        pointerDown = await infCanvas.addPointerEventListener('pointerdown');
        pointerMove = await infCanvas.addPointerEventListener('pointermove');
        touchCollection = await page.getTouchCollection();
        firstTouch = await touchCollection.start(150, firstTouchInitialY);  
    });

    afterAll(async () => {
        await firstTouch.end();
    })

    describe('and then a second pointer starts and default is prevented', () => {
        let secondTouch: Touch;
        let secondPointerId: number;
        let secondTouchInitialY: number;

        beforeAll(async () => {
            secondTouchInitialY = 150;
            ([{pointerId: secondPointerId}] = await getResultAfter(async () => {
                secondTouch = await touchCollection.start(150, secondTouchInitialY);
            }, () => pointerDown.getNext()));
        });

        afterAll(async () => {
            await secondTouch.end();
        })

        describe('and then the first touch moves, panning', () => {
            let pointerMoveEvent: PointerEventShape;
            let deltaY: number;

            beforeAll(async () => {
                deltaY = 100;

                ([pointerMoveEvent] = await getResultAfter(() => firstTouch.move(150, firstTouchInitialY - deltaY),
                    () => pointerMove.getNext(),
                    () => drawn.getNext()));
            });

            it('should emit a pointermove for the second touch', async () => {
                await compareToSnapshot(page, 'implicit-pointer-move-1');
                expect(pointerMoveEvent.pointerId).toBe(secondPointerId);
                expect(pointerMoveEvent.offsetY).toBeCloseTo(secondTouchInitialY + deltaY)
            });
        });
    });

    afterAll(async () => {
        await page.close();
    });
});