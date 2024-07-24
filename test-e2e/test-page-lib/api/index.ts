import type { InfiniteCanvas, InfiniteCanvasCtr } from 'infinite-canvas-api'
import type { ResizeEvent, ResizeEvents } from './resize-events'
import { CanvasElementInitialization, InfiniteCanvasInitialization } from './configuration';
import { CanvasElementWrapper, AttachedEventListener } from './wrappers';
import { EventTarget } from './event-target'

declare global{
    interface Window{
        TestPageLib: TestPageLib
        TestCaseLib: TestCaseLib
    }
}

export const EVENT_LISTENER_DATA = 'EVENT_LISTENER_DATA'

export interface TestPageLib{
    InfiniteCanvas: InfiniteCanvasCtr,
    initializeCanvasElement(config: CanvasElementInitialization): CanvasElementWrapper
    initializeInfiniteCanvas(config: CanvasElementInitialization & InfiniteCanvasInitialization): Promise<InfiniteCanvas>
    openMessagePort(url: string): Promise<void>;
    addEventListener<
        TEventName,
        TEventType,
        TEventTarget extends EventTarget<TEventType, TEventName>
        >(target: TEventTarget, name: TEventName, capture: boolean | undefined, eventListenerId: string): AttachedEventListener<TEventType>
    makeSerializableTextMetrics(textMetrics: TextMetrics): TextMetrics
    getResizeEvents(element: Element): ResizeEvents
}

export interface TestCaseLib{
    drawTestCase(testCaseId: string): Promise<void>
}

export type { 
    CanvasElementInitialization,
    InfiniteCanvasInitialization,
    CanvasElementWrapper,
    EventTarget,
    AttachedEventListener,
    ResizeEvent,
    ResizeEvents
}