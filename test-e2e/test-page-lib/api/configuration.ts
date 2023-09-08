import type { Config, InfiniteCanvasRenderingContext2D } from '../../../src/api-surface/infinite-canvas';

export interface CanvasElementInitialization{
    styleWidth: string;
    styleHeight: string;
    canvasWidth: number | 'boundingclientrect';
    canvasHeight: number | 'boundingclientrect';
    spaceBelowCanvas?: number
}

export interface InfiniteCanvasInitialization extends Partial<Config>{
    drawing: (ctx: InfiniteCanvasRenderingContext2D) => void;
}