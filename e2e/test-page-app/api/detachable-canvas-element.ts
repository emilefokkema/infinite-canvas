import { ResizeEvent } from "./resize-event"

export interface DetachableCanvasElement{
    canvas: HTMLCanvasElement
    attach(): void
    detach(): void
    addEventListener(type: 'resize', listener: (e: ResizeEvent) => void)
    removeEventListener(type: 'resize', listener: (e: ResizeEvent) => void)
}