import { JSHandle } from "puppeteer"
import { DrawEvent, EventMap, InfiniteCanvas, InfiniteCanvasRenderingContext2D } from "api"
import { EventTargetHandle } from "puppeteer-event-target-handle"

export type SerializedDrawEvent = Pick<DrawEvent, 'transformation'>

export type DrawEventMap = {draw: SerializedDrawEvent}

export interface TestPageInfiniteCanvas{
    handle: JSHandle<InfiniteCanvas>
    eventTarget: EventTargetHandle<EventMap, DrawEventMap>
    draw(drawing: (draw: (callback: (ctx: InfiniteCanvasRenderingContext2D) => void) => void) => void): Promise<void>
}