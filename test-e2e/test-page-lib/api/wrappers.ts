import { InfiniteCanvasInitialization } from './configuration'
import type { InfiniteCanvas } from '../../../src/api-surface/infinite-canvas';

export interface CanvasElementWrapper{
    canvasEl: HTMLCanvasElement;
    initializeInfiniteCanvas(config: InfiniteCanvasInitialization): Promise<InfiniteCanvas>
}

export interface AttachedEventListener<TEventType>{
    setHandler(handler: (e: TEventType) => void): void
    remove(): void
}