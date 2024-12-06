import type { JSHandle, Page, Mouse, Touchscreen, Keyboard } from 'puppeteer'
import type { EventTargetLike } from '../../../e2e-test-utils/runtime-event-target/shared/event-target-like'
import type { RuntimeEventTarget } from '@runtime-event-target/test'
import type { CanvasElementInitialization } from '../../test-page-app/api/configuration'
import type { Config } from 'api'
import { TestPageInfiniteCanvas } from './test-page-infinite-canvas'

export interface TestPage{
    page: Page
    mouse: Mouse
    touchscreen: Touchscreen,
    keyboard: Keyboard,
    setSize(width: number, height: number): Promise<void>
    getScreenshot(): Promise<Buffer>
    createEventTarget<TMap>(target: JSHandle<EventTargetLike<TMap>>): Promise<RuntimeEventTarget<TMap>>
    createCanvasElement(config: CanvasElementInitialization): Promise<JSHandle<HTMLCanvasElement>>
    createInfiniteCanvas(canvasElement: JSHandle<HTMLCanvasElement>, config?: Partial<Config>): Promise<TestPageInfiniteCanvas>
    measureText(
        canvas: JSHandle<{getContext(id: '2d'): CanvasRenderingContext2D}>,
        text: string
    ): Promise<TextMetrics>
    reload(): Promise<void>
    disableTouchAction(): Promise<void>
}