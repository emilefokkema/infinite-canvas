import { MappedUIEventImpl } from "../mapped-ui-event-impl";
import { InfiniteCanvasTouchEvent } from "api/infinite-canvas-touch-event";
import { TouchEventProperties } from "./touch-event-properties";
import { InternalEvent } from "../internal-events/internal-event";
import { InfiniteCanvasTouchList } from "api/infinite-canvas-touch-list";
import { TouchProperties } from "./touch-properties";
import { InfiniteCanvasTouch } from "api/infinite-canvas-touch";
import { TouchImpl } from "./touch-impl";
import { MappedEventPreventableDefault } from "../preventable-default/mapped-event-preventable-default";

class TouchListImpl extends Array<InfiniteCanvasTouch> implements InfiniteCanvasTouchList{
    public item(i: number): InfiniteCanvasTouch{
        return this[i];
    }
}

function findTouchByIdentifierInTouchList(touchList: TouchList, identifier: number){
    const length = touchList.length;
    for(let i = 0; i < length; i++){
        const touch = touchList[i];
        if(touch.identifier === identifier){
            return touch;
        }
    }
    return undefined;
}

function findTouchByIdentifier(touchLists: TouchList[], identifier: number): Touch{
    for(let list of touchLists){
        const found = findTouchByIdentifierInTouchList(list, identifier);
        if(found){
            return found;
        }
    }
    return undefined;
}
function createTouchList(touchLists: TouchList[], props: TouchProperties[]): InfiniteCanvasTouchList{
    const touches: InfiniteCanvasTouch[] = [];
    for(const prop of props){
        const touch = findTouchByIdentifier(touchLists, prop.identifier);
        if(touch){
            touches.push(new TouchImpl(touch, prop));
        }
    }
    return new TouchListImpl(...touches);
}

export class TouchEventImpl extends MappedUIEventImpl<TouchEvent> implements TouchEvent, InfiniteCanvasTouchEvent{
    public readonly touches: InfiniteCanvasTouchList;
    public readonly targetTouches: InfiniteCanvasTouchList;
    public readonly changedTouches: InfiniteCanvasTouchList;
    constructor(canvasEvent: InternalEvent, preventableDefault: MappedEventPreventableDefault, event: TouchEvent, props: TouchEventProperties){
        super(canvasEvent, preventableDefault, event);
        this.touches = createTouchList([event.touches], props.touches);
        this.targetTouches = createTouchList([event.touches], props.targetTouches);
        this.changedTouches = createTouchList([event.touches, event.changedTouches], props.changedTouches);
    }
    public get altKey(): boolean{return this.event.altKey;}
    public get ctrlKey(): boolean{return this.event.ctrlKey;}
    public get metaKey(): boolean{return this.event.metaKey;}
    public get shiftKey(): boolean{return this.event.shiftKey;}
}