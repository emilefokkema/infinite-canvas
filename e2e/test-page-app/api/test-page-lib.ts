import { CanvasElementInitialization } from "./configuration";
import { InfiniteCanvas } from '../../../src/api/infinite-canvas'
import { Config } from '../../../src/api/config'
import { DetachableCanvasElement } from "./detachable-canvas-element";

export interface TestPageLib{
    createCanvasElement(config: CanvasElementInitialization): HTMLCanvasElement
    createInfiniteCanvas(canvasElement:  HTMLCanvasElement, config?: Partial<Config>): InfiniteCanvas
    measureText(
        canvas: {getContext(id: '2d'): CanvasRenderingContext2D},
        text: string
    ): TextMetrics
    disableTouchAction(): void
    createDetachableCanvasElement(): DetachableCanvasElement
}