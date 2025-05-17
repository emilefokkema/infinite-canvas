import { JSHandle } from "puppeteer";
import { firstValueFrom, fromEvent } from 'rxjs'
import { EventTargetHandleFactory } from "puppeteer-event-target-handle";
import { TestPageInfiniteCanvas } from "./test-page-infinite-canvas";
import type { EventMap, Config, InfiniteCanvasRenderingContext2D } from "api";

export async function createInfiniteCanvas(
    canvasElement: JSHandle<HTMLCanvasElement>,
    eventTargetHandleFactory: EventTargetHandleFactory,
    config?: Partial<Config>): Promise<TestPageInfiniteCanvas>{
        const infCanvas = await canvasElement.evaluateHandle(
            (canvasElement, config) => window.TestPageLib.createInfiniteCanvas(canvasElement, config),
            config
        );
        const infCanvasEventTarget = await eventTargetHandleFactory<EventMap>(infCanvas)
            .then(t => t.emitEvents({
                draw: {transformation: {a: true, b: true, c: true, d: true, e: true, f: true}}
            }))
        const drawingHandle = await infCanvas.evaluateHandle((infCanvas) => {
            const ctx = infCanvas.getContext('2d');
            return (callback: (ctx: InfiniteCanvasRenderingContext2D) => void): void => {
                callback(ctx);
            }
        })
        return {
            handle: infCanvas,
            eventTarget: infCanvasEventTarget, 
            draw 
        }
        async function draw(
            drawing: (
                draw: (callback: (ctx: InfiniteCanvasRenderingContext2D) => void) => void
            ) => void
        ): Promise<void>{
            await Promise.all([
                drawingHandle.evaluate(drawing),
                firstValueFrom(fromEvent(infCanvasEventTarget, 'draw'))
            ])
        }
}