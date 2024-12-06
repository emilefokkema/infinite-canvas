import { JSHandle } from "puppeteer"
import { RuntimeEventTarget } from "@runtime-event-target/test"
import { DrawEvent, EventMap, InfiniteCanvas, InfiniteCanvasRenderingContext2D } from "api"

export type SerializedDrawEvent = Pick<DrawEvent, 'transformation'>

export type DrawEventMap = {draw: SerializedDrawEvent}

export interface TestPageInfiniteCanvas{
    handle: JSHandle<InfiniteCanvas>
    eventTarget: RuntimeEventTarget<EventMap, DrawEventMap>
    draw(drawing: (draw: (callback: (ctx: InfiniteCanvasRenderingContext2D) => void) => void) => void): Promise<void>
}