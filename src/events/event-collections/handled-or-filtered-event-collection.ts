import { BaseEventCollection } from "./base-event-collection";
import { EventListenerCollection } from "./event-collection";
import {Transformer} from "../../transformer/transformer";
import { InfiniteCanvas } from "../../api-surface/infinite-canvas";
import { InfiniteCanvasEventSource } from "../infinite-canvas-event-source";
import { RectangleManager } from "../../rectangle/rectangle-manager";
import { Config } from "../../api-surface/config";
import { fromType } from "./from-type";
import { EventSource } from "../../event-utils/event-source";
import { map } from "../../event-utils/map";
import { InternalMouseEvent } from "../mouse-events/internal-mouse-event";
import { InternalPointerEvent } from "../mouse-events/internal-pointer-event";
import { getStages, preventPropagation } from "../create-infinite-canvas-event";
import { AnchorSet } from "../../transformer/anchor-set";
import { PointerAnchor } from "../../transformer/pointer-anchor";
import { InternalWheelEvent } from "../mouse-events/internal-wheel-event";
import { filter } from "../../event-utils/filter";
import { toTouchesArray } from "../touch-events/to-touches-array";
import { InternalTouchEvent } from "../touch-events/internal-touch-event";
import { withLatestFrom } from "../../event-utils/with-latest-from";
import { touchesContain } from "../touch-events/touches-contain";
import { concatMap } from "../../event-utils/concat-map";
import { sequence } from "../../event-utils/sequence";
import { HandledOrFilteredEventMap } from "../infinite-canvas-event-map";
import { CustomEventImpl } from "../custom-event-impl";
import { SimpleInternalEvent } from "../internal-events/simple-internal-event";

class CanvasIgnoredEvent extends SimpleInternalEvent<Event>{
    constructor(private readonly type: string){
        super(true)
    }
    protected createResultEvent(): Event{
        return new CustomEventImpl(this, this.preventableDefault, this.type);
    }
}

export class HandledOrFilteredEventCollection extends BaseEventCollection<keyof HandledOrFilteredEventMap, HandledOrFilteredEventMap>{
    private readonly anchorSet: AnchorSet;
    constructor(
        canvas: EventListenerCollection<HTMLElementEventMap>,
        private readonly transformer: Transformer,
        rectangleManager: RectangleManager,
        infiniteCanvas: InfiniteCanvas,
        private readonly config: Config
    ){
        super(rectangleManager, infiniteCanvas);
        this.anchorSet = new AnchorSet();
        const pointerDown: EventSource<PointerEvent> = fromType(canvas, 'pointerdown');
        const pointerLeave: EventSource<PointerEvent> = fromType(canvas, 'pointerleave');
        const pointerMove: EventSource<PointerEvent> = fromType(canvas, 'pointermove');
        const pointerUp: EventSource<PointerEvent> = fromType(canvas, 'pointerup');
        const pointerCancel: EventSource<PointerEvent> = fromType(canvas, 'pointercancel');
        const touchMove: EventSource<TouchEvent> = filter(
            fromType(canvas, 'touchmove'),
            ev => touchesContain(ev.targetTouches, t => !this.hasFixedAnchorForTouch(t.identifier))
        );

        pointerDown.addListener(e => this.anchorSet.updateAnchorForPointerEvent(e));
        pointerMove.addListener(e => this.anchorSet.updateAnchorForPointerEvent(e));
        pointerUp.addListener(e => this.removePointer(e));
        pointerLeave.addListener(e => this.removePointer(e));
        //pointerCancel.addListener(e => this.removePointer(e));
        const mouseDownMapped = map(fromType(canvas, 'mousedown'), ev => new InternalMouseEvent(ev, true));
        const wheelMapped = map(fromType(canvas, 'wheel'), e => new InternalWheelEvent(e, true));
        const touchStartMapped = map(fromType(canvas, 'touchstart'), ev => {
            const touches = toTouchesArray(ev.targetTouches);
            const changedTouches = toTouchesArray(ev.changedTouches);
            return InternalTouchEvent.create(
                this.rectangleManager.rectangle,
                ev,
                touches,
                changedTouches,
                true
            )
        });

        const pointerDownMapped = map(pointerDown, ev => new InternalPointerEvent(ev, true));
        const {captureSource: pointerDownCaptureSource, bubbleSource: pointerDownBubbleSource, afterBubble: pointerDownAfterBubble} = getStages(pointerDownMapped);
        const {captureSource: mouseDownCaptureSource, bubbleSource: mouseDownBubbleSource, afterBubble: mouseDownAfterBubble} = getStages(mouseDownMapped);
        const {captureSource: touchStartCaptureSource, bubbleSource: touchStartBubbleSource, afterBubble: touchStartAfterBubble} = getStages(touchStartMapped);
        const {captureSource: wheelCaptureSource, bubbleSource: wheelBubbleSource, afterBubble: wheelAfterBubble} = getStages(wheelMapped);
        const wheelIgnoredMapped = map(
            filter(wheelAfterBubble, (e) => 
                !this.config.greedyGestureHandling && 
                !e.event.ctrlKey &&
                !e.infiniteCanvasDefaultPrevented),
            () => new CanvasIgnoredEvent('wheelignored'));
        const {captureSource: wheelIgnoredCaptureSource, bubbleSource: wheelIgnoredBubbleSource, afterBubble: wheelIgnoredAfterBubble} = getStages(wheelIgnoredMapped);

        wheelAfterBubble.addListener((e) => {
            if(!e.infiniteCanvasDefaultPrevented){
                this.zoom(e.event);
            }
        });
        wheelIgnoredAfterBubble.addListener((e) => {
            if(!e.infiniteCanvasDefaultPrevented){
                console.warn('use ctrl + scroll to zoom')
            }
        })
        withLatestFrom(mouseDownAfterBubble, pointerDownAfterBubble).addListener(([mouseDownEv, latestPointerDownEv]) => {
            if(!mouseDownEv.infiniteCanvasDefaultPrevented && !latestPointerDownEv.infiniteCanvasDefaultPrevented){
                this.transformUsingPointer(mouseDownEv.event, latestPointerDownEv.event);
            }
        });
        const touchStartAfterBubbleOneTouch = filter(touchStartAfterBubble, ev => ev.event.changedTouches.length === 1);
        const touchStartAndPointerDown = withLatestFrom(touchStartAfterBubbleOneTouch, pointerDownAfterBubble);
        touchStartAndPointerDown.addListener(([touchStartEv, latestPointerDownEv]) => {
            const touch: Touch = touchStartEv.event.changedTouches[0];
            const pointerAnchor: PointerAnchor = this.anchorSet.getAnchorForPointerEvent(latestPointerDownEv.event);
            if(!pointerAnchor){
                return;
            }
            pointerAnchor.setTouchId(touch.identifier);
            if(!touchStartEv.infiniteCanvasDefaultPrevented && !latestPointerDownEv.infiniteCanvasDefaultPrevented){
                if(this.config.greedyGestureHandling){
                    this.rectangleManager.measure();
                    this.transformer.addAnchor(pointerAnchor.anchor);
                    touchStartEv.event.preventDefault();
                }else{
                    const otherAnchor: PointerAnchor = this.anchorSet.find(a => a.touchId !== undefined && a !== pointerAnchor && !a.defaultPrevented);
                    if(!otherAnchor){
                        return;
                    }
                    this.rectangleManager.measure();
                    this.transformer.addAnchor(otherAnchor.anchor);
                    this.transformer.addAnchor(pointerAnchor.anchor);
                    touchStartEv.event.preventDefault();
                }
            }else{
                pointerAnchor.preventDefault();
            }
        });

        const pointerCancelAndTouchStartAndPointerDown = filter(withLatestFrom(pointerCancel, touchStartAndPointerDown),
            ([pointerCancelEv, [_, pointerDownEv]]) => pointerCancelEv.pointerId === pointerDownEv.event.pointerId);

        pointerCancelAndTouchStartAndPointerDown.addListener(([pointerCancelEv]) => {
            this.removePointer(pointerCancelEv)
        });

        const touchIgnoredMapped = map(filter(pointerCancelAndTouchStartAndPointerDown, ([_, [touchStartEv, pointerDownEv]]) =>
                !this.config.greedyGestureHandling &&
                !touchStartEv.infiniteCanvasDefaultPrevented &&
                !pointerDownEv.infiniteCanvasDefaultPrevented),
            () => new CanvasIgnoredEvent('touchignored'));
        
        const {captureSource: touchIgnoredCaptureSource, bubbleSource: touchIgnoredBubbleSource, afterBubble: touchIgnoredAfterBubble} = getStages(touchIgnoredMapped);

        touchIgnoredAfterBubble.addListener((e) => {
            if(!e.infiniteCanvasDefaultPrevented){
                console.warn('use two fingers to move')
            }
        })
        this.cache = {
            mousemove: this.map(filter(fromType(canvas, 'mousemove'), () => !this.mouseAnchorIsFixed()), ev => new InternalMouseEvent(ev)),
            mousedown: preventPropagation(mouseDownCaptureSource, mouseDownBubbleSource, rectangleManager, infiniteCanvas),
            pointerdown: preventPropagation(pointerDownCaptureSource, pointerDownBubbleSource, rectangleManager, infiniteCanvas),
            pointermove: this.map(
                    concatMap(
                        filter(pointerMove, () => this.hasNonFixedAnchorForSomePointer()),
                        () => sequence(this.anchorSet.getAll(a => !a.anchor.fixedOnInfiniteCanvas).map(a => a.pointerEvent))
                    ),
                    (e) => new InternalPointerEvent(e)
                    ),
            pointerleave: this.map(pointerLeave, e => new InternalPointerEvent(e)),
            pointerup: this.map(pointerUp, e => new InternalPointerEvent(e)),
            pointercancel: this.map(pointerCancel, e => new InternalPointerEvent(e)),
            wheel: preventPropagation(wheelCaptureSource, wheelBubbleSource, rectangleManager, infiniteCanvas),
            wheelignored: preventPropagation(wheelIgnoredCaptureSource, wheelIgnoredBubbleSource, rectangleManager, infiniteCanvas),
            touchstart: preventPropagation(touchStartCaptureSource, touchStartBubbleSource, rectangleManager, infiniteCanvas),
            touchignored: preventPropagation(touchIgnoredCaptureSource, touchIgnoredBubbleSource, rectangleManager, infiniteCanvas),
            touchmove: this.map(touchMove, ev => {
                const touches = toTouchesArray(ev.targetTouches);
                const changedTouches = toTouchesArray(ev.targetTouches, t => !this.hasFixedAnchorForTouch(t.identifier));
                return InternalTouchEvent.create(
                    this.rectangleManager.rectangle,
                    ev,
                    touches,
                    changedTouches
                );
            })
        };
    }
    protected getEventSource(type: keyof HandledOrFilteredEventMap): InfiniteCanvasEventSource<HandledOrFilteredEventMap[keyof HandledOrFilteredEventMap]>{
        return this.cache[type];
    }
    private mouseAnchorIsFixed(): boolean{
        const mouseAnchor = this.anchorSet.find(a => a.pointerEvent.pointerType === 'mouse')
        if(!mouseAnchor){
            return false;
        }
        return mouseAnchor.anchor.fixedOnInfiniteCanvas;
    }
    private hasFixedAnchorForTouch(touchId: number): boolean{
        const anchorForTouch = this.anchorSet.getAnchorForTouch(touchId);
        return !!anchorForTouch && anchorForTouch.anchor.fixedOnInfiniteCanvas;
    }
    private hasNonFixedAnchorForSomePointer(): boolean{
        return !!this.anchorSet.find(a => !a.anchor.fixedOnInfiniteCanvas);
    }
    private transformUsingPointer(mouseEv: MouseEvent, pointerEv: PointerEvent): void{
        this.rectangleManager.measure();
        const anchor: PointerAnchor = this.anchorSet.getAnchorForPointerEvent(pointerEv);
        if(!anchor){
            return;
        }
        if(pointerEv.button === 1 && this.config.rotationEnabled){
            mouseEv.preventDefault();
            this.transformer.addRotationAnchor(anchor.anchor)
        }else if(pointerEv.button === 0){
            this.transformer.addAnchor(anchor.anchor);
        }
    }
    private removePointer(ev: PointerEvent): void{
        const anchor: PointerAnchor = this.anchorSet.getAnchorForPointerEvent(ev);
        if(!anchor){
            return;
        }
        this.transformer.releaseAnchor(anchor.anchor);
        this.anchorSet.removeAnchor(anchor);
    }
    private zoom(ev: WheelEvent): void{
        if(!this.config.greedyGestureHandling && !ev.ctrlKey){
            return;
        }
        const {offsetX: x, offsetY: y} = ev;
        let delta: number = ev.deltaY;
        const scale: number = Math.pow(2, -delta / 300);
        this.rectangleManager.measure();
        this.transformer.zoom(x, y, scale);
        ev.preventDefault();
    }
}