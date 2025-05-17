import {default as InfiniteCanvasCtr, type InfiniteCanvas, type Config } from 'infinite-canvas'

export function createInfiniteCanvas(canvasElement:  HTMLCanvasElement, config?: Partial<Config>): InfiniteCanvas{
    return new InfiniteCanvasCtr(canvasElement, config);
}