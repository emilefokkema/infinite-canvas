import type { InfiniteCanvas, InfiniteCanvasCtr } from 'infinite-canvas-api'
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
}

export interface TestCaseLib{
    drawTestCase(testCaseFile: string): Promise<void>
}

export type { CanvasElementInitialization, InfiniteCanvasInitialization, CanvasElementWrapper, EventTarget, AttachedEventListener }